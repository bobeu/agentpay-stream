/**
 * AgentPay Stream TypeScript Client
 * 
 * This file contains TypeScript types and helper functions for interacting
 * with the AgentPay Stream Move smart contract.
 * 
 * After deploying the contract, update the CONTRACT_ADDRESS and MODULE_NAME
 * constants with the actual deployed values.
 */

import { aptosClient, CONTRACT_ADDRESS } from './aptosClient';
import { Account, AccountAddress, U64 } from '@aptos-labs/ts-sdk';

export const MODULE_NAME = 'agent_pay_stream';

// TypeScript types matching Move structs
export interface StreamResource {
  stream_id: string;
  sender: string;
  recipient: string;
  amount: string;
  start_time: string;
  end_time: string;
  rate_per_second: string;
  withdrawn: string;
}

export interface StreamCreatedEvent {
  stream_id: string;
  sender: string;
  recipient: string;
  amount: string;
  start_time: string;
  end_time: string;
}

/**
 * Create a new payment stream
 */
export async function createStream(
  account: Account,
  recipient: AccountAddress,
  amount: U64,
  durationSeconds: U64
): Promise<string> {
  const transaction = await aptosClient.transaction.build.simple({
    sender: account.accountAddress,
    data: {
      function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::create_stream`,
      functionArguments: [recipient, amount, durationSeconds],
    },
  });

  const pendingTxn = await aptosClient.signAndSubmitTransaction({ signer: account, transaction });
  await aptosClient.waitForTransaction({ transactionHash: pendingTxn.hash });
  
  return pendingTxn.hash;
}

/**
 * Get stream information
 */
export async function getStream(
  sender: AccountAddress,
  streamId: U64
): Promise<StreamResource> {
  const viewResponse = await aptosClient.view({
    payload: {
      function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::get_stream`,
      functionArguments: [sender, streamId],
    },
  });

  const [senderAddr, recipient, amount, startTime, endTime, ratePerSecond, withdrawn] = viewResponse as [
    string,
    string,
    string,
    string,
    string,
    string,
    string
  ];

  return {
    stream_id: streamId.toString(),
    sender: senderAddr,
    recipient,
    amount,
    start_time: startTime,
    end_time: endTime,
    rate_per_second: ratePerSecond,
    withdrawn,
  };
}

/**
 * Withdraw available funds from a stream
 */
export async function withdrawFromStream(
  account: Account,
  sender: AccountAddress,
  streamId: U64
): Promise<string> {
  const transaction = await aptosClient.transaction.build.simple({
    sender: account.accountAddress,
    data: {
      function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::withdraw_from_stream`,
      functionArguments: [sender, streamId],
    },
  });

  const pendingTxn = await aptosClient.signAndSubmitTransaction({ signer: account, transaction });
  await aptosClient.waitForTransaction({ transactionHash: pendingTxn.hash });
  
  return pendingTxn.hash;
}

/**
 * Cancel a stream (only sender can cancel)
 */
export async function cancelStream(
  account: Account,
  streamId: U64
): Promise<string> {
  const transaction = await aptosClient.transaction.build.simple({
    sender: account.accountAddress,
    data: {
      function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::cancel_stream`,
      functionArguments: [streamId],
    },
  });

  const pendingTxn = await aptosClient.signAndSubmitTransaction({ signer: account, transaction });
  await aptosClient.waitForTransaction({ transactionHash: pendingTxn.hash });
  
  return pendingTxn.hash;
}

