const {SlashCommandBuilder} = require("@discordjs/builders");
const { Interaction, MessageEmbed, MessageAttachment,  MessageActionRow, MessageButton } = require("discord.js");
const { User } = require("../utils/schemas");
const { Unique } = require("../utils/unique");
const { Global } = require("../utils/global");

module.exports.data = new SlashCommandBuilder()
.setName("pickwinner")
.setDescription("pick a winner for an ended raffle")
.addStringOption(option =>
  option.setName('item')
      .setDescription('Select raffle type')
      .addChoices(
          { name: 'WL', value: 'WL' },
          { name: 'NFT', value: 'NFT' }
      )
      .setRequired(true))
.addStringOption(
    option => option
    .setName("discord")
    .setDescription("Enter the link for the WL discord server")
    .setRequired(false)
)



module.exports.run = async (bot, interaction, options) =>
{
    try
    {
    let user_of = interaction.member;
    if (!user_of.permissions.has("MANAGE_ROLES") && user_of.user.id != "303604936522989578" && user_of.user.id != "328719626525736971")  return interaction.editReply({content: "You don't have the permission to use this command!", ephemeral: true})

    var set_item = interaction.options.getString("item")
    var link = interaction.options.getString("discord")
    const globalvar = await Global.findOne({ var: "shoota"}) || new Global({ var: "shoota"})

    if (set_item == "WL" || set_item == "Wl" || set_item == "wl" || set_item == "wL")
    {
        await interaction.editReply({
            content: "Below are all the ended WL raffles", ephemeral: true
        })
        for(var i = 0; i < (globalvar.wl_count+1); i++ )
        {
            var traverse = await Unique.findOne({ sn: `WL${i}`}) || new Unique({ sn: `WL${i}`})
            if((((Date.parse(traverse.timer) < Date.now())) && (traverse.final_winner.length == 0)))
            {
                //console.log(i)
                 let guild = interaction.guild
                const emoji_is = interaction.guild.emojis.cache.find(emoji => emoji.name === 'BREWTOKEN')
                var winEmbed = new MessageEmbed()
                .setTitle(traverse.raffle.set_title)
                .setDescription(traverse.raffle.set_description)
                //.setImage("https://cdn.discordapp.com/attachments/990647828852408350/995354885597970533/green.png")
                .setThumbnail(traverse.raffle.set_image)
                .setFooter({ text: `This raffle was created by: ${traverse.raffle.set_createdby}\nSerial Number: ${traverse.raffle.set_item}${i}`})
                .addField("Item given away:", `**\`${traverse.raffle.set_item}\`**`, true)
                .addField("Cost for the ticket:", `**\`🪙 ${traverse.raffle.set_cost} $XCORP\`**`, true)
                .setColor("GREEN")
                var a = traverse.raffle.set_cost
                var b = traverse.raffle.set_item
                var c = traverse.raffle.set_hours
                var d = traverse.raffle.max
                var e = traverse.raffle.win
                var f = traverse.raffle.set_createdby
                var row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setLabel("Pick winners!")
                    .setStyle("SUCCESS")
                    .setCustomId(`pickwinner-${a}/${b}/${i}/${c}/${d}/${e}-${link}-${f}`)
                    .setEmoji("🎉")
                )


                    await interaction.followUp({
                        embeds: [ winEmbed ],  components: [row], ephemeral: true
                    });
            }
        }
      return;
    }
    else if (set_item == "NFT" || set_item == "Nft" || set_item == "nft" || set_item == "nfT" || set_item == "nFT")
    {
        await interaction.editReply({
            content: "Below are all the ended NFT raffles", ephemeral: true
        });
        for(var i = 0; i < (globalvar.nft_count+1); i++ )
        {
            var traverse = await Unique.findOne({ sn: `NFT${i}`}) || new Unique({ sn: `NFT${i}`})
            if((((Date.parse(traverse.timer) < Date.now())) && (traverse.final_winner.length == 0)))
            {
                let guild = interaction.guild
                const emoji_is = interaction.guild.emojis.cache.find(emoji => emoji.name === 'BREWTOKEN')
                const raffleEmbed = new MessageEmbed()
                .setTitle(traverse.raffle.set_title)
                .setDescription(traverse.raffle.set_description)
                //.setImage("https://cdn.discordapp.com/attachments/990647828852408350/995354885597970533/green.png")
                .setThumbnail(traverse.raffle.set_image)
                .setFooter({ text: `This raffle was created by: ${traverse.raffle.set_createdby}\nSerial Number: ${traverse.raffle.set_item}${i}`})
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
                    new MessageButton()
                    .setLabel("Pick winners for this raffle now!")
                    .setStyle("SUCCESS")
                    .setCustomId(`pickwinner-${a}/${b}/${i}/${c}/${d}/${e}-${link}-${f}`)
                    .setEmoji("🎫")
                )

                await interaction.followUp({
                    embeds: [ raffleEmbed ],  components: [row], ephemeral: true
                });
            }
        }
      return;
    }
    else {
        return interaction.editReply({
            content: "As of now only NFT or WL raffles are supported please type, WL or NFT in the `item` field", ephemeral: true
        })
    }
    }
    catch(err)
    {
        console.log(err)
    }
}







module.exports.button = async (bot, interaction, user, action, another_user) => {
    try
    {
    var [cost, Item, Number, hours, max_tickets, winner] = user.split("/")
    var giveawayNumber = Item + Number
    const globalvar = await Unique.findOne({sn: `${giveawayNumber}`}) || new Unique({sn: `${giveawayNumber}`}) 
    var enter = interaction.member.user
    var max = parseInt(max_tickets)
    var win = parseInt(winner)
    const embed = new MessageEmbed()
    if (action != "" && action !== null && action !== undefined)
    {
        embed.addField("• DISCORD LINK:", `${action}`)
    }

    if (globalvar.final_winner.length != 0) return interaction.editReply({
        content: "You've already picked a winner for this raffle"
    })
    
    if ((globalvar.timer - Date.now()) < 0) 
    {
        var members = []
        var tagwins = []
        var lengths = globalvar.entries.length
        var list = globalvar.entries
        //console.log(list)
        for(var i = 0; i<win; i++)
        {   
            var randomz = Math.floor(Math.random() * (list.length - 1));
            var found = list[randomz]
          if(list.length != 0)
          {
            var member_id = await bot.users.fetch(`${found.toString()}`)
          }
          else{
            var randy = interaction.channel.members.filter(member => member).random()
            var member_id = await bot.users.fetch(`${randy.user.id.toString()}`)
          }
            if (member_id)
            {
          //console.log(member_id)
            members[i] = member_id.username + "#" + member_id.discriminator
            tagwins[i] = member_id
          
            //console.log(randomz)  
            var j = list.length
            while (j--) {
                if (list[j] === found) {
                    list.splice(list.indexOf(found), 1);
                }
            }
        }
        else{
            i--
        }
        }
        globalvar.final_winner = members
        globalvar.save()

        var CongratsWinner = bot.channels.cache.find(channel => channel.id === `1008162289649721364`);
        //interaction.channel
        await CongratsWinner.threads.create({
            name: `winners-${giveawayNumber}`,
            autoArchiveDuration: 1440,
            type: 'GUILD_PRIVATE_THREAD',
        })
        .then( thread => {thread.send({
            embeds: [
                embed.setTitle(`🎉${globalvar.raffle.set_title}🎉`)
                .addField("• WINNER(S):", `${tagwins}`, true)
                .addField("• ITEM WON:", `**\`${Item}\`**`, true)
                .addField("• TICKETS BOUGHT:", `**\`${lengths} 🎫\`**`, true)
                .setColor("BLURPLE")
                .setThumbnail(`${globalvar.raffle.set_image}`)
                .setImage("https://cdn.dribbble.com/users/62525/screenshots/11219730/media/ec5d1a3b494a631b3416c3dcb0fe759b.png?compress=1&resize=400x300")
            ]
        });
        thread.send({
            content: `__Winners__: \n${members} \n__Team members to follow up on the prize__: \n<@328719626525736971> <@303604936522989578>`
        });
        thread.send({
            content: `__Winners__: \n${tagwins}`
        }).then(message => message.delete());
    
        })
        .catch(console.error);
        //interaction.deleteReply(); can't delete ephemeral image
        return interaction.editReply({
            content: `Congrats! you picked the winner(s) successfully`,
            ephemeral: true
        })
    }
    }
    catch(err)
    {
        console.log(err)
    }
}


