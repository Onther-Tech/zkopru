import { DB, LightTree, TreeSpecies } from '@zkopru/prisma'
import BN from 'bn.js'
import { toBN } from 'web3-utils'
import {
  LightRollUpTree,
  TreeMetadata,
  TreeData,
  TreeConfig,
} from './light-rollup-tree'

export class Layer2Tree extends LightRollUpTree<BN> {
  zero = toBN(0)

  addressesToObserve?: string[]

  constructor(conf: {
    db: DB
    metadata: TreeMetadata<BN>
    data: TreeData<BN>
    config: TreeConfig<BN>
  }) {
    super({ ...conf, species: TreeSpecies.LAYER2 })
  }

  updateAddresses(addresses: string[]) {
    this.addressesToObserve = addresses
  }

  async indexesOfTrackingLeaves(): Promise<BN[]> {
    const keys: string[] = this.addressesToObserve || []

    const trackingLeaves = await this.db.read(prisma =>
      prisma.withdrawal.findMany({
        where: {
          AND: [
            { treeId: this.metadata.id },
            { OR: [{ to: { in: keys } }, { prepayer: { in: keys } }] },
          ],
        },
      }),
    )
    return trackingLeaves
      .filter(leaf => leaf.index !== null)
      .map(leaf => toBN(leaf.index as string))
  }

  static async bootstrap({
    db,
    metadata,
    data,
    config,
  }: {
    db: DB
    metadata: TreeMetadata<BN>
    data: TreeData<BN>
    config: TreeConfig<BN>
  }): Promise<Layer2Tree> {
    const initialData = await LightRollUpTree.initTreeFromDatabase({
      db,
      species: TreeSpecies.LAYER2,
      metadata,
      data,
      config,
    })
    return new Layer2Tree({ ...initialData })
  }

  static from(db: DB, obj: LightTree, config: TreeConfig<BN>): Layer2Tree {
    return new Layer2Tree({
      db,
      metadata: {
        id: obj.id,
        species: obj.species,
        start: toBN(obj.start),
        end: toBN(obj.end),
      },
      data: {
        root: toBN(obj.root),
        index: toBN(obj.index),
        siblings: JSON.parse(obj.siblings).map(toBN),
      },
      config,
    })
  }
}
