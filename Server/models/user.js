const mongoose = require('mongoose')

const schema = mongoose.Schema;
const userSchema = new schema({
    email:String,
    password:String,
    forms:{ type : Array , "default" : [] }
})

module.exports = mongoose.model('user',userSchema,'users')