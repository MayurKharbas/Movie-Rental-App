const router = require('express').Router();
const { Customer, validate: validateCustomers } = require('../models/customer');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const validate = require('../middleware/validate');

router.get('/', [auth, admin], async (req, res) => {
    const customers = await Customer.find();
    res.send(customers);
});

router.get('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('Get: Customer Not Found...');
    res.send(customer);
});

router.post('/', [auth, admin, validate(validateCustomers)], async (req, res) => {
    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });

    customer = await customer.save();
    res.send(customer);
});

router.put('/:id', [auth, admin, validateObjectId, validate(validateCustomers)], async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }, { new: true });

    if (!customer) return res.status(404).send('Put: Customer Not Found...');

    res.send(customer);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send('Delete: Customer Not Found...');
    res.send(customer);
})

module.exports = router;