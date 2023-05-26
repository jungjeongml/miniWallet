import { IBlock } from '@core/block/block.interface'
import { TransactionRow } from '@core/transaction/transaction.interface'

export type MessageType = 'latestBlock' | 'allBlock' | 'receivedChain' | 'receivedTransaction'
export type Payload = IBlock | IBlock[] | TransactionRow

export interface MessageData {
  type: MessageType
  payload: Payload
}

// type MessageType = 'latestBlock' | 'allBlock'
// type Payload = IBlock | IBlock[]
// interface MessageData {
//  type:MessageType
//  payload: Payload
//}