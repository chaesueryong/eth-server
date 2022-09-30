import express from "express";
import web3Router from './web3Router';

const router = express.Router();

router.get('/', (req, res) => {
    res.json('hello');
});

router.use('/web3', web3Router);

export default router;