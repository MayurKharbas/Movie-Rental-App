const express = require('express');
const router = express.Router();
const {Customer,validation} = require('../models/customers.js');

/***************************GET CUSTOMER ******************************/
router.get('/', async(req,res)=>{
    const customers = await Customer.find().select({name: 1, isGold: 1, phone: 1});
    if(!customers) return res.status(404).send("No Customers Found in System");
    res.send(customers);
});



/**************************Insert Customer ****************************/
router.post('/' , async(req , res) =>{
    
    const {error} = validation(req.body);
    console.log(error);
    if(error) return res.status(400).send(error.details);

    const customer =new Customer ({
        name : req.body.name,
        isGold : req.body.isGold,
        phone : req.body.phone
    });

    const customers = await customer.save();
    res.send(customers);

});


/*******************Update Customer ****************/
router.put('/:id' ,async(req , res) =>{
    
    const {error} = validation(req.body);
    if(error) return res.status(400).send(sendMessage(error.details.message));

    const customers = await Customer.findByIdAndUpdate(req.params.id,{name : req.body.name, isGold : req.body.isGold , phone : req.body.phone} ,{new : true});
    if(!customers) return res.status(404).send(`Customer ID  ${req.params.id} not Found`)
    res.send(customers);
});

/******************Remove customer**************/
router.delete('/:id' ,async (req ,res) =>{
    const customers = await Customer.findByIdAndDelete(req.params.id);
    if(!customers) return res.status(404).send(`Customer ID ${req.params.id} not Found`)
    res.send(customers);
});

module.exports = router;