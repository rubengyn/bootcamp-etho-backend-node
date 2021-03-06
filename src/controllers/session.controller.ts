import { Request, Response } from 'express';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { ENV_VARS } from '../index';

const token_secret = process.env.TOKEN_SECRET;

// unica funcao desta rota é mostrar o req user
function index(req: Request, res: Response) {
    // try-catch para AWS
    try {
        // não esta autorizado a acessar esta rota
        if (!req.user) {
            return res.status(401).json({
                error: 'Usuário não autorizado'
            });
        }

        // se ele existir, envia um return
        return res.status(200).json({
            userId: req.user
        });

    } catch (error) {
        return res.status(400).json(
            {
                error,
            }
        );
    }
}

async function create(req: Request, res: Response) {
    // try-catch para AWS
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        console.log(userExists)

        if (!userExists) {
            return res.status(403).json({
                message: 'Não foi possível autenticar'
            });
        }

        // verifica se a senha é valida
        const isValid = await userExists.comparePassword(password);


        // se a senha não for válida, para a aplicação
        if (!isValid) {
            return res.status(401).json({
                message: 'Não foi possível autenticar'
            });
        }

        // criar token de acesso
        const accessToken = createAccessToken(userExists._id);

        return res.status(200).json(
            {
                user: {
                    id: userExists._id,
                    name: userExists.name
                },
                accessToken
            }
        );
    } catch (error) {
        return res.status(400).json(
            {
                error,
            }
        );
    }
}

function createAccessToken(userId: string) {

    const token = ENV_VARS.token_secret as string;

    const accessToken = jwt.sign(
        {
            id: userId
        },
        token,
        {
            expiresIn: 86400 // 1 dia min
        }
    )

    return accessToken;
}

export { create, index };
