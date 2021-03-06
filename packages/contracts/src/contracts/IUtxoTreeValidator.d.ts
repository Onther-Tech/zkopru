/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import BN from 'bn.js'
import { Contract, ContractOptions } from 'web3-eth-contract'
import { EventLog } from 'web3-core'
import { EventEmitter } from 'events'
import { ContractEvent, Callback, TransactionObject, BlockType } from './types'

interface EventOptions {
  filter?: object
  fromBlock?: BlockType
  topics?: string[]
}

export class IUtxoTreeValidator extends Contract {
  constructor(jsonInterface: any[], address?: string, options?: ContractOptions)

  clone(): IUtxoTreeValidator

  methods: {
    validateUTXOIndex(
      blockData: string | number[],
      parentHeader: string | number[],
      deposits: (number | string)[],
    ): TransactionObject<{
      slash: boolean
      reason: string
      0: boolean
      1: string
    }>

    validateUTXORoot(
      blockData: string | number[],
      parentHeader: string | number[],
      deposits: (number | string)[],
      initialSiblings: (number | string)[],
    ): TransactionObject<{
      slash: boolean
      reason: string
      0: boolean
      1: string
    }>
  }

  events: {
    allEvents: (options?: EventOptions, cb?: Callback<EventLog>) => EventEmitter
  }
}
