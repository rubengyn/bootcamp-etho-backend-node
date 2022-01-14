import { Router } from 'express'
import { movieFetcher, bulkCreate } from '../external/movie.fectcher'

const extRouter = Router()

extRouter.get('/external', movieFetcher)
extRouter.post('/external/createBulk', bulkCreate)

export { extRouter }
