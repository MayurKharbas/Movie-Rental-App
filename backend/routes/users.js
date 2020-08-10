const _ = require('lodash');
const router = require('express').Router();
const bcrypt = require('bcrypt');

const { User, validate: validateUsers } = require('../models/user');

const validate = require('../middleware/validate');

router.post('/', validate(validateUsers), async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('Post: User already registered...');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    //encrypting the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;