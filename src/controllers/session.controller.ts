import { Request, Response } from 'express';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';
import config from '../config';


async function create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    console.log(userExists)

    if (userExists) {
        return res.status(403).json({
            message: 'Usuário já cadastrado'
        });
    }

    const user = new User({ name, email, password });

    user.save((error: any, result: any): void => {
        if (error) {
            console.log('Error: ', typeof error)
            res.json(error);
        }

        console.log('Result: ', typeof result);

        // criar token de acesso
        const accessToken = createAccessToken(user._id);

        res.status(201).json(
            {
                user: {
                    id: result._id,
                    name: result.name
                },

                accessToken
            }
        );
    })

}

function createAccessToken(userId: string) {
    const acessToken = jwt.sign(
        {
            id: userId
        },
        config.TOKEN_SECRET,
        {
            expiresIn: 900 // 15 min
        }
    )

    return acessToken
}

export { create };
