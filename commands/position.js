const {SlashCommandBuilder} = require("@discordjs/builders");
const { Interaction, MessageEmbed } = require("discord.js");
const Levels = require("discord-xp");
Levels.setURL(process.env.mongo)

module.exports.data = new SlashCommandBuilder()
.setName("position")
.setDescription("Check your or another user's position on the leaderboard")
.addUserOption(
    option => option
    .setName("user")
    .setDescription("User whose position you want to check:")
)

module.exports.run = async (bot, Interaction) =>
{
    try
    {
    const target = Interaction.options.getUser("user") || Interaction.member.user
    const levelOf = await Levels.fetch(target.id, Interaction.guild.id, true); 

    const xpEmbed = new MessageEmbed()
    .setTitle(`${target.username}'s postion`)
    .setDescription("Details about the user's position on the leaderboard")
    .setColor("BLUE")
    .setThumbnail(target.displayAvatarURL())
    .addField("• position", `**\` ${levelOf.position} \`**`, true)


    const failEmbed = new MessageEmbed()
    .setTitle(`${target.username}'s postion`)
    .setDescription("Seems like this user has not earned any xp so far.")
    .setColor("RED")
    .setThumbnail(target.displayAvatarURL())
    .addField("• position", `**\` unranked \`**`, true)

    if (!levelOf) return Interaction.editReply({
        embeds: [ failEmbed
     ], ephemeral: true
    });


    return Interaction.editReply({
        embeds: [ xpEmbed
     ], ephemeral: true
    })
    }
    catch(err)
    {
        console.log(err)
    }
}