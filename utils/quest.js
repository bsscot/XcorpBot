const mongoose = require("mongoose")
    
    
const Quest = new mongoose.Schema({
    qst: {type: String, unique: true, required: true}, 
    winners: {type: Array, default: []},
    complete: {type: Array, default: []},
    is_raid: {type: Boolean, default: false},
})

module.exports = {Quest: mongoose.model("Quest", Quest)}