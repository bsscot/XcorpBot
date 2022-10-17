const {SlashCommandBuilder} = require("@discordjs/builders");
const { Interaction, MessageEmbed } = require("discord.js");
const { User } = require("../utils/schemas");
const prettyMilliseconds = require('pretty-ms');

module.exports.data = new SlashCommandBuilder()
.setName("setamount")
.setDescription("pay someone with your points")
.addUserOption(
    option => option
    .setName("user")
    .setDescription("person you'd like to edit their wallet holdings")
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
    let permissions = Interaction.member.permissions;
    if(!permissions.has("MANAGE_ROLES")) return Interaction.editReply({content: "You don't have the permission to use this command!", ephemeral: true})

    const payto = Interaction.options.getUser("user")
    const amount = Interaction.options.getInteger("amount")
    const userOfCommand = await User.findOne({ id: payto.id }) || new User({ id: payto .id })
    const embed = new MessageEmbed()

    userOfCommand.wallet = userOfCommand.wallet + amount;
    userOfCommand.save()
      
    let guild = Interaction.guild
    return Interaction.editReply({
        embeds: [ embed.setTitle("Sent Successfully!")
            .setDescription(`💸 Congrats you have sent \`🪙 ${amount} $XCORP\` amount to ${payto.username}`)
            .setColor("GREEN")
            .setThumbnail(payto.displayAvatarURL())
        ],
        ephemeral: true
    })
    }
    catch(err)
    {
        console.log(err)
    }
}