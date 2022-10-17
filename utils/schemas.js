    const mongoose = require("mongoose")

    const User = new mongoose.Schema({
        id: {type: String, unique: true, required: true}, 
        name: {type: String},
        wallet: {type: Number, default: 0},
        winnerraffle: {type: Array},
        inv_code: {type: String, default: ""},
        winner_cf: {type: Object},
        cooldowns: {
            work: {type: Date},
            daily: {type: Date},
            pay: {type: Date}
        },
        quests: {
            name: {type: Boolean, default: false},
            me: {type: Boolean, default: false},
            pfp: {type: Boolean, default: false},
            twt: {type: Boolean, default: false},
            cf: {type: Number, default: 0},
            rxn: {type: Number, default: 0},
            rxn_done: {type: Boolean, default: false},
            raffle: {type: Number, default: 0},
            rxn_done: {type: Boolean, default: false},
            bonus: {type: Boolean, default: false}
        }
    })

    module.exports = {User: mongoose.model("User", User)}
