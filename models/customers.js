const mongoose = require('mongoose');
const joi = require('joi');

const customerSchema = new mongoose.Schema({
    name: {
        type : String,
        require : true,
        minlength : 5,
        maxlength : 20,
    },
    isGold :{
        type : Boolean,
        default : false
    },
    phone :{
        type : String,
        require : true,
        length : 10
    }
});

const Customer = mongoose.model('Customer',customerSchema);


function validation(customer){

    const joiValidation = {
        name : joi.string().required().min(5).max(20),
        isGold : joi.boolean(),
        phone : joi.string().length(10)
    };
    
    return joi.validate(customer,joiValidation,{abortEarly:false});
}

module.exports.Customer = Customer;
module.exports.validation = validation;