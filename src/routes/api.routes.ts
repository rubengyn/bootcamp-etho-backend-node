import { Router } from 'express'
import * as sessionController from '../controllers/session.controller';
import * as userController from '../controllers/user.controller'
import * as movieController from '../controllers/movie.controller'
import * as listController from '../controllers/list.controller'
import { authorize } from '../middlewares/auth'

const apiRouter = Router();

/* ROTAS GERAIS */

apiRouter.get('/', (req, res) => {
    return res.json({
        message: 'Nossa primeira rota de API'
    });
});

/* ROTAS DE USUÁRIO */
apiRouter.post('/users/new/', userController.create);
apiRouter.get('/users/id/:id/', userController.view);
apiRouter.delete('/users/destroy/:id/', userController.destroy);


/* ROTAS DE SESSÃO */
// primeiro roda o middleware: authorize, depois vai para rota: sessionControler.index
apiRouter.get('/session', authorize, sessionController.index);
apiRouter.post('/session/new', sessionController.create);

/* ROTAS DE FILME */
// paginate -> middleware, paginação
apiRouter.get('/movies', movieController.index);
apiRouter.get('/movies/id/:id', authorize, movieController.view);
apiRouter.get('/movies/:search', authorize, movieController.search);
apiRouter.post('/movies/new', authorize, movieController.create);

/* ROTAS DE LISTA */
apiRouter.get('/list', authorize, listController.index);
apiRouter.post('/list/add/:id', authorize, listController.add);
apiRouter.delete('/list/remove/:id', authorize, listController.remove);

export { apiRouter };