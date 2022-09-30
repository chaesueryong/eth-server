import { getConnection } from "typeorm";
import { Block } from "../../../db/entity/Block";
import {BlockStatus} from "../../../db/entity/BlockStatus";

export async function post(req) {
    try {
        const { count } = req.body;
        let blockList = [];

        const blockStatus = await getConnection()
            .createQueryBuilder()
            .select('blockStatus')
            .from(BlockStatus, 'blockStatus')
            .where('blockStatus.id = :id', { id: 0 })
            .getOne();

        for(let i = count - 1; 0 <= i; i--){
            blockList.push(blockStatus.syncBlockNumber - i);
        }

        const latestBlockList = await getConnection()
            .createQueryBuilder()
            .select('block')
            .from(Block, 'block')
            .where("block.id IN (:...ids)", { ids: blockList })
            .execute();

        return latestBlockList;
    }catch (e) {
        return e;
    }
}
