const {SlashCommandBuilder} = require("@discordjs/builders");
const { Interaction, MessageEmbed, MessageAttachment,  MessageActionRow, MessageButton } = require("discord.js");
const { User } = require("../utils/schemas");
const { Unique } = require("../utils/unique");
const { Global } = require("../utils/global");
const prettyMilliseconds = require('pretty-ms');

module.exports.data = new SlashCommandBuilder()
.setName("newcontest")
.setDescription("new invite contest")
.addIntegerOption(
    option => option
    .setName("hours")
    .setDescription("Enter the time of the raffle (in hours)")
    .setRequired(true)
)



module.exports.run = async (bot, Interaction, options) =>
{
    try
    {
    let user_of = Interaction.member;
    if(!user_of.permissions.has("MANAGE_ROLES") && user_of.user.id != "303604936522989578" && user_of.user.id != "328719626525736971") return Interaction.editReply({content: "You don't have the permission to use this command!", ephemeral: true})
    

    const set_hours = Interaction.options.getInteger("hours")
    var nowsers = new Date(Date.now())
    nowsers.setHours(nowsers.getHours() + set_hours)
    
    const check = await Unique.findOne({sn: `invite`})
    if (check == null)
    {
        const quest = await new Unique({sn: `invite`})
        quest.timer = nowsers
        quest.save()
        return Interaction.editReply({
            content: `Time until the contest ends: <t:${Math.round(Date.parse(nowsers) / 1000)}:R>`
        });
    }
    else
    {
        return Interaction.editReply({
            content: `There's already a contest going it ends in: <t:${Math.round(Date.parse(nowsers) / 1000)}:R>`
        });
    }

    }
    catch(err)
    {
        console.log(err)
    }
}
