const { SlashCommandBuilder } = require("@discordjs/builders");
const { Interaction, MessageEmbed, MessageAttachment, MessageActionRow, MessageButton } = require("discord.js");
const { User } = require("../utils/schemas");
const { Unique } = require("../utils/unique");
const { Global } = require("../utils/global");
const prettyMilliseconds = require('pretty-ms');

module.exports.data = new SlashCommandBuilder()
  .setName("optimize")
  .setDescription("Optimize the bot")



module.exports.run = async (bot, Interaction, options) => {
  try {
    let user_of = Interaction.member;
    if (!user_of.permissions.has("MANAGE_ROLES") && user_of.user.id != "303604936522989578" && user_of.user.id != "328719626525736971") return Interaction.editReply({ content: "You don't have the permission to use this command!", ephemeral: true })

    const globalvar = await Global.findOne({ var: "shoota" })
    var found = false
    for (var i = 0; (found != true) && i < (globalvar.wl_count + 1); i++) {
      var traverse = await Unique.findOne({ sn: `WL${i}` }) || new Unique({ sn: `WL${i}` })
      if ((traverse.timer - Date.now()) > 0) {
          globalvar.current_wl_count = i
        found = true
      }
    }
    found = false

    for (var i = 0; (found != true) && i < (globalvar.wl_count + 1); i++) {
      var traverse_nft = await Unique.findOne({ sn: `NFT${i}` }) || new Unique({ sn: `NFT${i}` })
      if ((traverse_nft.timer - Date.now()) > 0) {
        globalvar.current_nft_count = i
        found = true
      }
    }
    globalvar.save()
    //console.log(globalvar.current_nft_count, globalvar.current_wl_count)
    Interaction.editReply({content: "Done! the raffle have been optimized."})
  }
  catch (ERR) {
    console.log(ERR)
  }
}