const {SlashCommandBuilder} = require("@discordjs/builders");
const { Interaction, MessageEmbed } = require("discord.js");
const { User } = require("../utils/schemas");

module.exports.data = new SlashCommandBuilder()
.setName("info")
.setDescription("Info about the bot.")


module.exports.run = async (bot, interaction) =>
{
    try
    {
    let user_of = interaction.member;
    if (!user_of.permissions.has("MANAGE_ROLES") && user_of.user.id != "303604936522989578" && user_of.user.id != "328719626525736971") return interaction.editReply({content: "You don't have the permission to use this command!"})
      
        const infoEmbed = new MessageEmbed()
        .setTitle("ℹ️ Information!")
        .setDescription("Below is information about how to use the bot")
        .setColor("BLUPLE")
        .addField("__Admin Commands__:", '__/setamount__: Change the wallet holdings of a user.\n__/invite__: Sends the invite contest message.\n__/leaderboard__: has top field which an admin can specify the number of users shown in the leaderboard. \n__/rafflestore__: Sends the raffle store message.\n__/createraffle__: Adds a new raffle to the raffle store.\n__/pickwinner__: has an item filed which an admin can type WL or NFT to list all ended raffles, once listed the admin can press a pick winner button to end raffle, choose winners and create a private thread with the winners.')
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