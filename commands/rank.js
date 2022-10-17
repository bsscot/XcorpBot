const {SlashCommandBuilder} = require("@discordjs/builders");
const { Interaction, MessageEmbed } = require("discord.js");
const Levels = require("discord-xp");
Levels.setURL(process.env.mongo)

module.exports.data = new SlashCommandBuilder()
.setName("rank")
.setDescription("Check your or another user's rank")
.addUserOption(
    option => option
    .setName("user")
    .setDescription("User whose rank you want to check:")
)

module.exports.run = async (bot, Interaction) =>
{
    try
    {
    const target = Interaction.options.getUser("user") || Interaction.member.user
    const levelOf = await Levels.fetch(target.id, Interaction.guild.id); 

    const xpEmbed = new MessageEmbed()
    .setTitle(`${target.username}'s rank`)
    .setDescription("Details about the user's rank on the leaderboard")
    .setColor("BLUE")
    .setThumbnail(target.displayAvatarURL())
    .addField("• Level", `**\` ${levelOf.level} \`**`, true)
    .addField("• xp", `**\` ${levelOf.xp} \`**`, true)

    const failEmbed = new MessageEmbed()
    .setTitle(`${target.username}'s rank`)
    .setDescription("Seems like this user has not earned any xp so far.")
    .setColor("RED")
    .setThumbnail(target.displayAvatarURL())
    .addField("• Level", `**\` 0 \`**`, true)
    .addField("• xp", `**\` 0 \`**`, true)

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