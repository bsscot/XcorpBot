const {SlashCommandBuilder} = require("@discordjs/builders");
const { Interaction, MessageEmbed, MessageAttachment,  MessageActionRow, MessageButton } = require("discord.js");
const { User } = require("../utils/schemas");
const { Unique } = require("../utils/unique");
const { Global } = require("../utils/global");
const prettyMilliseconds = require('pretty-ms');

module.exports.data = new SlashCommandBuilder()
.setName("edittimer")
.setDescription("Edit the timer of a raffle")
.addStringOption(
    option => option
    .setName("serialnum")
    .setDescription("Enter the serial number of the raffle you'd like to edit")
    .setRequired(true)
)
.addIntegerOption(
    option => option
    .setName("hours")
    .setDescription("Enter how many hours you want to deduct or add to the raffle?")
    .setRequired(true)
)

module.exports.run = async (bot, Interaction, options) =>
{
    try
    {
    let user_of = Interaction.member;
    if (!user_of.permissions.has("MANAGE_ROLES") && user_of.user.id != "303604936522989578" && user_of.user.id != "328719626525736971")  return Interaction.editReply({content: "You don't have the permission to use this command!", ephemeral: true})

    

    const set_title = Interaction.options.getString("serialnum")
    const set_hours = Interaction.options.getInteger("hours")

        const raffles_db = await Unique.findOne({sn: `${set_title}`})

        var nowsers = new Date(raffles_db.timer)
        nowsers.setHours(nowsers.getHours() + set_hours)
        raffles_db.timer = nowsers
        raffles_db.save()
        
    
        return Interaction.editReply(
        {
            content: "Done! you've successfully edit the time of the raffle", ephemeral: true//embeds: [ raffleEmbed ], components: [row], ephemeral: false
        }
        ) }
    catch(err)
    {
        console.log(err)
    }
}
