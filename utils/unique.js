    const mongoose = require("mongoose")
    
    
    const Unique = new mongoose.Schema({
        sn: {type: String, unique: true, required: true}, 
        entries: {type: Array},//giveaway
        timer: {type: Date},//giveaway_time
        final_winner: {type: Array},//giveawayDown
        //winner: {type: Array, default: []},//y
        raffle: { //y
            set_title: {type: String, default: ""},
            set_description: {type: String, default: ""},
            set_item: {type: String, default: ""},
            set_image: {type: String, default: ""},
            set_cost: {type: Number, default: 0},
            max: {type: Number, default: 0},
            win: {type: Number, default: 0},
            set_hours: {type: Number, default: 0},
            set_createdby: {type: String, default: ""}
        }
    })

    module.exports = {Unique: mongoose.model("Unique", Unique)}
