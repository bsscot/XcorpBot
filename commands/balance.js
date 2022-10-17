const {SlashCommandBuilder} = require("@discordjs/builders");
const { Interaction, MessageEmbed } = require("discord.js");
const { User } = require("../utils/schemas");

module.exports.data = new SlashCommandBuilder()
.setName("balance")
.setDescription("Check your or another user's balance")
.addUserOption(
    option => option
    .setName("user")
    .setDescription("User whose balance you want to check:")
)

module.exports.run = async (bot, interaction) =>
{
    try
    {
    var brew = bot.channels.cache.find(channel => channel.id === `1008159822291677245`);
    var CongratsWinner = bot.channels.cache.find(channel => channel.id === `1008178248888373288`);
    if(interaction.channel.id != "1008159822291677245" && interaction.channel.id != "1008178248888373288") return interaction.editReply({content: `You can only use this command in ${CongratsWinner} or ${brew}`})
    const user = interaction.options.getUser("user") || interaction.member.user
    const userData = await User.findOne({id: user.id}) || new User({id: user.id})

    //guild.emojis.cache.get("1001387657424805909");
    const balanceEmbed = new MessageEmbed()
    .setTitle(`${user.username}'s balance`)
    .setDescription("Note: wallet details of requested user")
    .setColor("YELLOW")
    .setThumbnail(user.displayAvatarURL())
    .addField("• Wallet", `🪙 ${userData.wallet}`, true) //` ${emoji_is}**\` ${userData.wallet} $SKNK\`**`, true)
    // .addField("• Solana", `**\` ${userData.bank} 🪙 \`**`, true)
    
    return interaction.editReply({
        embeds: [ balanceEmbed ], ephemeral: false
    })
    }
    catch(err)
    {
        console.log(err)
    }
}