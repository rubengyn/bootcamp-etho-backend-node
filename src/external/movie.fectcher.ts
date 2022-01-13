import { Request, Response } from 'express';
import fs from 'fs';
import axios from 'axios';

// filmes da semana
const URL_MOVIES = 'https://api.themoviedb.org/3/trending/all/week?api_key=8c9751844a68e8e7105d68bd90f6eb25';
// categorias de filmes
const URL_CATEGORIES = 'https://api.themoviedb.org/3/genre/movie/list?api_key=8c9751844a68e8e7105d68bd90f6eb25&language=en-US';
// base de filmes
const URL_IMAGES = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2'



async function movieFetcher(req: Request, res: Response) {

    const moviesList = await pegarListaFilmes();

    const catsList = await pegarCategoriaFilmes();

    const moviesArray_category_int = mapearFilmes(moviesList);

    // Ex: [0] -> [Action], [1] -> 
    const moviesArray = adicionarStringCategoria(moviesArray_category_int, catsList);

    console.log(moviesArray);
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
    const getCategories = await axios(URL_CATEGORIES);
    // pega um array do objeto categoria de filmes
    const catsList = getCategories.data.genres;

    return catsList;
}


function mapearFilmes(moviesList: any) {
    const moviesArray: Object[] = [];

    console.log('moviesList',moviesList,'typeof',typeof moviesList)
    moviesList.map((obj: any) => {

        const movieObj = {
            name: obj.original_title,
            category: obj.genre_ids,
            description: obj.overview,
            poster: URL_IMAGES + obj.poster_path,
            backdrop: URL_IMAGES + obj.backdrop_path
        }

        moviesArray.push(movieObj);

    });
    return moviesArray;
}



function adicionarStringCategoria(moviesArray_category_int: Object[], catsList: any) {
    // mapear o array de filmes para trocar a categoria de um indice inteiro por uma string
    moviesArray_category_int.map((movie: any, movieIndex: any) => {
        catsList.find((cat: any, catIndex: any) => {
            if (cat.id === movie.category[0]) {
                movie.category = cat.name;
            }
        })
    })
    return moviesArray_category_int;
}

export { movieFetcher }


