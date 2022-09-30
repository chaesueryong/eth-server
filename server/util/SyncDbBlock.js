import { getConnection } from "typeorm";
import { BlockStatus } from "../db/entity/BlockStatus";
import { Block } from "../db/entity/Block";
import Web3 from "./Web3";
import Render from "./Render";
import { Transaction } from "../db/entity/Transaction";
import { Uncle } from "../db/entity/Uncle";
import { TransactionReceipt } from "../db/entity/TransactionReceipt";
import { Log } from "../db/entity/Log";

export class SyncDbBlock {
    static isBlockSync = false;
    static syncBlockNumber = null;
    static blockList = [];

    static async main() {
        await this.setData();
    }

    static get updateCount(){
        return 100;
    }

    static async setData() {
        try {
            const DbBlockStatus = await getConnection()
                .createQueryBuilder()
                .insert()
                .into(BlockStatus)
                .values({ id: 0, isSyncBlock: false, syncBlockNumber: 0 })
                .orUpdate({conflict_target: ["isSyncBlock"], overwrite: ["isSyncBlock"]})
                .execute();
            this.syncBlockNumber = DbBlockStatus.generatedMaps[0].syncBlockNumber;
        }catch (e) {
            Render.error(e);
        }
    }

    static syncBlock(){
        setTimeout(async ()=>{
            await this.updateBlock();
        },0);
    }

    static async updateBlock(){
        try {
            if(this.isBlockSync){
                Render.start();
                this.blockList = [];

                const syncLevel = this.syncBlockNumber % this.updateCount === 0 ?
                    this.syncBlockNumber / this.updateCount + 1 :
                    Math.ceil(this.syncBlockNumber / this.updateCount);

                for(; this.syncBlockNumber <= syncLevel * this.updateCount; this.syncBlockNumber++){
                    const blockInfo = await Web3.web.eth.getBlock(this.syncBlockNumber);

                    this.blockList.push({
                        id: blockInfo.number,
                        blockNumber: blockInfo.number,
                        timestamp: blockInfo.timestamp,
                        transactions: blockInfo.transactions,
                        size: blockInfo.size,
                        gasUsed: blockInfo.gasUsed,
                        gasLimit: blockInfo.gasLimit,
                        miner: blockInfo.miner,
                        difficulty: blockInfo.difficulty,
                        totalDifficulty: blockInfo.totalDifficulty,
                        baseFeePerGas: blockInfo.baseFeePerGas === undefined ? null : blockInfo.baseFeePerGas,
                        burntFees: blockInfo.baseFeePerGas === undefined ? null : parseInt(blockInfo.baseFeePerGas, 16) / 1000000000000000000 * blockInfo.gasUsed,
                        extraData: blockInfo.extraData,
                        hash: blockInfo.hash,
                        parentHash: blockInfo.parentHash,
                        sha3Uncles: blockInfo.sha3Uncles,
                        stateRoot: blockInfo.stateRoot,
                        nonce: blockInfo.nonce,
                        mixHash: blockInfo.mixHash,
                        receiptsRoot: blockInfo.receiptsRoot,
                        transactionsRoot: blockInfo.transactionsRoot,
                        uncles: blockInfo.uncles,
                        blockReward: 0,
                        unclesReward: 0,
                        logsBloom: blockInfo.logsBloom
                    });

                    await this.updateUncle(blockInfo.uncles, blockInfo.number);

                    Render.currentData.block = `block - ${this.syncBlockNumber}`;
                    Render.write(Render.currentData.block);
                }
                this.syncBlockNumber--;

                await getConnection()
                    .createQueryBuilder()
                    .insert()
                    .into(Block)
                    .values(this.blockList)
                    .orUpdate({
                        conflict_target: ["id"],
                        overwrite: [
                            "blockNumber",
                            "timestamp",
                            "transactions",
                            "size",
                            "gasUsed",
                            "gasLimit",
                            "miner",
                            "difficulty",
                            "totalDifficulty",
                            "baseFeePerGas",
                            "burntFees",
                            "extraData",
                            "hash",
                            "parentHash",
                            "sha3Uncles",
                            "stateRoot",
                            "nonce",
                            "mixHash",
                            "receiptsRoot",
                            "transactionsRoot",
                            "uncles",
                            "blockReward",
                            "unclesReward",
                            "logsBloom"
                        ]})
                    .execute();

                await this.updateTransaction();

                await getConnection()
                    .createQueryBuilder()
                    .update(BlockStatus)
                    .set({ syncBlockNumber: this.syncBlockNumber })
                    .where("id = :id", { id: 0 })
                    .execute();

                Render.end();
                Render.currentData.time = `${Render.time.end - Render.time.start}ms`;
                Render.write(Render.currentData.block + ' ' + Render.currentData.transaction +'      '+ Render.currentData.time);
                Render.newLine();

                await this.syncBlock();
            }
        }catch (e) {
            this.isBlockSync = false;
            await getConnection()
                .createQueryBuilder()
                .update(BlockStatus)
                .set({ isSyncBlock: false })
                .where("id = :id", { id: 0 })
                .execute();
            Render.error(e);
        }
    }


    static async updateTransaction() {
        try {
            let txCountByBlock = 0;

            let transactionList = [];
            let transactionReceiptList = [];

            Render.currentData.transaction = `transaction - ${0 + '/' + 0} `;
            Render.write(Render.currentData.block + ' ' + Render.currentData.transaction);

            for(let i = 0; i < this.blockList.length; i++){
                let currentTxCountByBlock = txCountByBlock;
                txCountByBlock += this.blockList[i].transactions.length;

                for(let j = 0; j < this.blockList[i].transactions.length; j++){
                    currentTxCountByBlock++;
                    const transaction = await Web3.web.eth.getTransactionFromBlock(this.blockList[i].blockNumber, j);
                    const transactionReceipt = await Web3.web.eth.getTransactionReceipt(transaction.hash);

                    transactionList.push({
                        blockHash: transaction.blockHash,
                        blockNumber: transaction.blockNumber,
                        from: transaction.from,
                        gas: transaction.gas,
                        gasPrice: transaction.gasPrice,
                        maxFeePerGas: transaction.maxFeePerGas,
                        maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
                        hash: transaction.hash,
                        nonce: transaction.nonce,
                        to: transaction.to,
                        transactionIndex: transaction.transactionIndex,
                        value: transaction.value,
                        type: transaction.type,
                        accessList: transaction.accessList,
                        chainId: transaction.chainId,
                        v: transaction.v,
                        r: transaction.r,
                        s: transaction.s,
                        input: transaction.input,
                    });

                    transactionReceiptList.push({
                        blockNumber: transactionReceipt.blockNumber,
                        blockHash: transactionReceipt.blockHash,
                        contractAddress: transactionReceipt.contractAddress,
                        cumulativeGasUsed: transactionReceipt.cumulativeGasUsed,
                        effectiveGasPrice: transactionReceipt.effectiveGasPrice,
                        from: transactionReceipt.from,
                        gasUsed: transactionReceipt.gasUsed,
                        logCount: transactionReceipt.logs.length,
                        logsBloom: transactionReceipt.logsBloom,
                        status: transactionReceipt.status,
                        to: transactionReceipt.to,
                        transactionHash: transactionReceipt.transactionHash,
                        transactionIndex: transactionReceipt.transactionIndex,
                        type: transactionReceipt.type,
                    });

                    await this.updateLog(transactionReceipt.logs);

                    Render.currentData.transaction = `transaction - ${currentTxCountByBlock + '/' + txCountByBlock} `;
                    Render.write(Render.currentData.block + ' ' + Render.currentData.transaction);
                }

                if(transactionList.length === transactionReceiptList.length){
                    const result = await getConnection()
                        .createQueryBuilder()
                        .insert()
                        .into(Transaction)
                        .values(transactionList)
                        .orUpdate({
                            conflict_target: ["hash"],
                            overwrite: [
                                "blockHash",
                                "blockNumber",
                                "from",
                                "gas",
                                "gasPrice",
                                "maxFeePerGas",
                                "maxPriorityFeePerGas",
                                "nonce",
                                "to",
                                "transactionIndex",
                                "value",
                                "type",
                                "accessList",
                                "chainId",
                                "v",
                                "r",
                                "s",
                                "input",
                            ]})
                        .execute();

                    await getConnection()
                        .createQueryBuilder()
                        .insert()
                        .into(TransactionReceipt)
                        .values(transactionReceiptList)
                        .orUpdate({
                            conflict_target: ["transactionHash"],
                            overwrite: [
                                "blockHash",
                                "blockNumber",
                                "blockHash",
                                "contractAddress",
                                "cumulativeGasUsed",
                                "effectiveGasPrice",
                                "from",
                                "gasUsed",
                                "logCount",
                                "logsBloom",
                                "status",
                                "to",
                                "transactionIndex",
                                "type",
                            ]})
                        .execute();
                }else {
                    throw "not equal length";
                }
            }
        }catch (e) {
            throw e;
        }
    };

    static async updateUncle(uncles, blockNumber) {
        try {
            let uncleList = [];

            for(let i = 0; i < uncles.length; i++){
                const uncleInfo = await Web3.web.eth.getUncle(blockNumber, i);

                uncleList.push({
                    difficulty: uncleInfo.difficulty,
                    extraData: uncleInfo.extraData,
                    gasLimit: uncleInfo.gasLimit,
                    gasUsed: uncleInfo.gasUsed,
                    hash: uncleInfo.hash,
                    logsBloom: uncleInfo.logsBloom,
                    miner: uncleInfo.miner,
                    mixHash: uncleInfo.mixHash,
                    nonce: uncleInfo.nonce,
                    number: uncleInfo.number,
                    parentHash: uncleInfo.parentHash,
                    receiptsRoot: uncleInfo.receiptsRoot,
                    sha3Uncles: uncleInfo.sha3Uncles,
                    size: uncleInfo.size,
                    stateRoot: uncleInfo.stateRoot,
                    timestamp: uncleInfo.timestamp,
                    transactionsRoot: uncleInfo.transactionsRoot,
                    unclePosition: i,
                    uncles: uncleInfo.uncles,
                    blockNumber: blockNumber,
                })
            }
            await getConnection()
                .createQueryBuilder()
                .insert()
                .into(Uncle)
                .values(uncleList)
                .orUpdate({
                    conflict_target: ["blockNumber", "unclePosition"],
                    overwrite: [
                        "difficulty",
                        "extraData",
                        "gasLimit",
                        "gasUsed",
                        "hash",
                        "logsBloom",
                        "miner",
                        "mixHash",
                        "nonce",
                        "number",
                        "parentHash",
                        "receiptsRoot",
                        "sha3Uncles",
                        "size",
                        "stateRoot",
                        "timestamp",
                        "transactionsRoot",
                        "unclePosition",
                        "uncles",
                        "blockNumber",
                    ]
                })
                .execute();
        }catch (e) {
            throw e;
        }
    };

    static async updateLog(logs){
        try {
            let logList = [];

            for(let i = 0; i < logs.length; i++){
                logList.push({
                    address: logs[i].address,
                    blockHash: logs[i].blockHash,
                    blockNumber: logs[i].blockNumber,
                    data: logs[i].data,
                    logIndex: logs[i].logIndex,
                    removed: logs[i].removed,
                    topics: logs[i].topics,
                    transactionHash: logs[i].transactionHash,
                    transactionIndex: logs[i].transactionIndex,
                })
            }
            await getConnection()
                .createQueryBuilder()
                .insert()
                .into(Log)
                .values(logList)
                .orUpdate({
                    conflict_target: ["blockNumber", "transactionIndex", "logIndex"],
                    overwrite: [
                        "address",
                        "blockHash",
                        "blockNumber",
                        "data",
                        "logIndex",
                        "removed",
                        "topics",
                        "transactionHash",
                        "transactionIndex",
                    ]})
                .execute();
        }catch (e) {
            throw e;
        }
    };
}