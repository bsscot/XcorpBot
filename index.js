
const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const prettyMilliseconds = require('pretty-ms');
require('dotenv').config();
const { commands } = require("./slash-register");
const Bot = new Discord.Client({
  presence: {
    status: "online",
    afk: false,
    activities: [{
      name: "everything you say",
      type: "LISTENING"
    }],
  },
  intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INTEGRATIONS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING", "GUILD_SCHEDULED_EVENTS"],
  partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "GUILD_SCHEDULED_EVENT"]
})

const mongoose = require("mongoose")
require("./slash-register")(true)
const { User } = require("./utils/schemas");
const { Invitesdb } = require("./utils/invites");
const { Global } = require("./utils/global");
const { Quest } = require("./utils/quest");
const { Unique } = require("./utils/unique");

const Levels = require("discord-xp");
Levels.setURL(process.env.mongo)
const InvitesTracker = require('@androz2091/discord-invites-tracker');
const tracker = InvitesTracker.init(Bot, {
  fetchGuilds: true,
  fetchVanity: true,
  fetchAuditLogs: true
});



Bot.on('ready', async () => {
  console.log("The Bot is ON")
  // var xpRequired = Levels.xpFor(8);
  // console.log(xpRequired)
})

tracker.on('guildMemberAdd', async (member, type, invite) => {

  //const welcomeChannel = member.guild.channels.cache.find((ch) => ch.name === 'welcome');
try{
  var namekick = (member.user.username).toLowerCase()
  if(namekick.includes('giveaway') || namekick.includes('announcement') || namekick.includes('moderator') || namekick.includes('bot')) 
  {
    member.ban();
    return;
  }
  if (type === 'normal' || type === 'vanity') {
    const invite_codes = await Invitesdb.findOne({ cd: `${invite.code}` })
    if (invite_codes == null)
    {
      return
    }
    console.log("invite code:", invite.code)
    var code_inv = await invite_codes.inviter
    console.log("inviter:", code_inv)


    if (invite.code != "skunksocialclub") {
      console.log("entered")
      //invite_codes.invited[invite_codes.invited.length] = 
      if (!invite_codes.invited.includes(`${member.user.id}`)) {
        invite_codes.invited.push(`${member.user.id}`)
        invite_codes.save()
        //invite_codes.inviter
        var globalvar = await Unique.findOne({sn: `invite`}) || new Unique({sn: `invite`}) 
        var counter = 0;
        //console.log((globalvar.timer -  Date.now()) > 0)
        if((globalvar.timer -  Date.now()) > 0)
        {
          //console.log("WE in")
          if (code_inv !== undefined)
          {
          globalvar.entries[globalvar.entries.length] = `${code_inv}`

          for (users of globalvar.entries) {
            if (users == `${code_inv}`) {
                  counter++;
              }
          };

          if (counter == 1)
          {
            globalvar.final_winner[globalvar.final_winner.length] = `${code_inv}`

            var i = globalvar.entries.length;
            while (i--) {
                if (globalvar.entries[i] === `${code_inv}`) {
                    globalvar.entries.splice(globalvar.entries.indexOf(`${code_inv}`), 1);
                }
            }
          }
          globalvar.save()
          }
        }

  }
    }
  }
}
catch(err)
{
  console.log(err)
}
});


Bot.on('interactionCreate', async interaction => {
  try {
    // await interaction.deferReply({ephemeral: true});
    //   await interaction.deferReply({ephemeral: true});
    if (interaction.isCommand()) {
      // await interaction.deferReply({ephemeral: false});
      let name = interaction.commandName;
      let options = interaction.options;
      if (name == "coinflip" || name == "pickwinner") {
        await interaction.deferReply({ ephemeral: true });
      }
      else if (name == "new-raffle") {
      }
      else {
        await interaction.deferReply({ ephemeral: false });
      }
      let commandMethod = commands.get(name);
      if (!commandMethod) return;

      commandMethod.run(Bot, interaction, options);
    }
    else if (interaction.isButton()) {
      // await interaction.deferReply({ephemeral: true});
      let button_id = interaction.customId;
      let [command, user, action, another_user] = button_id.split("-");
      if (command == "coinflip") {
        await interaction.deferReply({ ephemeral: false });
      }
      else {
        await interaction.deferReply({ ephemeral: true });
      }
      let buttoCallback = commands.get(command);
      if (!buttoCallback) return;
      buttoCallback.button(Bot, interaction, user, action, another_user);
    }
    else if (interaction.isModalSubmit()){
      let modal_id = interaction.customId;

      if(modal_id == 'raffleModal')
        {
          await interaction.deferReply({ ephemeral: false });
          // Get the data entered by the user
          const title       = interaction.fields.getTextInputValue('title');
          const description     = interaction.fields.getTextInputValue('description');
          const image       = interaction.fields.getTextInputValue('image');
          const cost        = parseInt(interaction.fields.getTextInputValue('cost'));
          const hours        = parseInt(interaction.fields.getTextInputValue('hours'));

          const globalvar = await Global.findOne({ var: "shoota"}) || new Global({ var: "shoota"})


          var raffles_db = await Unique.findOne({sn: `WL${globalvar.wl_count}`})
          var wl = true
          if(raffles_db == null)
          {
          raffles_db = await Unique.findOne({sn: `NFT${globalvar.nft_count}`})
          wl = false
          }

          var nowsers = new Date(Date.now())
          nowsers.setHours(nowsers.getHours() + hours)

          raffles_db.raffle.set_title = title
          raffles_db.raffle.set_description = description
          raffles_db.raffle.set_image = image 
          raffles_db.raffle.set_cost= cost
          raffles_db.raffle.set_hours = hours
          raffles_db.timer = nowsers
          raffles_db.save()

          if (wl == true)
          {
            var i = globalvar.wl_count

          }
          else if (wl == false)
          {
            var i = globalvar.nft_count
          }

                const raffleEmbed = new Discord.MessageEmbed()
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
                const row = new Discord.MessageActionRow()
                .addComponents(
                    [
                    new Discord.MessageButton()
                    .setLabel("Buy a ticket!")
                    .setStyle("SUCCESS")
                    .setCustomId(`createraffle-${a}/${b}/${i}/${c}/${d}/${e}-raffle-${f}`)
                    .setEmoji("🎫"),

                    new Discord.MessageButton()
                    .setLabel("Remaining time until draw")
                    .setStyle("PRIMARY")
                    .setCustomId(`checktime-1/${b}${i}/${c}/1-timer-1`)
                    .setEmoji("⌛")
                    ]
                )

                if (wl == true)
                {
                  globalvar.wl_count = globalvar.wl_count + 1
                }
                else if (wl == false)
                {
                  globalvar.nft_count = globalvar.nft_count + 1
                }
                globalvar.save()
        return interaction.editReply({
                embeds: [ raffleEmbed ], components: [ row ]
        });
  }
  }
  }
  catch (err) {
    console.log(err)
  }

})


Bot.on('messageReactionAdd', async (reaction, user, message) => {

  const msg = reaction.message;
  const guild = msg.guild;
  const guildMember = await guild.members.fetch({ user, force: true })
  const member = await reaction.message.guild.members.cache.find(member => member.id == user.id)
  
  if(reaction.message.id == "1018880021370249226"){
    if(reaction.emoji.name == "✅"){
        const eoicrole = reaction.message.guild.roles.cache.find(r => r.id == "987402314841227275")
        member.roles.add(eoicrole)
        .catch((err) => {
            return console.log(err)
        })
    }
  }

  if (reaction.message.channel.id == "987148278862848061" || reaction.message.channel.id == "987148291429007360" || reaction.message.channel.id == "987148346361798676") {
      const userData = await User.findOne({ id: user.id }) || new User({ id: user.id })
      userData.wallet = await userData.wallet + 50;
      if (userData.quests.rxn < 5)
      {
        userData.quests.rxn += 1
      }
      await userData.save()
    }

  //   if(reaction.partial){
  //     try {
  //         await reaction.fetch()
  //     } catch (error) {
  //         return console.error("Something went wrong when fetching the message:", error)
  //     }
  // }
  //   else
  //   {

     if ((reaction.message.channel.id == "1008178075869130812") && ((guildMember.roles.cache.some(r => r.name === "HQ")) || (guildMember.roles.cache.some(r => r.name === "Middle Ground Order") || (guildMember.roles.cache.some(r => r.name === "MODS"))))) {
      const quest = await Quest.findOne({qst: `${reaction.emoji.name}`}) //|| new Quest({qst: `${reaction.emoji.name}`})
      if (quest != null)
      {
        try
        {
          var message_id = await Bot.channels.cache.get(reaction.message.channel.id).messages.fetch(reaction.message.id)//.then(message => message.delete())//reaction.message.channel.messages.fetch(`${reaction.message.id}`)
          var author_id = await message_id.author.id
        }
        catch(Err)
        {
          console.log(Err)
        }

        if (!quest.winners.includes(`${author_id}`)) {
          quest.winners[quest.winners.length] = `${author_id}`
          await quest.save()
        }
        return;
      }
      else{
        return;
      }
   // }
  }

})

Bot.on('messageReactionRemove', async (reaction, user) => {

    const member = await reaction.message.guild.members.cache.find(member => member.id == user.id)
    if(reaction.message.id == "1018880021370249226"){
      if(reaction.emoji.name == "✅"){
          const eoicrole = reaction.message.guild.roles.cache.find(r => r.id == "987402314841227275")
          member.roles.remove(eoicrole)
          .catch((err) => {
              return console.log(err)
          })
      }
    }
    //const member = reaction.message.guild.members.cache.find(member => member.id == user.id)
    if (reaction.message.channel.id == "987148278862848061" || reaction.message.channel.id == "987148291429007360" || reaction.message.channel.id == "987148346361798676") {
      const userData = await User.findOne({ id: user.id }) || new User({ id: user.id })
      if (userData.wallet > 50) {
        userData.wallet = await userData.wallet - 50;
      }
      userData.save()
    }
  
})


Bot.on('messageCreate', async (message) => {
  try
  {
  if (!message.guild) return;
  if (message.author.bot) return;
  var prefix = "!"
  var is_command = true
  if (!message.content.startsWith(prefix)) {
    is_command = false
  }
  if (is_command == true) {
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const commandpre = args.shift().toLowerCase();

    var command_ch = "1008178248888373288"
    var daily_ch = "1008159822291677245"
    

    if (commandpre == "daily") {
      var CongratsWinner = Bot.channels.cache.find(channel => channel.id === daily_ch);
      //console.log(CongratsWinner.name)
      //console.log(CongratsWinner)
      if (message.channel.id != daily_ch && message.channel.id != command_ch) return message.reply({ content: `You can only use this command in ${CongratsWinner}` })
      //only in daily channel
      const user = message.author
      const userData = await User.findOne({ id: user.id }) || new User({ id: user.id })
      const embed = new Discord.MessageEmbed({ color: "YELLOW" })

      if (userData.cooldowns.daily > Date.now()) return message.channel.send({
        embeds: [
          embed.setDescription(`⌛ You have already collected your daily points, wait for **\`${prettyMilliseconds(userData.cooldowns.daily - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}\`**`)
        ]
      })
      // if (userData.cooldowns.daily > Date.now()) return message.reply({
      //   content:`⌛ You have already collected your daily points, wait for **\`${prettyMilliseconds(userData.cooldowns.daily - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}\`**`
      // })

      var amount = 200
      userData.wallet += amount
      userData.cooldowns.daily = Date.now() + (1000 * 60 * 60 * 24)
      userData.save()
      return message.channel.send({
        embeds: [embed.setDescription(`💰 You have collected your daily \`🪙 ${amount} $XCORP\` amount`)]
      })
      // return message.reply({
      //   content: `💰 You have collected your daily \`🪙 ${amount} $XCORP\` amount`
      // })
    }

    else if (commandpre == "work") {

      var job = [
        "🧑‍💼 XCORP Engineer",
        "👩‍💻 XCORP Technologist",
        "🧑‍🏫 XCORP Technology Research",
        "🧑‍🔬 Scientist",
        "👷 Factory Worker",
        "💂 Facility Security",
        "🧑‍🏭 Factory Worker",
        "🤖 Xmachina"
      ]
      var amounts = [
        250,
        200,
        200,
        150,
        100,
        50,
        50,
        50
      ]
      var CongratsWinner = Bot.channels.cache.find(channel => channel.id === daily_ch);
      //console.log(CongratsWinner)
      if (message.channel.id != daily_ch) return message.reply({ content: `You can only use this command in ${CongratsWinner}` })
      //only use in brew channel
      const user = message.author
      const userData = await User.findOne({ id: user.id }) || new User({ id: user.id })

      if (userData.cooldowns.work > Date.now())
        return message.reply({
          embeds: [
            new Discord.MessageEmbed()
              .setColor("RED")
              .setDescription(`⌛ You can work again in: **\`${prettyMilliseconds(userData.cooldowns.work - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}\`**`)
          ]
        })
        // return message.reply({
        //   content: `⌛ You can work again in: **\`${prettyMilliseconds(userData.cooldowns.work - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}\`**`
        // })


      var index = Math.floor(Math.random() * job.length)
      const amount = amounts[index]
      const jobs = job[index]

      userData.wallet += amount
      userData.cooldowns.work = Date.now() + (1000 * 60 * 60 * 1)
      userData.save()

      const workEmbed = new Discord.MessageEmbed()
        .setDescription(`You worked as a **\` ${jobs} \`** and earned \` 🪙 ${amount} $XCORP\``)
        .setColor("AQUA")

      return message.channel.send({ embeds: [workEmbed] })
      //return message.reply({ content: `You worked as a **\` ${jobs} \`** and earned \` 🪙 ${amount} $XCORP\`` })
    }
    else if (commandpre == "balance") {
      var brew = Bot.channels.cache.find(channel => channel.id === daily_ch);
      var CongratsWinner = Bot.channels.cache.find(channel => channel.id === command_ch);
      if (message.channel.id != daily_ch && message.channel.id != command_ch) return message.channel.send({ content: `You can only use this command in ${CongratsWinner} or ${brew}` })
      const user = message.author
      const userData = await User.findOne({ id: user.id }) || new User({ id: user.id })
      //guild.emojis.cache.get("1001387657424805909");
      const balanceEmbed = new Discord.MessageEmbed()
        .setTitle(`${user.username}'s balance`)
        .setDescription("Note: wallet details of requested user")
        .setColor("YELLOW")
        .setThumbnail(user.displayAvatarURL())
        .addField("• Wallet", `🪙 ${userData.wallet}`, true) //` ${emoji_is}**\` ${userData.wallet} $XCORP\`**`, true)
      // .addField("• Solana", `**\` ${userData.bank} 🪙 \`**`, true)

      return message.channel.send({
        embeds: [balanceEmbed]
      })
      // return message.reply({
      //   content: `• Wallet: 🪙 ${userData.wallet}`
      // })
    }
    else if (commandpre == "register") {
      var CongratsWinner = Bot.channels.cache.find(channel => channel.id === command_ch);
      if (message.channel.id != command_ch) return message.channel.send({ content: `You can only use this command in ${CongratsWinner}` })
      const user = message.author
      const userData = await User.findOne({ id: user.id }) || new User({ id: user.id })
      userData.save()

      return message.channel.send({
        content: "You've been successfully registered!", ephemeral: true
      })
    }
    else if (commandpre == "help") {
      var CongratsWinner = Bot.channels.cache.find(channel => channel.id === command_ch);
      if (message.channel.id != command_ch) return message.channel.send({ content: `You can only use this command in ${CongratsWinner}` })

      const infoEmbed = new Discord.MessageEmbed()
        .setTitle("Help:")
        .setDescription("Below is information about how to use the bot")
        .setColor("BLUPLE")
        .addField("__Users Commands__", `__/register__ or __!register__: to register your profile on the database.\n__/coinflip__: you can enter and amount to bet against the bot in a coinflip game, then you'll be prompted to choose between heads or tails\n__/balance__ or __!balance__ : checks your wallet balance\n__/daily__ or __!daily__: Collect your daily coins.\n__/rank__: check your or another user's rank.\n__/position__: check your or another user's position on the leaderboard.\n__/pay__: Send another user a specific amount of coins.\n__/work__ or __!work__ : complete your quests to earn coins.\n`)
        .setColor("DARK_ORANGE")


      return message.channel.send({
        embeds: [infoEmbed]
      })
      // return message.reply({content: `Help:\n__/register__ or __!register__: to register your profile on the database.\n__/coinflip__: you can enter and amount to bet against the bot in a coinflip game, then you'll be prompted to choose between heads or tails\n__/balance__ or __!balance__ : checks your wallet balance\n__/daily__ or __!daily__: Collect your daily coins.\n__/rank__: check your or another user's rank.\n__/position__: check your or another user's position on the leaderboard.\n__/pay__: Send another user a specific amount of coins.\n__/work__ or __!work__ : complete your quests to earn coins.\n`})
    }
  }
  else {
    if (message.content.length >= 5) {
      const randomAmountOfXp = Math.floor(Math.random() * 29) + 1;
      const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
      if (hasLeveledUp) {
        const addpoint = await User.findOne({ id: message.author.id }) || new User({ id: message.author.id })
        const userz = await Levels.fetch(message.author.id, message.guild.id);
        var CongratsWinner = Bot.channels.cache.find(channel => channel.id === "1008178248888373288");
        if(userz.level < 5)
        {
          CongratsWinner.send(`${message.author}, congratulations! You have leveled up to **${userz.level}** and earned 250 coins. :tada:`);
          addpoint.wallet += 250;
        }
        // else if(userz.level >= 5 && )
        // {
        //   CongratsWinner.send(`${message.author}, congratulations! You have leveled up to **${userz.level}** and earned 500 coins. :tada:`);
        //   addpoint.wallet += 500;
        // }
        else if(userz.level < 8 && userz.level > 5)
        {
          CongratsWinner.send(`${message.author}, congratulations! You have leveled up to **${userz.level}** and earned 700 coins. :tada:`);
          addpoint.wallet += 700;
        }
        else if(userz.level == 8)
        {
          CongratsWinner.send(`${message.author}, congratulations! You have leveled up to **${userz.level}** and earned 800 coins. :tada:`);
          addpoint.wallet += 800;
          // const oneplusrole = await message.guild.roles.cache.find(r => r.id == "943042953713164368")
          // await message.member.roles.add(oneplusrole)
        }
        else if(userz.level > 8 && userz.level < 10)
        {
          CongratsWinner.send(`${message.author}, congratulations! You have leveled up to **${userz.level}** and earned 1000 coins. :tada:`);
          addpoint.wallet += 1000;
        }
        else if (userz.level == 10)
        {
          CongratsWinner.send(`${message.author}, congratulations! You have leveled up to **${userz.level}** and earned 2000 coins. :tada:`);
          addpoint.wallet += 2000;
          // const oneplusrole = await message.guild.roles.cache.find(r => r.id == "984744842766716928")
          // await message.member.roles.add(oneplusrole)
        }
        else if (userz.level > 10 && userz.level < 20)
        {
          CongratsWinner.send(`${message.author}, congratulations! You have leveled up to **${userz.level}** and earned 2500 coins. :tada:`);
          addpoint.wallet += 2500;
        }
        else if (userz.level >= 20)
        {
          CongratsWinner.send(`${message.author}, congratulations! You have leveled up to **${userz.level}** and earned 5000 coins. :tada:`);
          addpoint.wallet += 5000;
        }

        addpoint.save()
      }
    }
  }
}
  catch(err)
  {
    console.log(err)
  }
})






Bot.login(process.env.token).then(() => mongoose.connect(process.env.mongo))

