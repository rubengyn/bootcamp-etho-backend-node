import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { apiRouter } from './routes/api.routes'
import { extRouter} from './routes/external.routes'


dotenv.config();

// Subtistui o servidor por um APP
const app = express();

// add middleware, para pegar as requests em formato json
app.use(express.json());
app.use(apiRouter);
app.use(extRouter)

const ENV_VARS = {
    port: process.env.PORT,
    mongoURI: process.env.MONGO_URI,
    token_secret: process.env.TOKEN_SECRET
}

app.listen(ENV_VARS.port, async () => {
    console.log('Server funcionando na porta: ', ENV_VARS.port)

    if (ENV_VARS.mongoURI){
        mongoose.connect(ENV_VARS.mongoURI);
    } else {
        console.log('Erro na conexão co DB.', );
        
    }

})


// // servidor vai escutar "listen" a porta 5000 
// // 1º Parametro a porta
// // 2º Parametro uma função que mostra uma mensagem
// app.listen(config.PORT, async () => {
//     console.log('Server funcionando na porta: ', config.PORT)

//     mongoose.connect(config.MONGO_URI);

// })

export { ENV_VARS };