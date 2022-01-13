import { Router } from 'express'
import { movieFetcher } from '../external/movie.fectcher'

const extRouter = Router()

extRouter.get('/external', movieFetcher)

export { extRouter }
