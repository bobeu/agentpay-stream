#[test_only]
module agentpay_stream::agent_pay_stream_test {
    use std::signer;
    use agentpay_stream::agent_pay_stream;
    use aptos_framework::timestamp;
    use aptos_framework::account;

    #[test(account = @0x1)]
    fun test_create_stream(account: signer) {
        let recipient = @0x2;
        let amount = 1000;
        let duration = 100;

        timestamp::set_time_has_started_for_testing(&account);

        let stream_id = agent_pay_stream::create_stream(&account, recipient, amount, duration);
        assert!(stream_id == 0, 1);
    }

    #[test(account = @0x1)]
    fun test_get_stream(account: signer) {
        let recipient = @0x2;
        let amount = 1000;
        let duration = 100;

        timestamp::set_time_has_started_for_testing(&account);

        let stream_id = agent_pay_stream::create_stream(&account, recipient, amount, duration);
        let (sender_addr, recipient_addr, stream_amount, start, end, rate, withdrawn) = 
            agent_pay_stream::get_stream(signer::address_of(&account), stream_id);

        assert!(sender_addr == signer::address_of(&account), 1);
        assert!(recipient_addr == recipient, 2);
        assert!(stream_amount == amount, 3);
        assert!(withdrawn == 0, 4);
    }
}

