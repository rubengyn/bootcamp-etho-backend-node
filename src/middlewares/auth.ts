import { Request, Response, NextFunction } from 'express'
import { ENV_VARS } from '../index';
import jwt from 'jsonwebtoken';

interface  JWToken {
    id?: string;
    iat?: string;
    exp?: string; 
}

function authorize(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            message: 'Não autorizado'
        });
    }

    const token = authorization.replace('Bearer', '').trim();


    // verificar se o token é do usuario
    try {
        //compara token com token secret
        if (ENV_VARS.token_secret) {
            const data = jwt.verify(token, ENV_VARS.token_secret);
            const { id } = data as JWToken;
            /// req user não existe, precisa passara para o JS o que ele é
            req.user = id;
            return next();
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({error});
    }
}

export { authorize };