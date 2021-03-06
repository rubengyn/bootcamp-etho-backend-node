import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { apiRouter } from './routes/api.routes';
import { extRouter } from './routes/external.routes';
import serverless from 'serverless-http';


dotenv.config();

// Subtistui o servidor por um APP
const app = express();

// add middleware, para pegar as requests em formato json
app.use(express.json());
app.use(cors());
app.use(apiRouter);
app.use(extRouter);

const ENV_VARS = {
    port: process.env.PORT,
    mongoURI: process.env.MONGO_URI,
    token_secret: process.env.TOKEN_SECRET
}

app.listen(ENV_VARS.port, async () => {
    console.log('Server funcionando na porta: ', ENV_VARS.port);

    if (ENV_VARS.mongoURI) {
        mongoose.connect(ENV_VARS.mongoURI);
    } else {
        console.log('Erro na conexão com DB.');
    }

});

mongoose.connect(ENV_VARS.mongoURI as string);

export const handler = serverless(app,  { callbackWaitsForEmptyEventLoop: false });

export { ENV_VARS };