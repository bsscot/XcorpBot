const {SlashCommandBuilder} = require("@discordjs/builders");
const { Interaction } = require("discord.js");

module.exports.data = new SlashCommandBuilder()
.setName("ping")
.setDescription("Ping user");

module.exports.run = async (bot, Interaction) =>
{
    return Interaction.editReply({
        content: "PONG!",
        ephemeral: true })
        .catch(console.error);
}