const router = require('express').Router();
const {Customer, validate} = require('../models/customer');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', [auth, admin], async (req, res) =>{
    const customers = await Customer.find();
    res.send(customers);
});

router.get('/:id', [auth, admin], async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send('Get: Customer Not Found...');
    res.send(customer);
});

router.post('/', [auth, admin], async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });

    customer = await customer.save();
    res.send(customer);
});

router.put('/:id', [auth, admin], async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }, { new: true});

    if(!customer) return res.status(404).send('Put: Customer Not Found...');

    res.send(customer);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if(!customer) return res.status(404).send('Delete: Customer Not Found...');
    res.send(customer);
})

module.exports = router;