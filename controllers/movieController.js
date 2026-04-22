const connection = require('../data/moviesDb');

function index(req, res) {

    const sql = 'SELECT * FROM movies';

    connection.query(sql, (err, movies) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(movies);
    });

}


function show(req, res) {

    const id = parseInt(req.params.id);
    const movieSql = 'SELECT * FROM movies WHERE id = ?';
    const reviewsSql = `
    SELECT * 
    FROM reviews
    WHERE movie_id = ?`
    let medium_vote = 0;

    connection.query(movieSql, [id], (err, movieResults) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (movieResults.length === 0) return res.status(404).json({ error: 'Movie not found' });

        const movie = movieResults[0];

        connection.query(reviewsSql, [id], (err, reviewsResults) => {
            if (err) return res.status(500).json({ error: 'Database query failed' });
            movie.reviews = reviewsResults;
            for (const review of reviewsResults) {
                medium_vote += review.vote;
            }
            movie.medium_score = Math.round(medium_vote / reviewsResults.length);
            res.json(movie);
        })

    })

}

module.exports = {
    index,
    show
}