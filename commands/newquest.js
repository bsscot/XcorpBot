const {SlashCommandBuilder} = require("@discordjs/builders");
const { MessageEmbed, MessageButton, Modal, SelectMenuComponent, TextInputComponent, TextInputStyle, Discord, MessageActionRow } = require("discord.js");
//const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require('discord-modals');
const { User } = require("../utils/schemas");
const { Quest } = require("../utils/quest");
const { Global } = require("../utils/global");

module.exports.data = new SlashCommandBuilder()
.setName("newquest")
.setDescription("Create a quest")
.addStringOption(
    option => option
    .setName("rules")
    .setDescription("Enter the rules of the quest")
    .setRequired(true)
)
.addIntegerOption(
    option => option
    .setName("reward")
    .setDescription("Enter the reward users will gain")
    .setRequired(true)
)
.addStringOption(
    option => option
    .setName("emoji")
    .setDescription("Enter the approve emoji for admins to approve proofs")
    .setRequired(true)
)
.addStringOption(
    option => option
    .setName("link")
    .setDescription("Enter the link to direct people to do the quest - ex. tweet link")
    .setRequired(false)
)
.addStringOption(
    option => option
    .setName("image")
    .setDescription("Enter the image url for the quest - this is optional")
    .setRequired(false)
)

module.exports.run = async (bot, Interaction, options) =>
{
    try
    {
    let user_of = Interaction.member;
    if(!user_of.permissions.has("MANAGE_ROLES") && user_of.user.id != "303604936522989578" && user_of.user.id != "328719626525736971") return Interaction.editReply({content: "You don't have the permission to use this command!", ephemeral: true})
    
    var quest_ch = bot.channels.cache.find(channel => channel.id === `1008177989743288360`);
    if(Interaction.channel.id != "1008177989743288360") return Interaction.editReply({content: `You can only use this command in ${quest_ch}`})


    const proof = "1008178075869130812"
    var proof_ch = bot.channels.cache.find(channel => channel.id === proof);

    const global = await Global.findOne({var: "shoota"})

    const rul = Interaction.options.getString("rules")
    const rwd = Interaction.options.getInteger("reward")
    const appv = Interaction.options.getString("emoji")
    const img = Interaction.options.getString("image")
    const link = Interaction.options.getString("link")

    const check = await Quest.findOne({qst: `${appv}`})
    if (check == null)
    {
        const quest = await new Quest({qst: `${appv}`})
        quest.save()
    }
    else
    {
        return Interaction.editReply({
            content: "this emoji has already been used before for approving, please use another emoji"
        });
    }

    global.quest_num += 1;
    global.save()

    const amount1 = rwd
    const quest1 = new MessageEmbed()
    .setTitle(`Quest ${global.quest_num}:`)
    .setDescription(`__Rules:__\n${rul}\n- Post your proof in ${proof_ch}`)
    .setColor("PURPLE")
    //.setThumbnail(user.displayAvatarURL())
    .addField("• Reward", `🪙 ${amount1}`, true)
    .setFooter({text: `Approve Reaction Emoji: ${appv}`})
    if (img)
    {
        quest1.setThumbnail(`${img}`)
    }
    

    if (link)
    {
        var row1 = new MessageActionRow()
        .addComponents(
            [
                new MessageButton()
                .setLabel('CONFIRM COMPLETION')
                .setStyle('SUCCESS')
                .setCustomId(`newquest-q-${amount1}-${appv}`)
                .setEmoji(`✅`),

                new MessageButton()
                .setLabel('CLICK THIS')
                .setURL(`${link}`)
                .setStyle('LINK')
                .setEmoji(`🔗`),
            ])
    }
    else 
    {
        var row1 = new MessageActionRow()
        .addComponents(
            [
                new MessageButton()
                .setLabel('CONFIRM COMPLETION')
                .setStyle('SUCCESS')
                .setCustomId(`newquest-q-${amount1}-${appv}`)
                .setEmoji(`✅`),

            ])
    }


    return Interaction.editReply({
        embeds: [ quest1 ],  components: [row1]
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
        if (user == "q")// ME proof
        {
        const quest = await Quest.findOne({qst: `${emoji}`})
            
        if (quest.winners.includes(`${interaction.member.user.id}`))
        {
            if (!quest.complete.includes(`${interaction.member.user.id}`))
            {
                quest.complete[quest.complete.length] = `${interaction.member.user.id}`
                userData.wallet += amount;
                userData.save()
                quest.save()
                return interaction.editReply({content: `Goodjob! you earned ${amount} coins!`})
            }
            else
            {
                return interaction.editReply({content: `You've already completed this quest before and collected the coins!`})
            }
        }
        else
        {
            return interaction.editReply({content: `You have not completed this quest or your submission is still awaiting approval from the team.`})
        }
        }
    }
    catch(err)
    {
        console.log(err)
    }
}