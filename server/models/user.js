const {model, Schema} = require('mongoose')

const Users = new Schema({
    login: {type: String, required:true},
    password:{type: String},
    token:{type: String, default:null},
    roles:[{serverName:{type:String},rank:{type:Number}}],
    balance:{type:Number,default:0},
    email:{type:String, required:true},
    verified:{type:Boolean,default:false}
})

module.exports = model('User', Users)