import express from 'express';
import mongoose from 'mongoose';
import config from './config'


// Subtistui o servidor por um APP
const app = express();

// add middleware, para pegar as requests em formato json
app.use(express.json());

app.get('/', (req, res) => {
    // res resposta
    res.json({
        message: 'Conseguimos criar um servidor Express'
    });
})

// servidor vai escutar "listen" a porta 5000 
// 1º Parametro a porta
// 2º Parametro uma função que mostra uma mensagem
app.listen(config.PORT, async () => {
    console.log('Server funcionando na porta: ', config.PORT)

    mongoose.connect(config.MONGO_URI);

    const conn = await mongoose.createConnection(config.MONGO_URI);

    conn.getClient();
})