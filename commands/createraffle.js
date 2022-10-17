const {SlashCommandBuilder} = require("@discordjs/builders");
const { Interaction, MessageEmbed, MessageAttachment,  MessageActionRow, MessageButton } = require("discord.js");
const { User } = require("../utils/schemas");
const { Unique } = require("../utils/unique");
const { Global } = require("../utils/global");
const prettyMilliseconds = require('pretty-ms');

module.exports.data = new SlashCommandBuilder()
.setName("createraffle")
.setDescription("Create a raffle")
.addStringOption(
    option => option
    .setName("title")
    .setDescription("Title of the raffle")
    .setRequired(true)
)
.addStringOption(
    option => option
    .setName("description")
    .setDescription("Enter the description of the raffle")
    .setRequired(true)
)
.addStringOption(
    option => option
    .setName("item")
    .setDescription("Type WL or NFT depending on the type of raffle")
    .setRequired(true)
)
.addStringOption(
    option => option
    .setName("image")
    .setDescription("Enter the image url for the raffle")
    .setRequired(true)
)
.addIntegerOption(
    option => option
    .setName("cost")
    .setDescription("Enter the cost of the raffle ticket")
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
    .setRequired(true)
)
.addIntegerOption(
    option => option
    .setName("hours")
    .setDescription("Enter the time of the raffle (in hours)")
    .setRequired(true)
)
.addUserOption(
    option => option
    .setName("createdby")
    .setDescription("Tag yourself to be shown in the raffle")
    .setRequired(true)
)



module.exports.run = async (bot, Interaction, options) =>
{
    try
    {
    let user_of = Interaction.member;
    if(!user_of.permissions.has("MANAGE_ROLES") && user_of.user.id != "303604936522989578" && user_of.user.id != "328719626525736971") return Interaction.editReply({content: "You don't have the permission to use this command!", ephemeral: true})


    // var CongratsWinner = bot.channels.cache.find(channel => channel.id === `1008177791562432543`);
    // if(Interaction.channel.id != "1008177791562432543") return Interaction.editReply({content: `You can only use this command in ${CongratsWinner}`})
      
    const globalvar = await Global.findOne({ var: "shoota"}) || new Global({ var: "shoota"})
    

    const set_title = Interaction.options.getString("title")
    const set_description = Interaction.options.getString("description")
    const set_item = Interaction.options.getString("item")
    const set_image = Interaction.options.getString("image")
    const set_cost = Interaction.options.getInteger("cost")
    const max = Interaction.options.getInteger("maxtickets")
    const win = Interaction.options.getInteger("winners")
    const set_hours = Interaction.options.getInteger("hours")
    const set_createdby = Interaction.options.getUser("createdby")
      
    if (set_item == "WL" || set_item == "wl" || set_item == "Wl")
    {
        var raffles_db = await Unique.findOne({sn: `WL${globalvar.wl_count}`}) || new Unique({sn: `WL${globalvar.wl_count}`}) 

        var nowsers = new Date(Date.now())
        nowsers.setHours(nowsers.getHours() + set_hours)
    
        raffles_db.raffle.set_title = set_title 
        raffles_db.raffle.set_description = set_description
        raffles_db.raffle.set_item =  "WL"
        raffles_db.raffle.set_image = set_image
        raffles_db.raffle.set_cost= set_cost
        raffles_db.raffle.max = max
        raffles_db.raffle.win = win
        raffles_db.raffle.set_hours = set_hours
        raffles_db.raffle.set_createdby = set_createdby.username
        raffles_db.timer = nowsers
        raffles_db.save()

        var i = globalvar.wl_count
        
        globalvar.wl_count = globalvar.wl_count + 1;
        globalvar.save()
    }
    else if (set_item == "NFT" || set_item == "Nft" || set_item == "nft")
    {
        var raffles_db = await Unique.findOne({sn: `NFT${globalvar.nft_count}`}) || new Unique({sn: `NFT${globalvar.nft_count}`}) 

        var nowsers = new Date(Date.now())
        nowsers.setHours(nowsers.getHours() + set_hours)
    
        raffles_db.raffle.set_title = set_title 
        raffles_db.raffle.set_description = set_description
        raffles_db.raffle.set_item =  "NFT"
        raffles_db.raffle.set_image = set_image
        raffles_db.raffle.set_cost= set_cost
        raffles_db.raffle.max = max
        raffles_db.raffle.win = win
        raffles_db.raffle.set_hours = set_hours
        raffles_db.raffle.set_createdby = set_createdby.username
        raffles_db.timer = nowsers
        raffles_db.save()
      var i = globalvar.nft_count
        
        globalvar.nft_count = globalvar.nft_count + 1;
        globalvar.save()
    }
    else
    {
        return Interaction.editReply(
        {
            content: "As of now only NFT or WL raffles are supported please type: WL or NFT in the `item` field", ephemeral: true//embeds: [ raffleEmbed ], components: [row], ephemeral: false
        }
        )
    }
                const raffleEmbed = new MessageEmbed()
                .setTitle(raffles_db.raffle.set_title)
                .setDescription(raffles_db.raffle.set_description)
                .setImage(raffles_db.raffle.set_image)
                .setFooter({ text: `This raffle was created by: ${raffles_db.raffle.set_createdby}\nSerial Number: ${raffles_db.raffle.set_item}${i}`})
                .addField("Item given away:", `**\`${raffles_db.raffle.set_item}\`**`, true)
                .addField("Time:", `<t:${Math.round(Date.parse(raffles_db.timer) / 1000)}:R>`, true)
                .addField("Cost for the ticket:", `**\`🪙 ${raffles_db.raffle.set_cost} $XCORP\`**`, true)
                .setColor("GREEN")
                var a = raffles_db.raffle.set_cost
                var b = raffles_db.raffle.set_item
                var c = raffles_db.raffle.set_hours
                var d = raffles_db.raffle.max
                var e = raffles_db.raffle.win
                var f = raffles_db.raffle.set_createdby
                const row = new MessageActionRow()
                .addComponents(
                    [
                    new MessageButton()
                    .setLabel("Buy a ticket!")
                    .setStyle("SUCCESS")
                    .setCustomId(`createraffle-${a}/${b}/${i}/${c}/${d}/${e}-raffle-${f}`)
                    .setEmoji("🎫"),

                    new MessageButton()
                    .setLabel("Remaining time until draw")
                    .setStyle("PRIMARY")
                    .setCustomId(`checktime-1/${b}${i}/${c}/1-timer-1`)
                    .setEmoji("⌛")
                    ]
                )
        // CongratsWinner.send({
        //         embeds: [ raffleEmbed ], components: [ row ]
        // });
        return Interaction.editReply({
            embeds: [ raffleEmbed ], components: [ row ]
    });
    }
    catch(err)
    {
        console.log(err)
    }
}

module.exports.button = async (bot, interaction, user, action, another_user) => {
    try{
    var [cost, Item, Number, hours, max_tickets, winner] = user.split("/")
    var giveawayNumber = Item + Number
    const globalvar = await Unique.findOne({sn: `${giveawayNumber}`}) || new Unique({sn: `${giveawayNumber}`}) 
    var enter = interaction.member.user
    const userData = await User.findOne({id: enter.id}) || new User({id: enter.id})
    var max = parseInt(max_tickets)
    var win = parseInt(winner)
    const hrs = parseInt(hours)
    const costs = parseInt(cost)
    const embed = new MessageEmbed()

            if(Date.parse(globalvar.timer) < Date.now())
            {
              interaction.message.delete();
              return interaction.editReply({content: "This raffle has ended"});
            }
    
    if(userData.wallet < cost) return interaction.editReply(
        {
            content: `You don't have enough points in your wallet to buy a ticket`,
            ephemeral: true
        }
    )


    var repeated = 0
    for(var i = 0; globalvar.entries.length > i; i++)
    {
        if (globalvar.entries[i] == `${enter.id}`)
        {
            repeated++
        }
    }

    if(repeated==max){ 
        return interaction.editReply(
            {
                content: `You have bought the max amount of tickets for this raffle: ${max_tickets}`,
                ephemeral: true
            }
        )
        
    }
    if (userData.quests.raffle == 0)
    {
        userData.quests.raffle = 1
    }

    var botFlip = await User.findOne({ id: bot.user.id}) || new User({ id: bot.user.id})
    const found_Array = globalvar.entries;
    globalvar.entries[found_Array.length] = `${enter.id}`
    userData.wallet = userData.wallet - costs    
    botFlip.wallet = botFlip.wallet + costs
    // if (userData.winnerraffle === undefined)
    // {
    //     userData.winnerraffle[0] = `${giveawayNumber}`
    // }
    // else
    // {
    userData.winnerraffle[userData.winnerraffle.length] = `${giveawayNumber}`
    // }

    botFlip.save()
    userData.save()
    globalvar.save()
    //console.log(userData.winnerraffle)

    return interaction.editReply({
        content: `You bought a ticket\n Serial Number: ${giveawayNumber}`,
        ephemeral: true
    })    
    }
    catch(err)
    {
        console.log(err)
    }
}