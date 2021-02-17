import { Withdrawal } from './withdrawal'
import { Utxo } from './utxo'
import { Migration } from './migration'
import { Layer2 } from './layer2'

export type Outflow = Utxo | Withdrawal | Migration | Layer2
