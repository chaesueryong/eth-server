import express from "express";
import web3Controller from "../controllers/web3";

const web3Router = express.Router();

web3Router.post('/', web3Controller.request);

export default web3Router;