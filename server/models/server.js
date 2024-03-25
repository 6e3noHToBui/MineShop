const {model, Schema} = require('mongoose')

const Servers = new Schema({
    serverName: {type: String},
    logLink: {type: String, default: ''},
    crewList: [{name:{type: String}, rank:{type: String}}],
    shop:[{item:{type: String}, cost:{type:Number},category:{type:String}}]
})

module.exports = model('Server', Servers)