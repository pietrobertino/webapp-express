require('dotenv').config(); //per usare il .env, ricordarsi anche di installare la libreria dotenv

const cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.PORT;
const movieRouter = require('./routers/movies');
const errorsHandler = require('./middlewares/errorsHandler');
const notFound = require('./middlewares/NotFound');

const corsOptions = {
    origin: process.env.FRONT_END_URL,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Movies server');
});

app.use(express.static('public')); //possibile accedere alle immagini

app.use(express.json()); //body parser per richieste store

app.use('/api/movies', movieRouter);

app.use(notFound);

app.use(errorsHandler);

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});