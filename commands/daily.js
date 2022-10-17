const {SlashCommandBuilder} = require("@discordjs/builders");
const { Interaction, MessageEmbed } = require("discord.js");
const { User } = require("../utils/schemas");
const prettyMilliseconds = require('pretty-ms');

module.exports.data = new SlashCommandBuilder()
.setName("daily")
.setDescription("Get your daily points");

module.exports.run = async (bot, Interaction) =>
{
    try
    {
        var CongratsWinner = bot.channels.cache.find(channel => channel.id === `1008159822291677245`);
        if(Interaction.channel.id != "1008159822291677245") return Interaction.editReply({content: `You can only use this command in ${CongratsWinner}`})
    //only in daily channel
    const user = Interaction.member.user
    const userData = await User.findOne({ id: user.id }) || new User({ id: user.id })
    const embed = new MessageEmbed({ color: "YELLOW" })

    if (userData.cooldowns.daily > Date.now()) return Interaction.editReply({
        embeds: [
            embed.setDescription(`⌛ You have already collected your daily points, wait for **\`${prettyMilliseconds(userData.cooldowns.daily - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}\`**`)
        ],
        ephemeral: true
    })
    var amount = 200
    userData.wallet += amount
    userData.cooldowns.daily = Date.now() + (1000 * 60 * 60 * 24)
    userData.save()
    return Interaction.editReply({
        embeds: [ embed.setDescription(`💰 You have collected your daily \`🪙 ${amount} $XCORP\` amount`) ], ephemeral: true
    })
    }
    catch(err)
    {
        console.log(err)
    }   
}

