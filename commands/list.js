const {SlashCommandBuilder} = require("@discordjs/builders");
const { Interaction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { User } = require("../utils/schemas");
const { Global } = require("../utils/global");
const { Unique } = require("../utils/unique");

module.exports.data = new SlashCommandBuilder()
.setName("list")
.setDescription("list current raffles")
.addStringOption(option =>
    option.setName('item')
        .setDescription('Select raffle type')
        .addChoices(
            { name: 'WL', value: 'WL' },
            { name: 'NFT', value: 'NFT' },
        )
        .setRequired(true))
.addIntegerOption(
    option => option
    .setName('number')
    .setDescription("Please enter the number of the giveaway you'd like to post")
    .setRequired(true)
)

module.exports.run = async (bot, interaction) =>
{
    try
    {

        let user_of = interaction.member;
        if (!user_of.permissions.has("MANAGE_ROLES") && user_of.user.id != "303604936522989578" && user_of.user.id != "328719626525736971") return Interaction.editReply({content: "You don't have the permission to use this command!", ephemeral: true})

        const itm = interaction.options.getString("item")
        const num = interaction.options.getInteger("number")


        var traverse = await Unique.findOne({ sn: `${itm}${num}`})

        if(traverse == null || traverse === null) interaction.editReply({
            content: "raffle doesnt exist yet."
        });

        const raffleEmbed = new MessageEmbed()
        .setTitle(traverse.raffle.set_title)
        .setDescription(traverse.raffle.set_description)
        .setImage(traverse.raffle.set_image)
        .setFooter({ text: `This raffle was created by: ${traverse.raffle.set_createdby}\nSerial Number: ${traverse.raffle.set_item}${num}`})
        .addField("Item given away:", `**\`${traverse.raffle.set_item}\`**`, true)
        .addField("Time:", `<t:${Math.round(Date.parse(traverse.timer) / 1000)}:R>`, true)
        .addField("Cost for the ticket:", `**\`🪙 ${traverse.raffle.set_cost} $XCORP\`**`, true)
        .setColor("DARK_RED")
        var a = traverse.raffle.set_cost
        var b = traverse.raffle.set_item
        var c = traverse.raffle.set_hours
        var d = traverse.raffle.max
        var e = traverse.raffle.win
        var f = traverse.raffle.set_createdby
        const row = new MessageActionRow()
        .addComponents(
            [
            new MessageButton()
            .setLabel("Buy a ticket!")
            .setStyle("SUCCESS")
            .setCustomId(`createraffle-${a}/${b}/${num}/${c}/${d}/${e}-raffle-${f}`)
            .setEmoji("🎫"),

            new MessageButton()
            .setLabel("Remaining time until draw")
            .setStyle("PRIMARY")
            .setCustomId(`checktime-1/${b}${num}/${c}/1-timer-1`)
            .setEmoji("⌛")
            ]
        )

        return interaction.editReply({
            embeds: [ raffleEmbed ],  components: [row]
        });
    }
    catch(err)
    {
        console.log(err)
    }
}