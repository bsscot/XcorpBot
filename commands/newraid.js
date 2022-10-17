const {SlashCommandBuilder} = require("@discordjs/builders");
const { MessageEmbed, MessageButton, Modal, SelectMenuComponent, TextInputComponent, TextInputStyle, Discord, MessageActionRow } = require("discord.js");
//const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require('discord-modals');
const { User } = require("../utils/schemas");
const { Quest } = require("../utils/quest");
const { Global } = require("../utils/global");

module.exports.data = new SlashCommandBuilder()
.setName("newraid")
.setDescription("Post a raid")
.addStringOption(
    option => option
    .setName("rules")
    .setDescription("Enter the rules of the raid")
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
    .setDescription("Enter the link to direct people to raid - ex. tweet link")
    .setRequired(true)
)


module.exports.run = async (bot, Interaction, options) =>
{
    try
    {
    let user_of = Interaction.member;
    if(!user_of.permissions.has("MANAGE_ROLES") && user_of.user.id != "303604936522989578" && user_of.user.id != "328719626525736971") return Interaction.editReply({content: "You don't have the permission to use this command!", ephemeral: true})
    
    var quest_ch = bot.channels.cache.find(channel => channel.id === `1008178138993414216`);
    if(Interaction.channel.id != "1008178138993414216") return Interaction.editReply({content: `You can only use this command in ${quest_ch}`})
    
    //const roletag = await Interaction.guild.roles.cache.find(r => r.id == "991214517692411986")


    const proof = "1008178075869130812"
    var proof_ch = bot.channels.cache.find(channel => channel.id === proof);

    const global = await Global.findOne({var: "shoota"})

    const rul = Interaction.options.getString("rules")
    const rwd = Interaction.options.getInteger("reward")
    const appv = Interaction.options.getString("emoji")
    const link = Interaction.options.getString("link")

    const check = await Quest.findOne({qst: `${appv}`})
    if (check == null)
    {
        const quest = await new Quest({qst: `${appv}`})
        quest.is_raid = true;
        quest.save()
    }
    else
    {
        return Interaction.editReply({
            content: "this emoji has already been used before for approving, please use another emoji"
        });
    }

    global.raid_num += 1;
    global.save()

    const amount1 = rwd
    const quest1 = new MessageEmbed()
    .setTitle(`Raid ${global.raid_num}:`)//raid num
    .setDescription(`__Rules:__\n${rul}\n- Post your proof in ${proof_ch}`)
    .setColor("BLUE")
    //.setThumbnail(user.displayAvatarURL())
    .addField("• Reward", `🪙 ${amount1}`, true)
    .setFooter({text: `Approve Reaction Emoji: ${appv}`})
    .setThumbnail('https://static01.nyt.com/images/2014/08/10/magazine/10wmt/10wmt-superJumbo-v4.jpg')

    
    var row1 = new MessageActionRow()
    .addComponents(
        [
            new MessageButton()
            .setLabel('CONFIRM COMPLETION')
            .setStyle('SUCCESS')
            .setCustomId(`newraid-q-${amount1}-${appv}`)
            .setEmoji(`✅`),

            new MessageButton()
            .setLabel('CLICK THIS')
            .setURL(`${link}`)
            .setStyle('LINK')
            .setEmoji(`🔗`),
        ])
    


    await Interaction.editReply({
        embeds: [ quest1 ],  components: [row1]//, content: `${roletag}`
    })
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