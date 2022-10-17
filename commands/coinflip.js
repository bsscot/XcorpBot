const {SlashCommandBuilder} = require("@discordjs/builders");
const Discord = require("discord.js");
const { Interaction, MessageEmbed, MessageAttachment,  MessageActionRow, MessageButton } = require("discord.js");
const { User } = require("../utils/schemas");

module.exports.data = new SlashCommandBuilder()
.setName("coinflip")
.setDescription("Bet one of your coins in a coinflip.")
// .addStringOption(
//     option => option
//     .setName("side")
//     .setDescription("Heads or Tails?")
//     .setRequired(true)
// )
.addIntegerOption(
    option => option
    .setName("amount")
    .setDescription("Amount you'd like to bet")
    .setRequired(true)
)




module.exports.run = async (bot, Interaction, options) =>
{
    var CongratsWinner = bot.channels.cache.find(channel => channel.id === `1008177899590930484`);
    if(Interaction.channel.id != "1008177899590930484") return Interaction.editReply({content: `You can only play coinflip in ${CongratsWinner}`})

  const bet_amount = Interaction.options.getInteger("amount");
  
  const embed = new MessageEmbed()
  embed.setColor("BLUE")
  .setTitle("Coinflip against bot!")
  .setDescription("Please choose either Heads or Tails to initiate the bet!");
  
    const row = new MessageActionRow()
    .addComponents(
    [
        new MessageButton()
        .setLabel("HEADS")
        .setStyle("SUCCESS")
        .setCustomId(`coinflip-HEADS-${bet_amount}-3`)
        .setEmoji(`🪙`),

        new MessageButton()
        .setLabel("TAILS")
        .setStyle("SUCCESS")
        .setCustomId(`coinflip-TAILS-${bet_amount}-3`)
        .setEmoji("🪙")
      ])

      await Interaction.editReply(
    {
        embeds: [ embed ], components: [row], ephemeral: true
    }
    )

}





module.exports.button = async (bot, Interaction, user, action, another_user) => {
    var bet_amount = parseInt(action)
    const heads = "https://cdn.discordapp.com/attachments/938527732751532153/1008180203509518407/HEADS.gif"
    const tails = "https://cdn.discordapp.com/attachments/938527732751532153/1008180204163825684/TAILS.gif"
    //var chosen_side = Interaction.options.getString("side");

    var user1 = Interaction.member.user
    var user2 = bot.user;
    var coinflipUser = await User.findOne({ id: user1.id}) || new User({ id: user1.id})
    const embed = new MessageEmbed()

    if((bet_amount < 0 ) || (bet_amount > 15000)) return Interaction.editReply({
        embeds: [
            embed.setTitle('Invalid Amount:')
            .setDescription(`you entered an invalid amount, please enter an amount between 1-15000`)
            .setColor("RED")
        ],
        ephemeral: true
    })
    if(coinflipUser.wallet < bet_amount) return Interaction.editReply({
        embeds: [
            embed.setTitle('Insufficient amount in wallet:')
            .setDescription(`You do not have enough to fulfill this bet`)
            .setColor("RED")
        ],
        ephemeral: true
    })

    if (coinflipUser.quests.cf == 0)
    {
        coinflipUser.quests.cf = 1
    }

    var randomside = Math.floor(Math.random() * 4) + 1;
    var randomuser = Math.floor(Math.random() * 2) + 1;
    coinflipUser.wallet = coinflipUser.wallet - bet_amount
  
    if (user == "HEADS"){
        if(randomuser == 1){
            var c1 = "HEADS";
            var c2 = "TAILS";
        }
        else if(randomuser == 2){
            var c1 = "TAILS";
            var c2 = "HEADS";
         }
        var head = true;
        chosen_side = "HEADS"
    }
    
    else if (user == "TAILS"){
        if(randomuser == 1){
            var c1 = "TAILS";
            var c2 = "HEADS";
        }
        else if(randomuser == 2){
            var c1 = "HEADS";
            var c2 = "TAILS";
         }
         var head = false;
         chosen_side = "TAILS"
    }


    if (randomuser == 1){
        var u1 = user1;
        var u2 = user2;
    }
    if (randomuser == 2){
        var u1 = user2;
        var u2 = user1;
    }
    if (randomside == 1){
        var winner = "HEADS"
        var winnergif = heads
    }
    if (randomside == 2){
        var winner = "TAILS"
        var winnergif = tails
    }
    if (randomside == 3){
        var winner = "TAILS"
        var winnergif = tails
    }
    if (randomside == 4){
        var winner = "HEADS"
        var winnergif = heads
    }

    
    var winnerembed = new MessageEmbed()

    if (winner == "HEADS" && head == true)
    {
        var botWin = false;
    }
    
    if (winner == "TAILS" && head == false)
    {
        var botWin = false;
    }
    
    if (winner == "HEADS" && head == false)
    {
        var botWin = true;
    }
    
    if (winner == "TAILS" && head == true)
    {
        var botWin = true;
    }
    
    if (botWin == true){
        //.setImage("https://cdn.discordapp.com/attachments/990647828852408350/995354885866389615/IMG_3574.png")
        winnerembed.addField("• WINNER:", `**\` ✨${user2.username}✨ \`**`, true)
        .setColor("RED")
        coinflipUser.winner_cf = user2;
    }
    if (botWin == false){
        //winnerembed.setImage("https://cdn.discordapp.com/attachments/990647828852408350/995354885597970533/green.png")
        winnerembed.addField("• WINNER:", `**\` ✨${user1.username}✨ \`**`, true)
        .setColor("GREEN")
        .set
        coinflipUser.wallet = coinflipUser.wallet + bet_amount*2
        coinflipUser.winner_cf = user1;
    }
    coinflipUser.save()

    winnerembed.setTitle("🎉THE COINFLIP WINNER🎉")
    //.setTitle(`${user1.username} +${user2.username} + ${user3.username}`)
    .setDescription(`CHALLENGE BETWEEN ${user1.username} AND THE BOT:`)
    .addField("• BET:", `**\` ${bet_amount} 🪙 \`**`, true)
    .addField("• THE CHALLENGER:", `**\` ${user1.username} \`**`, true)
    .addField("• The CHALLENGER'S SIDE:", `**\` ${chosen_side} \`**`, true)

    var chaid = Interaction.channelId;

    var CongratsWinner = bot.channels.cache.find(channel => channel.id === `${chaid}`);
    setTimeout(() => {
     return Interaction.followUp({
        embeds: [
             winnerembed
        ],
        ephemeral: false
    });

        }, 5000);
    

    var balanceEmbed = new MessageEmbed()
    .setTitle("COIN FLIP!")
    //.setTitle(`${user1.username} +${user2.username} + ${user3.username}`)
    .setDescription("THE PARTICIPANTS ARE:")
    .setColor("WHITE")
    //.setThumbnail(user1.displayAvatarURL()) THUMBNAIL OF LOGO
    .addField("PARTICIPANT 1:",`${u1} - ${c1}`, true)
    .addField("PARTICIPANT 2:",`${u2} - ${c2}`, true)
    .setImage(winnergif);

    
    setTimeout(() => {
        Interaction.deleteReply()
    }, 8000);
    

    return Interaction.editReply(
    {
        embeds: [ balanceEmbed ], ephemeral: false
    }
    )
}