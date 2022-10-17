const {SlashCommandBuilder} = require("@discordjs/builders");
const { Interaction, MessageEmbed, MessageActionRow, MessageButton, Discord } = require("discord.js");

module.exports.data = new SlashCommandBuilder()
.setName("verify")
.setDescription("Admin only - Get verified!")
//.addUserOption(option => option.setName("person").setDescription("Person to kick").setRequired(true))

module.exports.run = (bot, interaction)=>//, options) =>
{
    let permissions = interaction.member.permissions;
    if(!permissions.has("MANAGE_MESSAGES")) return interaction.reply({content: "You don't have the permission to use this command!"})


    let embed = new MessageEmbed()
    .setTitle(`VERIFY`)
    .setDescription("React with ✅ to enter the server!")
    .setColor("PURPLE")
    .setImage("https://media.discordapp.net/attachments/1008252567769321522/1016436067689304095/unknown.png?width=733&height=671");


    return interaction.editReply({
        embeds: [embed]
    })

}
