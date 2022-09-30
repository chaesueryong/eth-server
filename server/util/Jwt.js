require("dotenv").config()

import jwt from 'jsonwebtoken';

export default class Jwt {
    static ExpireTime = '60m';

    static secretKey = process.env.JWT_SECRET_KEY;

    static generateToken (obj = {}, type){
        return jwt.sign(obj, this.secretKey, {
            expiresIn: this.ExpireTime
        })
    }

    static verifyToken (token) {
        return jwt.verify(token, this.secretKey);
    }

    static decodeToken (token) {
        return jwt.decode(token, this.secretKey);
    }
}