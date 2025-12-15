module agentpay_stream::agent_pay_stream {
    use std::signer;
    use aptos_framework::timestamp;

    /// Stream resource to track payment streams
    struct StreamResource has key {
        stream_id: u64,
        sender: address,
        recipient: address,
        amount: u64,
        start_time: u64,
        end_time: u64,
        rate_per_second: u64,
        withdrawn: u64,
    }

    /// Stream counter to generate unique stream IDs
    struct StreamCounter has key {
        counter: u64,
    }

    /// Event emitted when a stream is created
    struct StreamCreatedEvent has drop, store {
        stream_id: u64,
        sender: address,
        recipient: address,
        amount: u64,
        start_time: u64,
        end_time: u64,
    }

    /// Initialize the module
    fun init_module(account: &signer) {
        move_to(account, StreamCounter { counter: 0 });
    }

    /// Create a new payment stream
    public entry fun create_stream(
        sender: &signer,
        recipient: address,
        amount: u64,
        duration_seconds: u64,
    ) acquires StreamCounter {
        let sender_addr = signer::address_of(sender);
        let current_time = timestamp::now_seconds();
        let end_time = current_time + duration_seconds;
        let rate_per_second = amount / duration_seconds;

        let counter = borrow_global_mut<StreamCounter>(sender_addr);
        let stream_id = counter.counter;
        counter.counter = counter.counter + 1;

        let stream = StreamResource {
            stream_id,
            sender: sender_addr,
            recipient,
            amount,
            start_time: current_time,
            end_time,
            rate_per_second,
            withdrawn: 0,
        };

        move_to(sender, stream);
    }

    /// Get stream information
    public fun get_stream(sender: address, stream_id: u64): (address, address, u64, u64, u64, u64, u64) acquires StreamResource {
        let stream = borrow_global<StreamResource>(sender);
        assert!(stream.stream_id == stream_id, 1);
        (
            stream.sender,
            stream.recipient,
            stream.amount,
            stream.start_time,
            stream.end_time,
            stream.rate_per_second,
            stream.withdrawn,
        )
    }

    /// Withdraw available funds from a stream
    public entry fun withdraw_from_stream(
        recipient: &signer,
        sender: address,
        stream_id: u64,
    ) acquires StreamResource {
        let recipient_addr = signer::address_of(recipient);
        let stream = borrow_global_mut<StreamResource>(sender);
        
        assert!(stream.stream_id == stream_id, 1);
        assert!(stream.recipient == recipient_addr, 2);

        let current_time = timestamp::now_seconds();
        let elapsed = if (current_time > stream.end_time) {
            stream.end_time - stream.start_time
        } else {
            current_time - stream.start_time
        };

        let available = stream.rate_per_second * elapsed;
        let withdrawable = available - stream.withdrawn;

        stream.withdrawn = stream.withdrawn + withdrawable;
    }

    /// Cancel a stream (only sender can cancel)
    public entry fun cancel_stream(
        sender: &signer,
        stream_id: u64,
    ) acquires StreamResource {
        let sender_addr = signer::address_of(sender);
        let stream = borrow_global_mut<StreamResource>(sender_addr);
        
        assert!(stream.stream_id == stream_id, 1);
        assert!(stream.sender == sender_addr, 2);

        // Delete the stream resource
        let StreamResource {
            stream_id: _,
            sender: _,
            recipient: _,
            amount: _,
            start_time: _,
            end_time: _,
            rate_per_second: _,
            withdrawn: _,
        } = move_from<StreamResource>(sender_addr);
    }
}

