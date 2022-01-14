import { Request, Response } from 'express';
import fs from 'fs';
import axios from 'axios';
import { Movie } from '../models/movie.model';

// filmes da semana
const URL_MOVIES = 'https://api.themoviedb.org/3/trending/all/week?api_key=8c9751844a68e8e7105d68bd90f6eb25';

// categorias de filmes
const URL_CATEGORIES_MOVIES = 'https://api.themoviedb.org/3/genre/movie/list?api_key=8c9751844a68e8e7105d68bd90f6eb25&language=en-US';

// categorias de series
const URL_CATEGORIES_TV = 'https://api.themoviedb.org/3/genre/tv/list?api_key=8c9751844a68e8e7105d68bd90f6eb25&language=en-US';

// base de filmes
const URL_IMAGES = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2'



async function movieFetcher(req: Request, res: Response) {

    const moviesList = await pegarListaFilmes();
    const moviesArray_category_int = mapearFilmes(moviesList);
    
    // Ex: [0] -> [Action], [1] -> [Documentary]
    const catsListMovie = await pegarCategoriaFilmes();
    const moviesArrayNomeMovies = adicionarNomeMovies(moviesArray_category_int, catsListMovie);

    // Ex: [0] -> [Action], [1] -> [Documentary]
    const catsListTV = await pegarCategoriaSeries();
    const moviesArray = adicionarNomeSeries(moviesArrayNomeMovies, catsListTV);

    // escreve o json dos filmes em um arquivo movies.json
    writeToJson(moviesArray);

    return res.status(200).json({
        moviesArray
    })
}


async function pegarListaFilmes() {
    // pega objeto filmes
    const getMovies = await axios(URL_MOVIES);
    // pega um array do objeto filmes
    const moviesList = getMovies.data.results;

    return moviesList;
}

async function pegarCategoriaFilmes() {
    // pega objeto Categorias de filmes
    const getCategories = await axios(URL_CATEGORIES_MOVIES);
    // pega um array do objeto categoria de filmes
    const catsList = getCategories.data.genres;

    return catsList;
}

async function pegarCategoriaSeries() {
    // pega objeto Categorias de series
    const getCategoriesTV = await axios(URL_CATEGORIES_TV);
    // pega um array do objeto categoria de series
    const catsListTV = getCategoriesTV.data.genres;

    return catsListTV;
}

function mapearFilmes(moviesList: any) {
    const moviesArray: Object[] = [];

    console.log('moviesList', moviesList, 'typeof', typeof moviesList)
    moviesList.map((obj: any) => {

        const movieObj = {
            name: null,
            category: null,
            description: null,
            media_type: null,
            poster: null,
            backdrop: null
        }

        const poster_url: any = URL_IMAGES + obj.poster_path;
        const backdrop_url: any = URL_IMAGES + obj.backdrop_path;

        // titulo -> filme = title, serie = name
        movieObj.name = obj.media_type === "movies" ? obj.title : obj.name; 

        movieObj.category = obj.genre_ids;
        movieObj.description = obj.overview;
        movieObj.media_type = obj.media_type;
        movieObj.poster = poster_url;
        movieObj.backdrop = backdrop_url;

        moviesArray.push(movieObj);

    });
    return moviesArray;
}



function adicionarNomeMovies(moviesArray: Object[], catsListMovie: any) {
     // Passando categorias para objetos tipo "filme"
     moviesArray.map((movie: any, movieIndex: any) => {
        catsListMovie.find((cat: any, catIndex: any) => {
            if (movie.media_type as string === "movie" && cat.id === movie.category[0]) {
                movie.category = cat.name;
            }
        });
    });
    return moviesArray;
}

function adicionarNomeSeries(moviesArray: Object[], catsListTV: any) {
    // Passando categorias para objetos tipo "filme"
    moviesArray.map((movie: any, movieIndex: any) => {
        catsListTV.find((cat: any, catIndex: any) => {
            if (
                movie.media_type as string === "tv"
                && cat.id === movie.category[0]
                ) {
                movie.category = cat.name;
            }
       });
   });

   return moviesArray;
}

function writeToJson(array: Object[]) {

    // transforma arra em json
    const arrayMovies = JSON.stringify(array);

    // endereco arquivo
    const fileSteam = fs.createWriteStream('./src/movies.json')

    // escreve no arquivo
    fileSteam.write(arrayMovies + '\n');


    // Observeable, observa se finalziar
    fileSteam.on('finish', () => {
        console.log('File Steam concluído');
    });

    // Observeable, observa se tiver erro
    fileSteam.on('error', (error) => {
        console.log(`File Steam teve um erro', ${error}`);
    });

    fileSteam.end();
}

async function bulkCreate(req: Request, res: Response){
    const { filePath } = req.body;

    const array = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const movies = await Movie.insertMany(array).catch(error => {
        return res.status(500).json(error);
    });

    return res.status(201).json(movies);
    
}
export { movieFetcher, bulkCreate }


