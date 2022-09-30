import { getConnection } from "typeorm";
import { BlockStatus } from '../../../db/entity/BlockStatus';
import { SyncDbBlock } from '../../../util/SyncDbBlock';

// 2잔수 16진수 입력 차단
export async function get(req) {
    try {
        SyncDbBlock.isBlockSync = !SyncDbBlock.isBlockSync;

        await getConnection()
            .createQueryBuilder()
            .update(BlockStatus)
            .set({ isSyncBlock: SyncDbBlock.isBlockSync })
            .where("id = :id", { id: 0 })
            .execute();


        if(SyncDbBlock.isBlockSync){
            SyncDbBlock.syncBlock();
        }

        return {
            isBlockSync: SyncDbBlock.isBlockSync
        };
    }catch (e) {
        return e;
    }
}
