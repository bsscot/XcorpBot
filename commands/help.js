const {SlashCommandBuilder} = require("@discordjs/builders");
const { Interaction, MessageEmbed } = require("discord.js");
const { User } = require("../utils/schemas");

module.exports.data = new SlashCommandBuilder()
.setName("help")
.setDescription("Info about the bot.")


module.exports.run = async (bot, interaction) =>
{
    try
    {
    var CongratsWinner = bot.channels.cache.find(channel => channel.id === `1008178248888373288`);
    if(interaction.channel.id != "1008178248888373288") return interaction.editReply({content: `You can only use this command in ${CongratsWinner}`})
      
        const infoEmbed = new MessageEmbed()
        .setTitle("Help:")
        .setDescription("Below is information about how to use the bot")
        .setColor("BLUPLE")
        .addField("__Users Commands__", `__/register__ or __!register__: to register your profile on the database.\n__/coinflip__: you can enter and amount to bet against the bot in a coinflip game, then you'll be prompted to choose between heads or tails\n__/balance__ or __!balance__ : checks your wallet balance\n__/daily__ or __!daily__: Collect your daily coins.\n__/rank__: check your or another user's rank.\n__/position__: check your or another user's position on the leaderboard.\n__/pay__: Send another user a specific amount of coins.\n__/work__ or __!work__ : complete your quests to earn coins.\n`)
       .setColor("DARK_ORANGE")

    
        return interaction.editReply({
            embeds: [ infoEmbed ], ephemeral: false
        })
    }
    catch(err)
    {
        console.log(err)
    }
}