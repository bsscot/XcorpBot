  const {SlashCommandBuilder} = require("@discordjs/builders");
const { MessageEmbed, MessageButton, Modal, SelectMenuComponent, TextInputComponent, TextInputStyle, Discord, MessageActionRow } = require("discord.js");
//const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require('discord-modals');
const { User } = require("../utils/schemas");
const { Quest } = require("../utils/quest");
const { Unique } = require("../utils/unique");

module.exports.data = new SlashCommandBuilder()
.setName("listinvites")
.setDescription("Checks how many ")



module.exports.run = async (bot, Interaction, options) =>
{
    try
    {
    let user_of = Interaction.member;
    if(!user_of.permissions.has("MANAGE_ROLES") && user_of.user.id != "303604936522989578" && user_of.user.id != "328719626525736971") return Interaction.editReply({content: "You don't have the permission to use this command!", ephemeral: true})


    var globalvar = await Unique.findOne({sn: `invite`})
    var counter = 0;
    const queslist = new MessageEmbed()
    if (globalvar === null)
    {
      return Interaction.editReply({
        content: "There's no contest running now"
      })
    }
    if((globalvar.timer - Date.now()) > 0)
    {
      queslist.setDescription(`Below it shows the number of raffle tickets each user has for the invite contest, each ticket reflects 1 invites through the bot`)
      var checked = []
      var target
      var member_id
      var tag
      for (var i = 0; i < globalvar.final_winner.length; i++)
      {
        target = globalvar.final_winner[i]
        if (!checked.includes(`${target}`))
        {
          for (users of globalvar.final_winner) {
            if (users == target) {
                  counter++;
              }
          };
            member_id = await bot.users.fetch(`${target.toString()}`)
            tag = member_id.username + "#" + member_id.discriminator
            queslist.addFields({name: `• ${tag}:`, value: `${counter}`, inline: false})
          counter = 0;
          checked[checked.length] = `${target}`
        }
        
    }
        await Interaction.editReply({
        embeds: [ queslist ]
      })
      return;
    }
    else if ((globalvar.timer - Date.now()) < 0)
    {
      queslist.setDescription(`__THIS CONTEST HAS ENDED__ - Below it shows the number of raffle tickets each user has for the invite contest, each ticket reflects 1 invites through the bot`)
      var checked = []
      var target
      var member_id
      for (var i = 0; i < globalvar.final_winner.length; i++)
      {
        target = globalvar.final_winner[i]
        if (!checked.includes(`${target}`))
        {
          for (users of globalvar.final_winner) {
            if (users == target) {
                  counter++;
              }
          };
            member_id = await bot.users.fetch(`${target.toString()}`)
            tag = member_id.username + "#" + member_id.discriminator
            queslist.addFields({name: `• ${tag}:`, value: `${counter}`, inline: false})
          counter = 0;
          checked[checked.length] = `${target}`
        }
        
    }
        await Interaction.editReply({
        embeds: [ queslist ]
      })
      return;
    }
    else
    {
      await Interaction.editReply({
        content: "There's no contest running now"
      })
      return;
    }
    }
    catch(err)
    {
        console.log(err)
    }
}