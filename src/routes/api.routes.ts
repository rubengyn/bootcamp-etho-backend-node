import { Router } from 'express'
import * as sessionControler from '../controllers/session.controller';
import * as userControler from '../controllers/user.controller'

const apiRouter = Router();

/* ROTAS GERAIS */

apiRouter.get('/', (req,res) => {
    return res.json({
        message: 'Nossa primeira rota API'
    })
})


/* ROTAS DE USUÁRIO */

apiRouter.get('/users/id/:id/', userControler.view)
apiRouter.delete('/users/destroy/:id/', userControler.destroy)


/* ROTAS DE SESSÃO */

apiRouter.post('/users/new', sessionControler.create)

/* ROTAS DE FILME */

/* ROTAS DE LISTA */


export {apiRouter};