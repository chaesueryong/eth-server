import { getConnection } from "typeorm";
import { Block } from "../../../db/entity/Block";

export async function post(req) {
    try {
        const index = req.body

        const isInfo = await getConnection()
            .createQueryBuilder()
            .select('block')
            .from(Block, 'block')
            .take(25)
            .execute();

        return isInfo;
    }catch (e) {
        return e;
    }
}
