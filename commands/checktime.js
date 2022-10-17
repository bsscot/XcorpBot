const {SlashCommandBuilder} = require("@discordjs/builders");
const { Interaction, MessageEmbed, MessageActionRow, MessageButton, Discord} = require("discord.js");
const { User } = require("../utils/schemas");
const { Unique } = require("../utils/unique");
const prettyMilliseconds = require('pretty-ms');


module.exports.data = new SlashCommandBuilder()
.setName("checktime")
.setDescription("Check time button *NOT A COMMAND*")

module.exports.run = (bot, Interaction) => {
    return Interaction.editReply({
        content: "This is not a command",
        ephemeral: true
    })
}

module.exports.button = async (bot, interaction, user, action, another_user) => {
    try
    {
    var [cost, giveawayNumber, hours, max_tickets] = user.split("/")
    const globalvar = await Unique.findOne({sn: giveawayNumber}) || new Unique({sn: giveawayNumber})
    const embed = new MessageEmbed()

    if(globalvar.timer  === undefined){
        return interaction.editReply({
            embeds: [embed
            .setTitle("Time left for the raffle to end:")
            .setDescription(`⌛ The timer for the raffle has not been initiated yet.`)
            .setColor("RED")], ephemeral: true})
    }
            // if(Date.parse(globalvar.timer) < Date.now())
            // {
            //   interaction.deleteReply();
            // }
    return interaction.editReply({
        embeds: [embed
        .setTitle("Time left for the raffle to end:")
        .setDescription(`⌛ The time left for the raffle to end is: **\`${prettyMilliseconds(globalvar.timer - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}\`**`)
        .setColor("RED")], ephemeral: true})
    }
    catch(err)
    {
        console.log(err)
    }
}