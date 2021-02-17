import { genesisRoot, poseidonHasher, keccakHasher } from '@zkopru/tree'
import { bnToBytes32, bnToUint256 } from '@zkopru/utils'
import { Address, Bytes32 } from 'soltypes'
import BN from 'bn.js'
import { Config } from '@zkopru/prisma'
import { Header } from './types'

export const genesis = ({
  address,
  parent,
  config,
}: {
  address: Address
  parent: Bytes32
  config: Config
}): Header => {
  const utxoHasher = poseidonHasher(config.utxoTreeDepth)
  const withdrawalHasher = keccakHasher(config.withdrawalTreeDepth)
  const layer2Hasher = keccakHasher(config.layer2TreeDepth)
  const nullifierHasher = keccakHasher(config.nullifierTreeDepth)
  const utxoRoot = genesisRoot(utxoHasher).toUint256()
  const withdrawalRoot = bnToUint256(genesisRoot(withdrawalHasher))
  const layer2Root = bnToUint256(genesisRoot(layer2Hasher))
  const nullifierRoot = bnToBytes32(genesisRoot(nullifierHasher))
  const zeroBytes = bnToBytes32(new BN(0))
  return {
    proposer: address,
    parentBlock: parent,
    fee: zeroBytes.toUint(),
    utxoRoot,
    utxoIndex: zeroBytes.toUint(),
    nullifierRoot,
    withdrawalRoot,
    withdrawalIndex: zeroBytes.toUint(),
    layer2Root,
    layer2Index: zeroBytes.toUint(),
    txRoot: zeroBytes,
    depositRoot: zeroBytes,
    migrationRoot: zeroBytes,
  }
}
