const router = require('express').Router();
const {Movie, validate} = require('../models/movie');
const {Genre} = require('../models/genre');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', async (req, res) => {
    const movies = await Movie.find();
    res.send(movies);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if(!movie)  return res.status(404).send('Get: Movie Not Found...');
    res.send(movie);
});

router.post('/', [auth, admin], async (req, res) =>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send('Post: Movie-Genre Not Found...');

    const movie = new Movie({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            _id: genre._id,
            name: genre.name
        }
    });
    
    await movie.save();
    res.send(movie);
});

router.put('/:id', [auth, admin], async (req, res)=> {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre ) return res.status(400).send('Put: Movie-Genre Not Found...');

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            _id: genre._id,
            name: genre.name
        }
    }, {new: true});

    if(!movie) return res.status(404).send('Put: Movie Not Found...');
    res.send(movie);
});

router.delete('/:id', [auth, admin], async (req, res)=> {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if(!movie) return res.status(404).send('Delete: Movie Not Found...');
    res.send(movie);
});

module.exports = router;