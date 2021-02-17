import { Field, F } from '@zkopru/babyjubjub'
import { Uint256, Bytes32 } from 'soltypes'
import { soliditySha3 } from 'web3-utils'
import { ZkAddress } from './zk-address'
import { ZkOutflow, PublicData } from './zk-tx'
import { Note, OutflowType, NoteStatus, Asset } from './note'

export enum Layer2Status {
  NON_INCLUDED = NoteStatus.NON_INCLUDED,
  UNFINALIZED = NoteStatus.WAITING_FINALIZATION,
  WITHDRAWABLE = NoteStatus.WITHDRAWABLE,
  TRANSFERRED = NoteStatus.TRANSFERRED,
  WITHDRAWN = NoteStatus.WITHDRAWN,
}

export class Layer2 extends Note {
  status: Layer2Status

  publicData: {
    layer2: Field
    to: Field
    fee: Field
  }

  constructor(
    owner: ZkAddress,
    salt: Field,
    asset: Asset,
    publicData: {
      to: Field
      layer2: Field
      fee: Field
    },
  ) {
    super(owner, salt, asset)
    this.publicData = publicData
    this.outflowType = OutflowType.LAYER2
    this.status = Layer2Status.NON_INCLUDED
  }

  toZkOutflow(): ZkOutflow {
    const outflow = {
      note: this.hash(),
      outflowType: Field.from(OutflowType.LAYER2),
      data: {
        layer2: this.publicData.layer2,
        to: this.publicData.to,
        eth: this.asset.eth,
        tokenAddr: this.asset.tokenAddr,
        erc20Amount: this.asset.erc20Amount,
        nft: this.asset.nft,
        fee: this.publicData.fee,
      },
    }
    return outflow
  }

  layer2Hash(): Uint256 {
    return Layer2.layer2Hash(this.hash(), {
      layer2: this.publicData.layer2,
      to: this.publicData.to,
      eth: this.asset.eth,
      tokenAddr: this.asset.tokenAddr,
      erc20Amount: this.asset.erc20Amount,
      nft: this.asset.nft,
      fee: this.publicData.fee,
    })
  }

  static layer2Hash(note: Field, publicData: PublicData): Uint256 {
    const concatenated = Buffer.concat([
      note.toBytes32().toBuffer(),
      publicData.layer2.toAddress().toBuffer(),
      publicData.to.toAddress().toBuffer(),
      publicData.eth.toBytes32().toBuffer(),
      publicData.tokenAddr.toAddress().toBuffer(),
      publicData.erc20Amount.toBytes32().toBuffer(),
      publicData.nft.toBytes32().toBuffer(),
      publicData.fee.toBytes32().toBuffer(),
    ])
    const result = soliditySha3(`0x${concatenated.toString('hex')}`)
    //  uint256 note = uint256(keccak256(abi.encodePacked(owner, eth, token, amount, nft, fee)));
    if (result === null) throw Error('hash result is null')
    return Bytes32.from(result).toUint()
  }

  static from(note: Note, layer2: F, to: F, fee: F): Layer2 {
    return new Layer2(note.owner, note.salt, note.asset, {
      layer2: Field.from(layer2),
      to: Field.from(to),
      fee: Field.from(fee),
    })
  }
}
