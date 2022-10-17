const {SlashCommandBuilder} = require("@discordjs/builders");
const { Interaction, MessageEmbed, MessageAttachment,  MessageActionRow, MessageButton } = require("discord.js");
const { User } = require("../utils/schemas");
const { Unique } = require("../utils/unique");
const { Global } = require("../utils/global");
const prettyMilliseconds = require('pretty-ms');

module.exports.data = new SlashCommandBuilder()
.setName("rafflestore")
.setDescription("Create a raffle store message")



module.exports.run = async (bot, Interaction, options) =>
{
    let permissions = Interaction.member.permissions;
    if(!permissions.has("MANAGE_ROLES")) return Interaction.editReply({content: "You don't have the permission to use this command!", ephemeral: true})

    const raffleEmbed = new MessageEmbed()
    .setTitle("🎫 Raffle Store")
    .setDescription("Press one of the buttons below to interact with the raffle store")
    .setImage("https://media.discordapp.net/attachments/1008252567769321522/1015711407645409280/unknown.png?width=481&height=671")
    .setColor("BLUPLE")

    const row = new MessageActionRow()
    .addComponents(
    [
        new MessageButton()
        .setLabel("NFT Raffles")
        .setStyle("DANGER")
        .setCustomId(`rafflestore-NFT-2-3`)
        .setEmoji("🎫"),

        new MessageButton()
        .setLabel("Whitelist Raffles")
        .setStyle("SUCCESS")
        .setCustomId(`rafflestore-WL-2-3`)
        .setEmoji("🎫"),
        
        new MessageButton()
        .setLabel("Your Tickets")
        .setStyle("PRIMARY")
        .setCustomId(`rafflestore-owned-2-3`)
        .setEmoji("💼"),

        new MessageButton()
        .setLabel("Stats")
        .setStyle("SECONDARY")
        .setCustomId(`rafflestore-stats-2-3`)
        .setEmoji("📈"),

        new MessageButton()
        .setLabel("My Balance")
        .setStyle("SECONDARY")
        .setCustomId(`rafflestore-balance-2-3`)
        .setEmoji("💰")
    ]
    )

    return Interaction.editReply(
    {
        embeds: [ raffleEmbed ], components: [row], ephemeral: false
    }
    )

}
// globalvar.raffle.set_title = set_title 
// globalvar.raffle.set_description = set_description
// globalvar.raffle.set_item =  set_item
// globalvar.raffle.set_image = set_image
// globalvar.raffle.set_cost= set_cost
// globalvar.raffle.max = max
// globalvar.raffle.win = win
// globalvar.raffle.set_hours = set_hours
// globalvar.raffle.set_createdby = set_createdby
// globalvar.raffle.set_thumbnail = set_thumbnail
// globalvar.timer = nowsers
module.exports.button = async (bot, interaction, user, action, another_user) => {
    try
    {
    if (user == "WL")
    {
        const globalvar = await Global.findOne({ var: "shoota"}) || new Global({ var: "shoota"})
        //var chaid = interaction.channelId;
        await interaction.editReply({
            content: "Below are all the current raffles", ephemeral: true
        });
        for(var i = globalvar.current_wl_count; i < (globalvar.wl_count+1); i++ )
        {
            var traverse = await Unique.findOne({ sn: `WL${i}`}) || new Unique({ sn: `WL${i}`})
            //console.log(Date.parse(traverse.timer), Date.now())
            if((traverse.timer - Date.now()) > 0)
            {
                const raffleEmbed = new MessageEmbed()
                .setTitle(traverse.raffle.set_title)
                .setDescription(traverse.raffle.set_description)
                .setImage(traverse.raffle.set_image)
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

                await interaction.followUp({
                    embeds: [ raffleEmbed ],  components: [row], ephemeral: true
                });
            }
        }
        return;
    }
    else if (user == "NFT")
    {
        const globalvar = await Global.findOne({ var: "shoota"}) || new Global({ var: "shoota"})
        //var chaid = interaction.channelId;
        await interaction.editReply({
            content: "Below are all the current raffles", ephemeral: true
        });
        for(var i = globalvar.current_nft_count; i < (globalvar.nft_count+1); i++ )
        {
            var traverse = await Unique.findOne({ sn: `NFT${i}`}) || new Unique({ sn: `NFT${i}`})
            //console.log(Date.parse(traverse.timer), Date.now())
            if((traverse.timer - Date.now()) > 0)
            {
                const raffleEmbed = new MessageEmbed()
                .setTitle(traverse.raffle.set_title)
                .setDescription(traverse.raffle.set_description)
                .setImage(traverse.raffle.set_image)
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

                await interaction.followUp({
                    embeds: [ raffleEmbed ],  components: [row], ephemeral: true
                });
            }
        }
      return;
    }
    else if (user == "owned")
    {
        const userData = await User.findOne({id: interaction.member.user.id}) || new User({id: interaction.member.user.id})
        //var chaid = interaction.channelId;
        await interaction.editReply({
            content: "Below are all your current holdings of tickets:", ephemeral: true
        });
        var raffleEmbed = new MessageEmbed()
        .setTitle("💼 Your Tickets!")
        .setDescription("Below listed are all the raffles currently running which you have bought tickets for:")
        .setColor("BLACK")
        .setFooter({ text: `Goodluck on your raffles!`})
        .setThumbnail(interaction.member.user.displayAvatarURL())

        var done = (userData.winnerraffle).filter((item,index,self) => self.indexOf(item)==index);
        var count_bag = 0;
        for(var i = 0; i < (done.length); i++ )
        {
            var traverse = await Unique.findOne({ sn: `${done[i]}`}) || new Unique({ sn: `${done[i]}`})
            count_bag = 0;
            for(var k = 0; k < (userData.winnerraffle.length); k++ )
            {
                if (done[i] == userData.winnerraffle[k])
                {
                    count_bag += 1;
                }
            }
            if((traverse.timer - Date.now()) > 0)
            {
                raffleEmbed
                .addField(`${traverse.raffle.set_title}`, `**Item:** ${traverse.raffle.set_item} **Time:** <t:${Math.round(Date.parse(traverse.timer) / 1000)}:R> **Chance:** ${Math.round((count_bag/traverse.entries.length)*100)}%`)//Chance: ${}
            }
        }
        return interaction.followUp({
            embeds: [ raffleEmbed ], ephemeral: true
        });
    }

    else if (user == "stats")
    {

        await interaction.editReply({
            content: "Below are the stats for current raffles:", ephemeral: true
        });

        const globalvar = await Global.findOne({ var: "shoota"}) || new Global({ var: "shoota"})

        var raffleEmbed = new MessageEmbed()
        .setTitle("📈 Raffle Stats")
        .setDescription("Below is the stats if you buy one ticket for current raffles:")
        .setColor("BLACK")


        for(var i = globalvar.current_wl_count; i < (globalvar.wl_count+1); i++ )
        {
            var traverse = await Unique.findOne({ sn: `WL${i}`}) || new Unique({ sn: `WL${i}`})
            if((traverse.timer - Date.now()) > 0)
            {
                raffleEmbed
                .addField(`${traverse.raffle.set_title}`, `**Item:** ${traverse.raffle.set_item} **Time:** <t:${Math.round(Date.parse(traverse.timer) / 1000)}:R> **Chance:** ${Math.round((1/(traverse.entries.length + 1))*100)}%`)//Chance: ${}
            }
        }

        for(var i = globalvar.current_nft_count; i < (globalvar.nft_count+1); i++ )
        {
            var traverse_nft = await Unique.findOne({ sn: `NFT${i}`}) || new Unique({ sn: `NFT${i}`})
            if((traverse_nft.timer - Date.now()) > 0)
            {
                raffleEmbed
                .addField(`${traverse_nft.raffle.set_title}`, `**Item:** ${traverse_nft.raffle.set_item} **Time:** <t:${Math.round(Date.parse(traverse_nft.timer) / 1000)}:R> **Chance:** ${Math.round((1/(traverse_nft.entries.length + 1))*100)}%`)//Chance: ${}
            }
        }

        return interaction.followUp({
            embeds: [ raffleEmbed ], ephemeral: true
        });
    }
      else if(user == "balance")
      {
    const user = interaction.member.user
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
        embeds: [ balanceEmbed ], ephemeral: true
    })
      }
    }
    catch(err)
    {
        console.log(err)
    }
        // await interaction.reply({
        //     content: "Only WL and NFT raffles are available at the moment", ephemeral: true
        // });

 
    }
