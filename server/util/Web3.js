import web3 from 'web3';
import { getConnection } from "typeorm";
import { BlockStatus } from "../db/entity/BlockStatus";
import { SyncDbBlock } from "./SyncDbBlock";

export default class Web3 {
    static web = new web3(new web3.providers.WebsocketProvider('ws://localhost:8546', {
        clientConfig: {
            maxReceivedFrameSize: 100000000,
            maxReceivedMessageSize: 100000000,
        }
    }));

    static main(){
        // this.listenSyncing();
    }

    static listenSyncing(){
        this.web.eth.subscribe('syncing', function(error, sync){
            if (!error){
                console.log(sync);
            }
            console.log(sync);
            // this.listenNewBlock();
        })
            .on("data", function(sync){
                console.log(sync)
                // show some syncing stats
            })
            .on("changed", function(isSyncing){
                console.log(isSyncing)
                if(isSyncing) {
                    // stop app operation
                } else {
                    // regain app operation
                }
            });

        // "data" returns Object: Fires on each incoming sync object as argument.
        // "changed" returns Object: Fires when the synchronisation is started with true and when finished with false.
        // "error" returns Object: Fires when an error in the subscription occurs.
    };

    static listenNewBlock(){
        this.web.eth.subscribe('newBlockHeaders', async function (error, result) {
            if(!error){
                const info = await getConnection()
                    .createQueryBuilder()
                    .select('info')
                    .from(BlockStatus, 'info')
                    .where('info.id = :id', { id: 0 })
                    .getOne();

                if(info.isSyncBlock === false){
                    await getConnection()
                        .createQueryBuilder()
                        .update(BlockStatus)
                        .set({
                            isSyncBlock: true
                        })
                        .where("id = :id", { id: 0 })
                        .execute();

                    SyncDbBlock.syncBlock(info.syncBlockNumber + 1);
                }

                return;
            }
            console.error(error);
        })
            .on("connected", function(subscriptionId){
                console.log(subscriptionId);
            })
            .on("data", function(blockHeader){
                console.log(blockHeader);
            })
            .on("error", console.error);

        // "data" returns Object: Fires on each incoming block header.
        // "error" returns Object: Fires when an error in the subscription occurs.
        // "connected" returns Number: Fires once after the subscription successfully connected. Returns the subscription id.
    }
}