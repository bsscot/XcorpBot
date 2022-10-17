const {SlashCommandBuilder} = require("@discordjs/builders");
const { Interaction, MessageEmbed } = require("discord.js");
const { User } = require("../utils/schemas");

module.exports.data = new SlashCommandBuilder()
.setName("register")
.setDescription("Check your or another user's balance")


module.exports.run = async (bot, Interaction) =>
{
    try {
          var CongratsWinner = bot.channels.cache.find(channel => channel.id === `1008178248888373288`);
      if(Interaction.channel.id != "1008178248888373288") return Interaction.editReply({content: `You can only use this command in ${CongratsWinner}`})
        const user = Interaction.member.user
        const userData = await User.findOne({ id: user.id }) || new User({id: user.id}) 
        userData.save()
        
        return Interaction.editReply({
            content: "You've been successfully registered!", ephemeral: true
        })
    }
    catch(err)
    {
        console.log(err)
    }

}