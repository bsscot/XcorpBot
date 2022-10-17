const {SlashCommandBuilder} = require("@discordjs/builders");
const { Interaction, MessageEmbed, MessageAttachment,  MessageActionRow, MessageButton } = require("discord.js");
const { User } = require("../utils/schemas");
const { Unique } = require("../utils/unique");
const { Global } = require("../utils/global");

module.exports.data = new SlashCommandBuilder()
.setName("contestwinner")
.setDescription("pick a winner for the invite contest")



module.exports.run = async (bot, interaction, options) =>
{
    try
    {
        let user_of = interaction.member;
        if(!user_of.permissions.has("MANAGE_ROLES") && user_of.user.id != "303604936522989578" && user_of.user.id != "328719626525736971") return interaction.editReply({content: "You don't have the permission to use this command!", ephemeral: true})

        var traverse = await Unique.findOne({ sn: `invite`})
        var track = await Unique.findOne({ sn: `shoota`})
        if(traverse !== null)
        {
            if(Date.parse(traverse.timer) < Date.now()){
                var randomz = Math.floor(Math.random() * (traverse.final_winner.length - 1));
                var found = traverse.final_winner[randomz]
                var member_id = await bot.users.fetch(`${found.toString()}`)
                const raffleEmbed = new MessageEmbed()
                .setTitle("🎉Invite contest result:🎉")
                .setDescription(`The winner of the invite contest is: ${member_id.username}#${member_id.discriminator}`)

                await interaction.editReply({
                        embeds: [ raffleEmbed ]
                });
                track.final_winner = traverse.final_winner
                track.save()
            await Unique.deleteOne({ sn: `invite`})
            return;
        }
        else
        {
            return interaction.editReply({
                    content: "There's no current contest going, a winner has already been picked for the last one."
            });
        }

    }
    else{
            return interaction.editReply({
                    content: "The timer hasn't ran out yet for the current contest."
            });
    }
    }
    catch(err)
    {
        console.log(err)
    }
}