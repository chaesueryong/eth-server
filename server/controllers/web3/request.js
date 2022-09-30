import Web3 from "../../util/Web3";
import axios from 'axios';

export default async (req, res) => {
    try {
        const { method, parameters } = req.body;
        // console.log(req.body)
        const result = await Web3.web.eth[method](...parameters);
        //
        // const result = await axios({
        //     method: 'post',
        //     url: 'http://localhost:8546',
        //     data: req.body
        // })
        
        res.json({
            status: 'success',
            data: {
                result
            }
        })
    }catch (e) {
        res.json({
            status: 'error',
            data: e.message
        })
    }
}