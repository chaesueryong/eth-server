import express from 'express';
import morgan from 'morgan';
import helmet from "helmet";
import cors from 'cors';
import cookieParser from "cookie-parser";
require("dotenv").config()

import DbConnection from './db/DbConnection';

import moment from "moment";
require('moment-timezone');

import Router from './routes/index';
import CustomMiddleWare from "./util/CustomMiddleWare";
import Web3 from "./util/Web3";

export default class Server{
    static port = 8000;
    static server = express();
    static whitelist = ["*"];

    static start() {
        (async () => {
            moment.tz.setDefault(process.env.TIME_ZONE);

            await DbConnection.main();
            await Web3.main();
            await Server.main();
        })();
    };

    static main() {
        this.use(); 
        this.listen();
    }

    static use() {
        this.server.use(helmet());
        this.server.use(cors({
            origin: this.whitelist,
            credentials: true,
        }));
        this.server.use(cookieParser());
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: false }));

        morgan.token('date', (req, res, tz) => {
            return moment().tz(tz).format('YYYY-MM-DD HH:mm:ss');
        })
        morgan.format('myformat', `:date[${process.env.TIME_ZONE}] | :method | :url | :response-time ms`);

        this.server.use(morgan('myformat', {}));

        this.server.use(CustomMiddleWare.getClientIp);

        this.server.use('/api', Router);
    }

    static listen() {
        this.server.listen(this.port, '0.0.0.0',() => {
            console.log(`connect server =>> ${ moment().format("YYYY-MM-DD HH:mm:ss") }`);
        });
    }
}