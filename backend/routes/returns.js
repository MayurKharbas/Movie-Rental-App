const express = require('express');
const router = express.Router();

const { Rental, validate: validateReturns } = require('../models/rental');
const { Movie } = require('../models/movie');

const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post('/', [auth, validate(validateReturns)], async (req, res) => {

    const rental = await Rental.lookup(req.body.customerId, req.body.movieId)

    if (!rental) return res.status(404).send('Returns-Post: Rental Not Found...');

    if (rental.dateReturned) {
        const rental2 = await Rental.lookupNotReturned(req.body.customerId, req.body.movieId);
        if (!rental2) return res.status(404).send('Returns-Post: Already Returned...');

        rental2.return();
        await rental2.save();

        await Movie.update({ _id: rental2.movieId }, {
            $inc: { numberInStock: 1 }
        });
        return res.status(200).send(rental2);
    }
    rental.return();
    await rental.save();

    await Movie.update({ _id: rental.movieId }, {
        $inc: { numberInStock: 1 }
    });
    return res.status(200).send(rental);
});

module.exports = router;