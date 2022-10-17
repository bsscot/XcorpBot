const {SlashCommandBuilder} = require("@discordjs/builders");
const { Interaction, MessageEmbed } = require("discord.js");
const Levels = require("discord-xp");
Levels.setURL(process.env.mongo)

module.exports.data = new SlashCommandBuilder()
.setName("leaderboard")
.setDescription("show the level leaderboard")
.addIntegerOption(
    option => option
    .setName("top")
    .setDescription("Enter the amount of users you want to show on the leaderboard")
    .setRequired(true)
)

module.exports.run = async (bot, Interaction) =>
{
    try
    {
    let user_of = Interaction.member;
    if (!user_of.permissions.has("MANAGE_ROLES") && user_of.user.id != "303604936522989578" && user_of.user.id != "328719626525736971") return Interaction.editReply({content: "You don't have the permission to use this command!", ephemeral: true})

    const num = Interaction.options.getInteger("top")

    const rawLeaderboard = await Levels.fetchLeaderboard(Interaction.guild.id, num); 
    
    const failEmbed = new MessageEmbed()
    .setTitle(`Leaderboard`)
    .setDescription("Nobody is in leaderboard yet.")
    .setColor("RED")

    if (rawLeaderboard.length < 1) return Interaction.editReply({
        embeds: [ failEmbed
     ], ephemeral: true
    });

    const leaderboard = await Levels.computeLeaderboard(bot, rawLeaderboard, true); // We process the leaderboard.

    const lb = leaderboard.map(e => `${e.position}. ${e.username}#${e.discriminator}\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}`); // We map the outputs.


    const xpEmbed = new MessageEmbed()
    .setTitle(`✨LEADERBOARD✨`)
    .addField(`**Details about the leaderboard:**`,`**\`${lb.join("\n\n")}\`**`)
    .setColor("WHITE")

    return Interaction.editReply({
        embeds: [ xpEmbed
     ], ephemeral: false
    })
    }
    catch(err)
    {
        console.log(err)
    }
}