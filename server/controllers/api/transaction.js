import Web3 from "../../util/Web3";
import {TransactionReceipt} from "../../db/entity/TransactionReceipt";
import { Transaction } from "../../db/entity/Transaction";
import { getRepository } from "typeorm";
import {Block} from "../../db/entity/Block";
import {Log} from "../../db/entity/Log";
import RenderData from "../../util/Render";

export async function get(req) {
    try {
        const getBlock = await Web3.web.eth.getBlock(1155345);
        const getTransaction = await Web3.web.eth.getTransaction('0x2b77182b89c0d181a8da8fb7d281b4c37354eb290aecb98fddca1156ef05b9ee');
        const getTransactionFromBlock = await Web3.web.eth.getTransactionFromBlock(1155345, 18);
        const getTransactionReceipt = await Web3.web.eth.getTransactionReceipt('0x2b77182b89c0d181a8da8fb7d281b4c37354eb290aecb98fddca1156ef05b9ee')
        // const estimateGas = await Web3.web.eth.estimateGas(getTransactionFromBlock);

        // const estimateGas = await Web3.web.eth.estimateGas(getTransactionFromBlock);
        // const getBlock = await Web3.web.eth.getBlock(300001);
        // const getTransaction = await Web3.web.eth.getTransaction('0x90dd2528af8e4eadbe6caf5f85e70bba108e988d3512f6f67632ba70003d4861');
        // const getTransactionFromBlock = await Web3.web.eth.getTransactionFromBlock(300001, 0);
        // const getTransactionReceipt = await Web3.web.eth.getTransactionReceipt('0x90dd2528af8e4eadbe6caf5f85e70bba108e988d3512f6f67632ba70003d4861');
        // const estimateGas = await Web3.web.eth.estimateGas(getTransactionFromBlock);

        // const transaction = await getRepository(Block)
        //     .createQueryBuilder("block")
        //     .leftJoinAndSelect("block.transactions", "transaction")
        //     .leftJoinAndSelect("transaction.transactionReceipt","transactionReceipt")
        //     .where("block.id = :id", { id: 442354 })
        //     .getOne();

        const transaction = await getRepository(Log)
            .createQueryBuilder("log")
            .where("log.transactionHash = :transactionHash", { transactionHash: '0x218b632d932371478d1ae5a01620ebab1a2030f9dad6f8fba4a044ea6335a57e' })
            .getOne();

        console.log(transaction);

        return {
            // getBlock,
            // getTransaction,
            // getTransactionFromBlock,
            // getTransactionReceipt,
            // estimateGas
            transaction
        };
    }catch (e) {
        RenderData.error(e);
        return e;
    }
}
