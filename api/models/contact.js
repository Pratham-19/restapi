const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    name:{ type: String, required: true},
    phone:{ type: Number, required: true},
    email:{ 
        type: String,
        required: true,
        unique: true,
        match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    linkedinProfileUrl: {
        type: String,
        required: true,
        match: /^((http|https):\/\/)?(www.)?linkedin.com\/in\/[a-zA-Z0-9]+\/?$/
    }
});
 
module.exports = mongoose.model('Contact', contactSchema);