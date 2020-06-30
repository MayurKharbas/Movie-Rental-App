const router = require('express').Router();
const {User} = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email});
    if(!user) return res.status(400).send('Invalid Email or Password');

    //checking password
    const hashed = await bcrypt.compare(req.body.password, user.password);
    if(!hashed) return res.status(400).send('Invalid Email or Password');

    //authenticated successfully
    const token = user.generateAuthToken();
    res.send(token);
});

function validate(req) {
    const schema = {
        email: Joi.string().min(7).max(255).email().required(),
        password: Joi.string().min(5).max(255).required()
    }

    return Joi.validate(req, schema);
}

module.exports = router;