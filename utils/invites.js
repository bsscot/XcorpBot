const mongoose = require("mongoose")
    
    
const Invitesdb = new mongoose.Schema({
    cd: {type: String, unique: true, required: true}, 
    invited: {type: Array, default: []},
    added: {type: Array, default: []},
    inviter: {type: String}
})

module.exports = {Invitesdb: mongoose.model("Invitesdb", Invitesdb)}