const mongoose = require("mongoose")
    
    
const Global = new mongoose.Schema({
    var: {type: String, unique: true, required: true}, 
    nft_count: {type: Number, default: 0},
    wl_count: {type: Number, default: 0}, 
    current_nft_count: {type: Number, default: 0},
  current_wl_count: {type: Number, default: 0},
  amount_ch: {type: Number},
  counter_ch: {type: Number},
  winners_ch: {type: Array}, 
  role_ch: {type: Object},
  quest_num: {type: Number, default: 7},
  raid_num: {type: Number, default: 0}
})

module.exports = {Global: mongoose.model("Global", Global)}