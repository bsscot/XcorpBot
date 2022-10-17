const {SlashCommandBuilder} = require("@discordjs/builders");
const { Interaction, MessageEmbed } = require("discord.js");
const { User } = require("../utils/schemas");
const prettyMilliseconds = require('pretty-ms');

module.exports.data = new SlashCommandBuilder()
.setName("pay")
.setDescription("pay someone with your points")
.addUserOption(
    option => option
    .setName("payto")
    .setDescription("person you'd like to pay with your points")
    .setRequired(true)
)
.addIntegerOption(
    option => option
    .setName('amount')
    .setDescription("Please enter the amount you'd like to send.")
    .setRequired(true)
)

module.exports.run = async (bot, Interaction) =>
{
    try
    {
    var CongratsWinner = bot.channels.cache.find(channel => channel.id === `1008178248888373288`);
    if(Interaction.channel.id != "1008178248888373288") return Interaction.editReply({content: `You can only use this command in ${CongratsWinner}`})
    const user = Interaction.member.user
    const payto = Interaction.options.getUser("payto")
    if(user.id == payto.id) return Interaction.editReply({content: `You can't send yourself coins`})
    const amount = Interaction.options.getInteger("amount")
    const userOfCommand = await User.findOne({ id: user.id }) || new User({ id: user.id })
    const userPayed = await User.findOne({ id: payto.id }) || new User({ id: payto.id })
    const embed = new MessageEmbed()

    if (userOfCommand.cooldowns.pay > Date.now()) return Interaction.editReply({
        embeds: [
            embed.setTitle('Cooldown:')
            .setDescription(`⌛ You have already paid someone today, please wait for **\`${prettyMilliseconds(userOfCommand.cooldowns.pay - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}\`** until you can use it again.`)
            .setColor("RED")
        ],
        ephemeral: true
    })


    if(amount < 1 || amount > 10000) return Interaction.editReply({
        embeds: [
            embed.setTitle('Invalid Amount:')
            .setDescription(`you entered an invalid amount, please enter an amount between 1-10000`)
            .setColor("RED")
        ],
        ephemeral: true
    })

    if(amount>userOfCommand.wallet) return Interaction.editReply({
        embeds: [
            embed.setTitle('Insufficient Balance:')
            .setDescription(`you don't have enough points to send. Please try again later.`)
            .setColor("RED")
        ],
        ephemeral: true
    })
    userOfCommand.wallet = userOfCommand.wallet - amount;
    userPayed.wallet = userPayed.wallet + amount;
    //userOfCommand.cooldowns.pay = Date.now() + (1000 * 60 * 60 * 24)
    userOfCommand.save()
    userPayed.save()

    return Interaction.editReply({
        embeds: [ embed.setTitle("Sent Successfully!")
            .setDescription(`💸 Congrats you have sent \`🪙 ${amount} $XCORP\` amount to ${payto.username}`)
            .setColor("GREEN")
            .setThumbnail(payto.displayAvatarURL())
        ],
        ephemeral: false
    })
    }
    catch(err)
    {
        console.log(err)
    }
}