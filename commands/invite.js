const {SlashCommandBuilder} = require("@discordjs/builders");
const { Interaction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { User } = require("../utils/schemas");
const { Invitesdb } = require("../utils/invites");

module.exports.data = new SlashCommandBuilder()
.setName("invite")
.setDescription("Create invite link")
// .addUserOption(
//     option => option
//     .setName("user")
//     .setDescription("User whose balance you want to check:")
// )

module.exports.run = async (bot, interaction) =>
{
    try
    {
    let user_of = interaction.member;
    if (!user_of.permissions.has("MANAGE_ROLES") && user_of.user.id != "303604936522989578" && user_of.user.id != "328719626525736971") return interaction.editReply({content: "You don't have the permission to use this command!", ephemeral: true})


    const raffleEmbed = new MessageEmbed()
    .setTitle("🧮 Invite contest!")
    .setDescription("Press one of the buttons below to interact with the invite contest")
    .setImage("https://media.discordapp.net/attachments/938527732751532153/1008182899989815327/PhotoRoom_20220813_211812.png")
    .setColor("BLUPLE")
    .addField("__Invite to Earn__", `Invite as many people as you can; each invite gets you 🪙 250 $XCORP and grants you a raffle ticket if an invite contest is running`)
    .addField("__How to Invite__", `1️⃣ Press the green button to generate your unique invite link.\n2️⃣ Share this link with people and start earning!`)
    const row = new MessageActionRow()
    .addComponents(
    [
        new MessageButton()
        .setLabel("Generate your custom link")
        .setStyle("SUCCESS")
        .setCustomId(`invite-Link-2-3`)
        .setEmoji("🔗"),

        new MessageButton()
        .setLabel("Track your invites")
        .setStyle("PRIMARY")
        .setCustomId(`invite-check-2-3`)
        .setEmoji("🔢")
    ]
    )

    return interaction.editReply(
    {
        embeds: [ raffleEmbed ], components: [row], ephemeral: false
    }
    )
    }
    catch(err)
    {
        console.log(err)
    }
}

module.exports.button = async (bot, interaction, user, action, another_user) => {
    try{
    if (user == "Link")
    {
        const user_data_one = await User.findOne({ id: interaction.member.user.id }) || new User({ id: interaction.member.user.id })

        if (user_data_one.inv_code == "" || user_data_one.inv_code === undefined || user_data_one.inv_code === null)
        {
            var CongratsWinner = bot.channels.cache.find(channel => channel.id === `987626625011163186`);
            CongratsWinner.createInvite({ maxAge: 0, maxUses: 0, unique: true })
            .then(async invite => {
                user_data_one.inv_code = `${invite.code}`
                user_data_one.markModified('inv_code')
                const inv_data_one = await new Invitesdb({ cd: `${invite.code}`})
                inv_data_one.inviter = `${interaction.member.user.id}`
                user_data_one.save()
                inv_data_one.save()
                //console.log(invite.code)
                return interaction.editReply(
                    {
                        content: `https://discord.gg/${user_data_one.inv_code}`, ephemeral: true
                    }
                    )
            })

        }
            //console.log(`${interaction.member.user.id}`)
            try
            {
                const inv_data_three = await Invitesdb.findOne({ cd: `${user_data_one.inv_code}`})
                if(inv_data_three != null)
                {
                    inv_data_three.inviter = `${interaction.member.user.id}`
                    inv_data_three.save()
                }
            }
            catch(err)
            {
                console.log(err)
            }
        return interaction.editReply(
            {
                content: `https://discord.gg/${user_data_one.inv_code}`, ephemeral: true
            }
            )
    }
    else if (user == "check")
    {
        const user_data_two = await User.findOne({ id: interaction.member.user.id }) || new User({ id: interaction.member.user.id })
        if (user_data_two.inv_code != "" && user_data_two.inv_code !== undefined )
        {
            const inv_data_two = await Invitesdb.findOne({ cd: `${user_data_two.inv_code}`}) || new Invitesdb({ cd: `${user_data_two.inv_code}`})
            var change = false

            var invite_embed = new MessageEmbed()
            .setTitle("🧑‍🤝‍🧑 Your current invites:")
            .setDescription("Below is all the current people you invited and have been verified in the server:")
            .setColor("BLACK")
            //console.log(inv_data.invited)
            for (var i = 0; (inv_data_two.invited.length) > i; i++)
            {
                //console.log(!((inv_data.added).includes(`${inv_data.invited[i]}`)))
                if(inv_data_two.invited.length != 0)
                {
                    if (!inv_data_two.added.includes(`${inv_data_two.invited[i]}`))
                    {
                        try
                        {
                        // let role = interaction.guild.roles.cache.find(r => r.name === 'Brewer');
                        // let guild = interaction.guild
                        // var member = await guild.members.cache.get(`${inv_data_two.invited[i]}`);
                        // var check = await member.roles.cache.has(role.id)
                        // if (check == true)
                        // {
                            //console.log("has the role")
                            inv_data_two.added.push(`${inv_data_two.invited[i]}`)
                            user_data_two.wallet += 250
                            user_data_two.markModified('wallet')
                            inv_data_two.markModified('added')
                            change = true
                            
                        }
                        catch(err)
                        {
                            console.log(err)
                        }
                        // }
                        //console.log("we're in should get extra")
                    } 
                }
            }
            if (change == true)
            {
                inv_data_two.save()
                user_data_two.save()
            }

            if( inv_data_two.added.length != 0)
            {  
                var count = 0
                for (var k = 0; k < (inv_data_two.added.length); k++)
                {
                    // let guild = interaction.guild
                    // var user_det = await bot.users.fetch(`${inv_data_two.added[k].toString()}`)
                    count++;
                }
                invite_embed.addField(`**Number of invites**`, `${count}`)
            }

          
            return interaction.editReply(
                {
                    embeds: [invite_embed], ephemeral: true
                }
                )
        }
        else 
        {
            return interaction.editReply(
                {
                    content: `Please click the "generate your custom link" button first before checking how many users you've invited`, ephemeral: true
                }
                )
        }
    }
    }
    catch(err)
    {
        console.log(err)
    }
}