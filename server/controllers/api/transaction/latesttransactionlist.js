import { getConnection } from "typeorm";
import { Transaction } from "../../../db/entity/Transaction";

export async function post(req) {
    try {
        const { count } = req.body;
        let transactionList = [];

        const lastTransactionIndex = await getConnection()
            .createQueryBuilder()
            .select('transaction')
            .from(Transaction, 'transaction')
            .getCount();


        for(let i = count - 1; 0 <= i; i--) {
            transactionList.push(lastTransactionIndex - i);
        }

        const latestTransactionList = await getConnection()
            .createQueryBuilder()
            .select('transaction')
            .from(Transaction, 'transaction')
            .where("transaction.id IN (:...ids)", { ids: transactionList })
            .execute();

        return latestTransactionList;
    }catch (e) {
        return e;
    }
}
