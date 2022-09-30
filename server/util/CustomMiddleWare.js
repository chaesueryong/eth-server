import Jwt from "./Jwt";
import requestIp from 'request-ip';

export default class CustomMiddleWare {

    static async checkAccessToken(req, res, next){
        try {
            // 액세스 토큰 유무 검증
            if(req.headers.authorization){
                // 토큰 검증
                const accessToken = req.headers.authorization.split(' ')[1];
                const { user_email } = Jwt.verifyToken(accessToken);
                req.user_email = user_email;
                next();
            }else {
                throw 'no provide accessToken';
            }
        }catch (e){
            let error = {
                status: 'error'
            }

            switch (e.name){
                case 'TokenExpiredError':
                    error.data = 'expired accessToken';
                    break;
                default:
                    error.data = e;
                    break;
            }

            res.json(error);
        }
    }

    static async getClientIp(req, res, next){
        try {
            req.clientIp = requestIp.getClientIp(req);

            next();
        }catch (e){
            let error = {
                status: 'error'
            }

            switch (e.name){
                default:
                    error.data = e;
                    break;
            }

            res.json(error);
        }
    }
}