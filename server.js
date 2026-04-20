require('dotenv').config(); //per usare il .env, ricordarsi anche di installare la libreria dotenv

const express = require('express');
const app = express();
const port = process.env.PORT;
const movieRouter = require('./routers/movies');
const errorsHandler = require('./middlewares/errorsHandler');
const notFound = require('./middlewares/NotFound');

app.get('/', (req, res) => {
    res.send('Movies server');
});

app.use(express.static('public')); //possibile accedere alle immagini

app.use(express.json());

app.use('/api/movies', movieRouter);

app.use(errorsHandler);

app.use(notFound);

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});