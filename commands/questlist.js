const {SlashCommandBuilder} = require("@discordjs/builders");
const { MessageEmbed, MessageButton, Modal, SelectMenuComponent, TextInputComponent, TextInputStyle, Discord, MessageActionRow } = require("discord.js");
//const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require('discord-modals');
const { User } = require("../utils/schemas");
const { Quest } = require("../utils/quest");

module.exports.data = new SlashCommandBuilder()
.setName("questlist")
.setDescription("Checks which quests you completed!")



module.exports.run = async (bot, Interaction, options) =>
{
    try
    {

    var CongratsWinner = bot.channels.cache.find(channel => channel.id === `1008178248888373288`);
    if(Interaction.channel.id != "1008178248888373288") return Interaction.editReply({content: `You can only use this command in ${CongratsWinner}`})

    const docs = await Quest.find();
    var all_quests = []
    for (var i = 3; i < (docs.length);i++)
    {
        //console.log(docs[i].qst)
        if (docs[i].is_raid == false)
        {
            all_quests[all_quests.length] = docs[i]
        }
    }
    //console.log(docs.length)

    const userData = await User.findOne({id: Interaction.member.user.id}) || new User({id: Interaction.member.user.id})
    var counter = 0;
    const queslist = new MessageEmbed()


    if(userData.quests.pfp == true)
    {
        me_emoji = "✅"
        counter++
    }
    else
    {
        me_emoji = "❌"
    }
    queslist.addFields({name: "• Quest 1:", value: `${me_emoji}`})

    if(userData.quests.twt == true)
    {
        me_emoji = "✅"
        counter++
    }
    else
    {
        me_emoji = "❌"
    }
    queslist.addFields({name: "• Quest 2:", value: `${me_emoji}`})

    if(userData.quests.name == true)
    {
        me_emoji = "✅"
        counter++
    }
    else
    {
        me_emoji = "❌"
    }
    queslist.addFields({name: "• Quest 3:", value: `${me_emoji}`})

    if(userData.quests.cf == 2)
    {
        me_emoji = "✅"
        counter++
    }
    else
    {
        me_emoji = "❌"
    }
    queslist.addFields({name: "• Quest 4:", value: `${me_emoji}`})

    if(userData.quests.rxn_done == true)
    {
        me_emoji = "✅"
        counter++
    }
    else
    {
        me_emoji = "❌"
    }
    queslist.addFields({name: "• Quest 5:", value: `${me_emoji}`})

    if(userData.quests.raffle == 2)
    {
        me_emoji = "✅"
        counter++
    }
    else
    {
        me_emoji = "❌"
    }
    queslist.addFields({name: "• Quest 6:", value: `${me_emoji}`})

    for(var j = 0; j < (all_quests.length);j++)
    {
        //console.log(all_quests[j])
        if(all_quests[j].complete.includes(`${Interaction.member.user.id}`))
        {
            me_emoji = "✅"
            counter++
        }
        else
        {
            me_emoji = "❌"
        }
        queslist.addFields({name: `• Quest ${7+j}:`, value: `${me_emoji}`})
    }

    var completed = 6 + all_quests.length

    if (counter == completed)
    {
        if (userData.quests.bonus == false)
        {
            userData.wallet = userData.wallet + 1000
            userData.quests.bonus = true
            userData.save()
            queslist.addFields({name: `• Completion:`, value:`Congrats you completed all the quests, you earned a bonus 1000 coins`})
        }
        else{
            queslist.addFields({name: `• Completion:`, value:`Congrats you've completed all the current quests`})
        }
    }
    else
    {
        queslist.addFields({name:`• Completion:`, value:`Please complete the missing quests above`})
    }


    await Interaction.editReply({
        embeds: [ queslist ]
    })

    return;

    }
    catch(err)
    {
        console.log(err)
    }
}
