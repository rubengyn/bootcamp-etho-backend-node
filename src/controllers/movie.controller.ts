import { Request, Response } from 'express';
import { Movie } from '../models/movie.model';
import { paginate } from '../middlewares/pagination';

// pegar todos
function index(req: Request, res: Response) {
    Movie.find((error, result) => {
        if (error) {
            return res.status(500).json({
                error
            });
        }

        return res.status(201).json(
            paginate(result,10,1)
        );
    });
}

// criar filme
async function create(req: Request, res: Response) {
    const { name, category, description, media_type, poster, backdrop } = req.body;

    // validar se o filme existe
    const movieExists = await Movie.findOne({ name });

    // se o filme existir -> mostra uma mensagem
    if (movieExists) {
        return res.status(409).json({
            message: 'Filme já existe.'
        });
    }
    // se o filme não existir -> cria no banco
    const movie = new Movie({ name, category, description, media_type, poster, backdrop });

    movie.save((error: any, result: any) => {
        if (error) {
            return res.status(500).json({
                error
            })
        }
        return res.status(201).json({
            result
        });
    });

}

// visualizar filme especifico
function view(req: Request, res: Response) {
    const { id } = req.params;
    
    Movie.findById(id, (error: any, result: any) => {
        if (error) {
            return res.status(500).json({
                error
            });
        }

        return res.status(201).json({
            result
        });
    });


}

// busca filme especifico
function search(req: Request, res: Response) {
    const { search } = req.params;
    
    const filtrosBusca = 'name category description';

    Movie.find( { $or: [{ name: search },{ category: search }] } , filtrosBusca, (error: any, result: any) => {
        if( error ){
            return res.status(500).json({
                message: 'Erro: '+error
            }); 
        }
        return res.status(200).json({
           result
        }); 
    });


}

export { index, create, view, search };


