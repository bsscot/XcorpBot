const {SlashCommandBuilder} = require("@discordjs/builders");
const { MessageEmbed, MessageButton, Modal, SelectMenuComponent, TextInputComponent, TextInputStyle, Discord, MessageActionRow } = require("discord.js");
//const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require('discord-modals');
const { User } = require("../utils/schemas");
const { Quest } = require("../utils/quest");

module.exports.data = new SlashCommandBuilder()
.setName("quests")
.setDescription("Create a raffle")



module.exports.run = async (bot, Interaction, options) =>
{
    try
    {
    let user_of = Interaction.member;
    if(!user_of.permissions.has("MANAGE_ROLES") && user_of.user.id != "303604936522989578" && user_of.user.id != "328719626525736971") return Interaction.editReply({content: "You don't have the permission to use this command!", ephemeral: true})
    
    var CongratsWinner = bot.channels.cache.find(channel => channel.id === `1008177989743288360`);
    if(Interaction.channel.id != "1008177989743288360") return Interaction.editReply({content: `You can only use this command in ${CongratsWinner}`})
    

    const proof = "1008178075869130812"
    const cf = "1008177899590930484"
    const raffle = "1008162289649721364"
    const ann = "987148278862848061"
    const up = "987148291429007360"
    const sp = "987148346361798676"
    var proof_ch = bot.channels.cache.find(channel => channel.id === proof);
    var cf_ch = bot.channels.cache.find(channel => channel.id === cf);
    var raffle_ch = bot.channels.cache.find(channel => channel.id === raffle);
    var ann_ch = bot.channels.cache.find(channel => channel.id === ann);
    var up_ch = bot.channels.cache.find(channel => channel.id === up);
    var sp_ch = bot.channels.cache.find(channel => channel.id === sp);

    await Interaction.editReply({
        content: "Below are all the quests"
    }).then(message => message.delete());


    const amount3 = 250
    const quest3 = new MessageEmbed()
    .setTitle(`Quest 1:`)
    .setDescription(`__Rules:__\nChange your profile picture on discord to a sneakpeek photo then post your proof in ${proof_ch}, once done press the button below to check if you've completed it successfully`)
    .setColor("PURPLE")
    //.setThumbnail(user.displayAvatarURL())
    .addField("• Reward", `🪙 ${amount3}`, true) 
    .setFooter({text: "Approve Reaction Emoji: 1️⃣"})
    .setThumbnail("https://cdn.discordapp.com/attachments/938527732751532153/1008187814963335228/unknown.png")

    const row3 = new MessageActionRow()
    .addComponents(
            new MessageButton()
            .setLabel('CONFIRM COMPLETION')
            .setStyle('SUCCESS')
            .setCustomId(`quests-q3-${amount3}-1️⃣`)
            .setEmoji(`✅`),

        )

    const check2 = await Quest.findOne({qst: "1️⃣"})
    if (check2 == null)
    {
        const quest = await new Quest({qst: "1️⃣"})
        quest.save()
    }

    await Interaction.followUp({
        embeds: [ quest3 ],  components: [row3]//, ephemeral: true
    });

    const amount4 = 250
    const quest4 = new MessageEmbed()
    .setTitle(`Quest 2:`)
    .setDescription(`__Rules:__\nLike and retweet our pinned post, then post your proof in ${proof_ch}, once done please wait for the team to approve your proof, then press the button below to check if you've completed it successfully`)
    .setColor("PURPLE")
    //.setThumbnail(user.displayAvatarURL())
    .addField("• Reward", `🪙 ${amount4}`, true)
    .setFooter({text: "Approve Reaction Emoji: 2️⃣"})
    .setThumbnail("https://media.discordapp.net/attachments/934202018799685752/1004631944497201272/unknown.png")

    const row4 = new MessageActionRow()
    .addComponents(
        [
            new MessageButton()
            .setLabel('CONFIRM COMPLETION')
            .setStyle('SUCCESS')
            .setCustomId(`quests-q4-${amount4}-2️⃣`)
            .setEmoji(`✅`),

            new MessageButton()
            .setLabel('CLICK THIS')
            .setURL(`https://twitter.com/XcorpNFT`) 
            .setStyle('LINK')
            .setEmoji(`🔗`),

        ])

    const check3 = await Quest.findOne({qst: "2️⃣"})
    if (check3 == null)
    {
        const quest = await new Quest({qst: "2️⃣"})
        quest.save()
    }

    await Interaction.followUp({
        embeds: [ quest4 ],  components: [row4]
    });


    const amount2 = 400
    const quest2 = new MessageEmbed()
    .setTitle(`Quest 3:`)
    .setDescription("__Rules:__\nInclude XCORP in your discord name, once done press the button below to check if you've completed it successfully")
    .setColor("PURPLE")
    //.setThumbnail(user.displayAvatarURL())
    .addField("• Reward", `🪙 ${amount2}`, true) 
    .setThumbnail("https://media.discordapp.net/attachments/938527732751532153/1008190738393223188/aHmEfm_400x400.jpg")

    const row2 = new MessageActionRow()
    .addComponents(
            new MessageButton()
            .setLabel('CONFIRM COMPLETION')
            .setStyle('SUCCESS')
            .setCustomId(`quests-q2-${amount2}-3`)
            .setEmoji(`✅`),

        )

    await Interaction.followUp({
        embeds: [ quest2 ],  components: [row2]//, ephemeral: true
    });


    const amount5 = 500
    const quest5 = new MessageEmbed()
    .setTitle(`Quest 4:`)
    .setDescription(`__Rules:__\nDo a coinflip in ${cf_ch}, once done press the button below to check if you've completed it successfully`)
    .setColor("PURPLE")
    //.setThumbnail(user.displayAvatarURL())
    .addField("• Reward", `🪙 ${amount5}`, true) 
    .setThumbnail("https://media.discordapp.net/attachments/934202018799685752/1004632408630493184/unknown.png")

    const row5 = new MessageActionRow()
    .addComponents(
            new MessageButton()
            .setLabel('CONFIRM COMPLETION')
            .setStyle('SUCCESS')
            .setCustomId(`quests-q5-${amount5}-3`)
            .setEmoji(`✅`),

        )

    await Interaction.followUp({
        embeds: [ quest5 ],  components: [row5]
    });

    const amount6 = 300
    const quest6 = new MessageEmbed()
    .setTitle(`Quest 5:`)
    .setDescription(`__Rules:__\nPerform 5 reactions in ${ann_ch}, ${up_ch}, or ${sp_ch}, once done press the button below to check if you've completed it successfully. Please note that every reaction in announcements, update and sneakpeek gives you 50 $XCORP`)
    .setColor("PURPLE")
    //.setThumbnail(user.displayAvatarURL())
    .addField("• Reward", `🪙 ${amount6}`, true)
    .setThumbnail("https://media.discordapp.net/attachments/934202018799685752/1004633018511655003/unknown.png?width=671&height=671")

    const row6 = new MessageActionRow()
    .addComponents(
            new MessageButton()
            .setLabel('CONFIRM COMPLETION')
            .setStyle('SUCCESS')
            .setCustomId(`quests-q6-${amount6}-3`)
            .setEmoji(`✅`),

        )

    await Interaction.followUp({
        embeds: [ quest6 ],  components: [row6]
    });

    const amount7 = 300
    const quest7 = new MessageEmbed()
    .setTitle(`Quest 6:`)
    .setDescription(`__Rules:__\nBuy a raffle ticket in ${raffle_ch}, once done press the button below to check if you've completed it successfully`)
    .setColor("PURPLE")
    //.setThumbnail(user.displayAvatarURL())
    .addField("• Reward", `🪙 ${amount7}`, true)
    .setThumbnail("https://media.discordapp.net/attachments/934202018799685752/1004633139802538044/unknown.png")

    const row7 = new MessageActionRow()
    .addComponents(
            new MessageButton()
            .setLabel('CONFIRM COMPLETION')
            .setStyle('SUCCESS')
            .setCustomId(`quests-q7-${amount7}-3`)
            .setEmoji(`✅`),

        )

    await Interaction.followUp({
        embeds: [ quest7 ],  components: [row7]
    });

    }
    catch(err)
    {
        console.log(err)
    }
}

// const mans = Interaction.member.nickname
// const check2 = Interaction.member.user.username
// return Interaction.editReply({content: `${mans.includes("SSC") || check2.includes("SSC")}`});

module.exports.button = async (bot, interaction, user, action, another_user) => {
    try{
        var amount = parseInt(action)
        var emoji = another_user
        const userData = await User.findOne({id: interaction.member.user.id}) || new User({id: interaction.member.user.id})

        if (user == "q2")
        {
            var members = interaction.member
            var users = interaction.member.user


            if (members.nickname != null)
            {
            if (userData.quests.name == false)
            {
                if ( users.username.includes("XCORP") || users.username.includes("xcorp") || members.nickname.includes("XCORP") || members.nickname.includes("xcorp") )
                {
                    userData.quests.name = true;
                    userData.wallet += amount;
                    userData.save()
                    return interaction.editReply({content: `Goodjob! you earned ${amount} coins!`})
                }
                else 
                {
                    return interaction.editReply({content: `Your name does not include XCORP, please add XCORP or xcorp to your name on discord to complete this quest`})
                }
            }
            else
            {
                return interaction.editReply({content: `You've already completed this quest before and collected the coins!`})
            }
        }
        else{
            if (userData.quests.name == false)
            {
                if ( users.username.includes("XCORP") || users.username.includes("xcorp") )
                {
                    userData.quests.name = true;
                    userData.wallet += amount;
                    userData.save()
                    return interaction.editReply({content: `Goodjob! you earned ${amount} coins!`})
                }
                else 
                {
                    return interaction.editReply({content: `Your name does not include XCORP, please add XCORP or xcorp to your name on discord to complete this quest`})
                }
            }
            else
            {
                return interaction.editReply({content: `You've already completed this quest before and collected the coins!`})
            }
        }
        }
        else if (user == "q3")//sneak peek proof
        {
            const quest = await Quest.findOne({qst: `${emoji}`})
            
            if (quest.winners.includes(`${interaction.member.user.id}`))
            {
                if (userData.quests.pfp == false)
                {
                    userData.quests.pfp = true;
                    userData.wallet += amount;
                    userData.save()
                    return interaction.editReply({content: `Goodjob! you earned ${amount} coins!`})
                }
                else if (userData.quests.pfp == true)
                {
                    return interaction.editReply({content: `You've already completed this quest before and collected the coins!`})
                }
            }
            else
            {
                return interaction.editReply({content: `You have not completed this quest or your submission is still awaiting approval from the team.`})
            }
        }

        else if (user == "q4")//like rt proof
        {
            const quest = await Quest.findOne({qst: `${emoji}`})
            
            if (quest.winners.includes(`${interaction.member.user.id}`))
            {
                if (userData.quests.twt == false)
                {
                    userData.quests.twt = true;
                    userData.wallet += amount;
                    userData.save()
                    return interaction.editReply({content: `Goodjob! you earned ${amount} coins!`})
                }
                else if (userData.quests.twt == true)
                {
                    return interaction.editReply({content: `You've already completed this quest before and collected the coins!`})
                }
            }
            else
            {
                return interaction.editReply({content: `You have not completed this quest or your submission is still awaiting approval from the team.`})
            }
        }
        else if (user == "q5")//cf
        {
            if (userData.quests.cf == 0)
            {
                return interaction.editReply({content: `You have not completed this quest yet, please do a coinflip in the coinflip channel before pressing the button`})
            }
            else if (userData.quests.cf == 1)
            {
                userData.quests.cf = 2;
                userData.wallet += amount;
                userData.save()
                return interaction.editReply({content: `Goodjob! you earned ${amount} coins!`})

            }
            else if (userData.quests.cf == 2)
            {
                return interaction.editReply({content: `You've already completed this quest before and collected the coins!`})
            }
        }
        else if (user == "q6")//5 rxns
        {
            if (userData.quests.rxn < 5)
            {
                return interaction.editReply({content: `You have not completed this quest yet, you currently have ${userData.quests.rxn} reactions`})
            }
            else if (userData.quests.rxn >= 5)
            {
                if(userData.quests.rxn_done == false)
                {
                    userData.wallet += amount;
                    userData.quests.rxn_done = true
                    userData.save()
                    return interaction.editReply({content: `Goodjob! you earned ${amount} coins!`})
                }
                else
                {
                    return interaction.editReply({content: `You've already completed this quest before and collected the coins!`})
                }

            }
        }
        else if (user == "q7")//buy raffle
        {
            if (userData.quests.raffle == 0)
            {
                return interaction.editReply({content: `You have not completed this quest yet, please buy a raffle ticket in the raffle listings channel before pressing the button`})
            }
            else if (userData.quests.raffle == 1)
            {
                userData.quests.raffle = 2;
                userData.wallet += amount;
                userData.save()
                return interaction.editReply({content: `Goodjob! you earned ${amount} coins!`})

            }
            else if (userData.quests.raffle == 2)
            {
                return interaction.editReply({content: `You've already completed this quest before and collected the coins!`})
            }
        }
    }
    catch(err)
    {
        console.log(err)
    }
}