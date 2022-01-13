import { Router } from 'express'
import * as sessionController from '../controllers/session.controller';
import * as userController from '../controllers/user.controller'
import * as movieController from '../controllers/movie.controller'
import { authorize   } from '../middlewares/auth'


const apiRouter = Router();

/* ROTAS GERAIS */

apiRouter.get('/', (req,res) => {
    return res.json({
        message: 'Nossa primeira rota API'
    })
})


/* ROTAS DE USUÁRIO */

apiRouter.get('/users/id/:id/', userController.view)
apiRouter.post('/users/new/', userController.create)
apiRouter.delete('/users/destroy/:id/', userController.destroy)


/* ROTAS DE SESSÃO */
// primeiro roda o middleware: authorize, depois vai para rota: sessionControler.index
apiRouter.get('/session', authorize,  sessionController.index)
apiRouter.post('/session/new', sessionController.create)

/* ROTAS DE FILME */
apiRouter.get('/movies', authorize,  movieController.index);


/* ROTAS DE LISTA */


export {apiRouter};