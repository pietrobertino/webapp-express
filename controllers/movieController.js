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
            if (reviewsResults.length > 0) {
                for (const review of reviewsResults) {
                    medium_vote += review.vote;
                }
                movie.medium_score = Math.round(medium_vote / reviewsResults.length);
            } else {
                movie.medium_score = 0;
            }
            res.json(movie);
        })
    })
}


//storeReview per inserire una nuova review nel database
function storeReview(req, res) {

    const movie_id = parseInt(req.params.id);

    //handle movie not found case
    const movieSql = 'SELECT * FROM movies WHERE id = ?'
    connection.query(movieSql, [movie_id], (err, movieResults) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (movieResults.length === 0) return res.status(404).json({ error: 'Movie Not Found' });

        const { name, vote, text } = req.body;

        //input validation
        if (!name || !vote || !text) return res.status(400).json({ error: 'Missing required fields' });

        const sql = 'INSERT INTO reviews (movie_id, name, vote, text) VALUES (?, ?, ?, ?)';

        connection.query(sql, [movie_id, name, vote, text], (err, results) => {
            if (err) return res.status(500).json({ error: 'Database query failed' });
            res.json({
                message: 'Review uploaded',
                review_id: results.insertId
            })
        })
    })

}

module.exports = {
    index,
    show,
    storeReview
}