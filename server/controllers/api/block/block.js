import Web3 from "../../../util/Web3.js";
import RenderData from "../../../util/Render.js";

export async function get(req) {
    try {
        const getBlock = await Web3.web.eth.getBlock(6027230);
        const getUncle = await Web3.web.eth.getUncle(6027230, 0);


        const transaction = await Web3.web.eth.getTransactionFromBlock(46170, 0);


        return {
            // getBlock,
            // getUncle
            transaction
        };
    }catch (e) {
        RenderData.error(e);
        return e;
    }
}
