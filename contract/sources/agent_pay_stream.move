module agentpay_addr::agent_pay_stream {
    use std::signer;
    use std::vector;
    use std::string::String; // Removed {Self, String} as Self was unused
    use aptos_framework::coin; // Removed {Self, Coin} as Coin was unused
    use aptos_framework::timestamp;
    use aptos_framework::type_info;

    /// Error Codes
    const ENOT_RECIPIENT: u64 = 1;
    const ESTREAM_NOT_FOUND: u64 = 3;
    const EALREADY_WITHDRAWN: u64 = 5;

    struct Stream has store, drop, copy {
        stream_id: u64,
        sender: address,
        recipient: address,
        amount: u64,
        start_time: u64,
        end_time: u64,
        withdrawn: u64,
        is_active: bool,
        coin_type: String, // To help the frontend identify the asset
    }

    struct StreamStore has key {
        streams: vector<Stream>,
        stream_counter: u64,
    }

    /// Escrow for any coin type <T>
    struct Escrow<phantom T> has key {
        coins: coin::Coin<T>
    }

    fun init_module(admin: &signer) {
        move_to(admin, StreamStore {
            streams: vector::empty<Stream>(),
            stream_counter: 0,
        });
    }

    /// Create stream with any Coin type T (e.g., 0x1::aptos_coin::AptosCoin)
    public entry fun create_stream<T>(
        sender: &signer,
        recipient: address,
        amount: u64,
        duration_seconds: u64,
    ) acquires StreamStore, Escrow {
        let sender_addr = signer::address_of(sender);
        let current_time = timestamp::now_seconds();
        
        // Transfer coins to escrow
        let coins_to_lock = coin::withdraw<T>(sender, amount);
        // 1. Check existence at the contract address
        if (!exists<Escrow<T>>(@agentpay_addr)) {
            // If it doesn't exist, we must move it to an account we have the signer for.
            // If you want it under the contract, you need the contract's signer.
            // TEMPORARY FIX: Move it to the sender, but fix the existence check!
            
            if (!exists<Escrow<T>>(sender_addr)) {
                move_to(sender, Escrow<T> { coins: coins_to_lock });
            } else {
                let escrow = borrow_global_mut<Escrow<T>>(sender_addr);
                coin::merge(&mut escrow.coins, coins_to_lock);
            }
        } else {
            let escrow = borrow_global_mut<Escrow<T>>(@agentpay_addr);
            coin::merge(&mut escrow.coins, coins_to_lock);
        };

        let store = borrow_global_mut<StreamStore>(@agentpay_addr);
        let stream_id = store.stream_counter;
        
        let new_stream = Stream {
            stream_id,
            sender: sender_addr,
            recipient,
            amount,
            start_time: current_time,
            end_time: current_time + duration_seconds,
            withdrawn: 0,
            is_active: true,
            coin_type: type_info::type_name<T>(),
        };

        vector::push_back(&mut store.streams, new_stream);
        store.stream_counter = stream_id + 1;
    }

    /// Withdraw accrued tokens of type T
    public entry fun withdraw_from_stream<T>(
        recipient: &signer,
        stream_id: u64,
    ) acquires StreamStore, Escrow {
        let recipient_addr = signer::address_of(recipient);
        let store = borrow_global_mut<StreamStore>(@agentpay_addr);
        let i = 0;
        let streams_len = vector::length(&store.streams);
        
        while (i < streams_len) {
            let stream = vector::borrow_mut(&mut store.streams, i);
            if (stream.stream_id == stream_id) {
                assert!(stream.recipient == recipient_addr, ENOT_RECIPIENT);
                
                let current_time = timestamp::now_seconds();
                let elapsed = if (current_time >= stream.end_time) { stream.end_time - stream.start_time } 
                              else { current_time - stream.start_time };

                let accrued = (((stream.amount as u128) * (elapsed as u128)) / ((stream.end_time - stream.start_time) as u128) as u64);
                let withdrawable = accrued - stream.withdrawn;
                assert!(withdrawable > 0, EALREADY_WITHDRAWN);

                stream.withdrawn = stream.withdrawn + withdrawable;

                // Move actual tokens from Escrow to recipient
                let escrow = borrow_global_mut<Escrow<T>>(@agentpay_addr);
                let payment = coin::extract(&mut escrow.coins, withdrawable);
                coin::deposit(recipient_addr, payment);
            };
            i = i + 1;
        };
    }

    #[view]
    public fun get_user_streams(user: address): vector<Stream> acquires StreamStore {
        let store = borrow_global<StreamStore>(@agentpay_addr);
        let user_streams = vector::empty<Stream>();
        let i = 0;
        while (i < vector::length(&store.streams)) {
            let s = vector::borrow(&store.streams, i);
            if (s.sender == user || s.recipient == user) {
                vector::push_back(&mut user_streams, *s);
            };
            i = i + 1;
        };
        user_streams
    }
}