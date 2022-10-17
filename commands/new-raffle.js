const {SlashCommandBuilder} = require("@discordjs/builders");
//const { MessageEmbed, Modal, SelectMenuComponent, TextInputComponent, TextInputStyle, Discord, MessageActionRow } = require("discord.js");
const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require('discord-modals');
const { User } = require("../utils/schemas");
const { Unique } = require("../utils/unique");
const { Global } = require("../utils/global");

module.exports.data = new SlashCommandBuilder()
.setName("new-raffle")
.setDescription("Create a raffle")
.addStringOption(option =>
  option.setName('item')
      .setDescription('Select raffle type')
      .addChoices(
          { name: 'WL', value: 'WL' },
          { name: 'NFT', value: 'NFT' },
      )
      .setRequired(true))

.addStringOption(
  option => option
  .setName("createdby")
  .setDescription("Tag yourself to be shown in the raffle")
  .addChoices(
      { name: 'ShootaHunnid', value: 'ShootaHunnid' },
      { name: 'Elias', value: 'Elias' },
      { name: 'Slaya', value: 'Slaya' },
      { name: 'Skunk Raffle Bot', value: 'Skunk Raffle Bot' }, 
  )
  .setRequired(true)
)
.addIntegerOption(
  option => option
  .setName("winners")
  .setDescription("Enter the number of winners")
  .setRequired(true)
)
.addIntegerOption(
  option => option
  .setName("maxtickets")
  .setDescription("Enter the max amount of tickets each user could purchase")
  .setRequired(false)
)


module.exports.run = async (bot, Interaction, options) =>
{
    try
    {
    let user_of = Interaction.member;
    if(!user_of.permissions.has("MANAGE_ROLES") && user_of.user.id != "303604936522989578" && user_of.user.id != "328719626525736971") return Interaction.reply({content: "You don't have the permission to use this command!", ephemeral: true})

    // var CongratsWinner = bot.channels.cache.find(channel => channel.id === `1008177791562432543`);
    // if(Interaction.channel.id != "1008177791562432543") return Interaction.reply({content: `You can only use this command in ${CongratsWinner}`})
 
    const itm = Interaction.options.getString("item")
    const cby = Interaction.options.getString("createdby")
    const win = Interaction.options.getInteger("winners")
    const max = Interaction.options.getInteger("maxtickets") || 100;


    const globalvar = await Global.findOne({ var: "shoota"}) || new Global({ var: "shoota"})

    if (itm == "WL")
    {
      var raffles_db = await new Unique({sn: `WL${globalvar.wl_count}`})
    }
    else
    {
      var raffles_db = await new Unique({sn: `NFT${globalvar.nft_count}`})
    }

    raffles_db.raffle.set_item = itm
    raffles_db.raffle.set_createdby = cby
    raffles_db.raffle.win = win
    raffles_db.raffle.max = max
    raffles_db.save()


    const modal = new Modal()
    .setCustomId('raffleModal')
    .setTitle('Create A Raffle')
    .addComponents(
        new TextInputComponent() 
        .setCustomId('title')
        .setLabel('Title')
        .setStyle('SHORT') 
        .setPlaceholder('Write the title of the raffle here.')
        .setRequired(true), 

        new TextInputComponent() 
        .setCustomId('description')
        .setLabel('Description')
        .setStyle('PARAGRAPH') 
        .setPlaceholder('Write the description of the raffle here.')
        .setRequired(true), 

        new TextInputComponent() 
        .setCustomId('image')
        .setLabel('Image')
        .setStyle('SHORT') 
        .setPlaceholder('Paste the url for the raffle image')
        .setRequired(true), 

        new TextInputComponent() 
        .setCustomId('cost')
        .setLabel('Cost')
        .setStyle('SHORT') 
        .setPlaceholder('Enter how much a raffle ticket costs E.G. 200')
        .setRequired(true), 

        new TextInputComponent() 
        .setCustomId('hours')
        .setLabel('Hours')
        .setStyle('SHORT') 
        .setPlaceholder('Enter how many hours the raffle will run E.G. 24')
        .setRequired(true), 
      
      )


    return Interaction.showModal(modal);

    }
    catch(err)
    {
        console.log(err)
    }
}