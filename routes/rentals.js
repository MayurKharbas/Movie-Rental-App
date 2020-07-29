const router = require('express').Router();
const mongoose = require('mongoose');

const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const Fawn = require('fawn');

Fawn.init(mongoose);

router.get('/', [auth, admin], async (req, res) => {
    const rentals = await Rental.find();
    res.send(rentals);
});

router.post('/', [auth, admin], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Post: Rental-Customer Not Found...');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Post: Rental-Movie Not Found...');

    if (movie.numberInStock === 0)
        return res.send('Post: Rental-Movie Out Of Stock...');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    // rental = await rental.save();

    // movie.numberInStock--;
    // movie.save();
    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();

        res.send(rental);
    }
    catch (er) {
        res.status(500).send('Something went wrong...');
    }
});

module.exports = router;