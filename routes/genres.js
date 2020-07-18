const express = require('express');
const router = express.Router();
const {Genre, validate} = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', async (req, res) => {
    const genres = await Genre
                .find()
                .sort({name: 1});
    res.send(genres);
});

router.get('/:id', async (req, res) => { 
    try {
        const genre = await Genre.find({_id: req.params.id});
        if(!genre) return res.status(404).send('Get: Genre Not Found...');
        res.send(genre);
    } catch (error) {
        console.log(err.message);
    }
});

router.post('/', [auth, admin], async (req, res) =>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    let genre = new Genre({
        name: req.body.name
    });

    genre = await genre.save();
    res.send(genre);
});

router.put('/:id', [auth, admin], async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, 
        { name: req.body.name }, 
        { new: true});

    if(!genre) return res.status(404).send('Put: Genre Not Found...');

    res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) =>{
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if(!genre) return res.status(400).send('Delete: Genre Not Found...');
    res.send(genre);
});

module.exports = router;