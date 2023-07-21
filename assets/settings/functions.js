import dotenv from 'dotenv';
import client from "./discordjssetup.js";

dotenv.config();

import {
    EmbedBuilder,
    ChannelType,
    PermissionFlagsBits,
    Colors,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    UserSelectMenuBuilder,
    RoleSelectMenuBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    Events,
    ButtonBuilder, MessageFlagsBitField, MessageFlags, hyperlink
} from "discord.js";
import answers from "./answers.js";
import help from "../slashCommands/SC__Help/setup.js";
import sendMsg from "../slashCommands/SC__SendMsg/setup.js";
import createCategory from "../slashCommands/SC__CreateCategory/setup.js";
import automod from "../slashCommands/SC__Automod/setup.js";
import {doc, setDoc} from "firebase/firestore";
import db, {getSS} from "./firebase.js";
import templates from "./templates.js";
import channels from "./channels.js";
import servers from "./servers.js";
import roles from "./roles.js";
import websites from "./websites.js";
import forumTags from "./forumTags.js";

const guildId = process.env.GUILD_ID;

class Functions {
    constructor() {
        this.client = client;
        this.guildId = guildId;
    }

    getCurrentFilePath() {
        try {
            return "/assets" + new Error().stack.split('\n')[2].trim().replace(/^at /, '').split("/assets")[1].split(".js")[0].concat(".js");
        } catch (e) {
            console.log(e);
        }
    }

    async createEmbeds(components) {
        const exampleEmbed = new EmbedBuilder()
            .setColor(components.color ? components.color : 0x0099FF)
            .setTitle(components.title ? components.title : 'Title');
        components.url && exampleEmbed.setURL(components.url);
        components.author && exampleEmbed.setAuthor(components.author);
        components.description && exampleEmbed.setDescription(components.description);
        components.thumbnail && exampleEmbed.setThumbnail(components.thumbnail);
        components.fields && exampleEmbed.addFields(components.fields);
        components.image && exampleEmbed.setImage(components.image);
        components.timestamp && exampleEmbed.setTimestamp(components.timestamp);
        components.footer && exampleEmbed.setFooter(components.footer);
        return [exampleEmbed];

    }

    async createModal (customId, title, components) {
        const modal = new ModalBuilder()
            .setCustomId(customId ? customId : "error")
            .setTitle(title ? title : "Error title");

        let myActionRows = []
        components.forEach(component => {
            const myInput = new TextInputBuilder()
                .setCustomId(component.customId ? component.customId : "error")
                .setLabel(component.label ? component.label : "Error label")
                .setPlaceholder(component.placeholder? component.placeholder : "")
                .setValue(component.value? component.value : "")
                .setStyle(component.style.toLowerCase() === "paragraph" ? TextInputStyle.Paragraph : TextInputStyle.Short)

            const myActionRow = new ActionRowBuilder().addComponents(myInput)

            myActionRows.push(myActionRow)

        })

        myActionRows.forEach(
            actionRow => modal.addComponents(actionRow)
        )

        return modal
    }

    async createButtons(components)  {

        const myActionRows = []
        components.forEach(component => {
            const button = new ButtonBuilder()
                .setCustomId(component.customId ? component.customId : "error")
                .setLabel(component.label ? component.label : "Error label")
                .setStyle(component.style)

            const row = new ActionRowBuilder().addComponents(button)

            myActionRows.push(row)
        })

        return myActionRows

    }

    async createSelectMenus(components) {
        const myActionRows = []

        components.forEach(component => {

            switch (component.type) {
                case "user":
                    myActionRows.push(
                        new ActionRowBuilder().addComponents(
                            new UserSelectMenuBuilder()
                                .setCustomId(component.customId ? component.customId : "error-users")
                                .setPlaceholder(component.placeholder ? component.placeholder : "Error placeholder")
                                .setMinValues(component.minValues ? component.minValues : 0)
                                .setMaxValues(component.maxValues ? component.maxValues : 10)
                        )
                    )
                    break;
                case "role":
                    myActionRows.push(
                        new ActionRowBuilder().addComponents(
                            new RoleSelectMenuBuilder()
                                .setCustomId(component.customId ? component.customId : "error-roles")
                                .setPlaceholder(component.placeholder ? component.placeholder : "Error placeholder")
                                .setMinValues(component.minValues ? component.minValues : 0)
                                .setMaxValues(component.maxValues ? component.maxValues : 10)
                        )
                    )

                    break;
                case "normal":

                    const select = new StringSelectMenuBuilder()
                        .setCustomId(component.customId ? component.customId : "error-normal")
                        .setPlaceholder(component.placeholder ? component.placeholder : "Error placeholder")

                    component.options.forEach(option => {

                        if (option.emoji) {
                            select.addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(option.label ? option.label : "Error label")
                                    .setDescription(option.description ? option.description : "Error description")
                                    .setEmoji(option.emoji ? option.emoji : "❌")
                                    .setDefault(option.default ? option.default : false)
                                    .setValue(option.value ? option.value : "Error value")
                            )
                        } else {
                            select.addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(option.label ? option.label : "Error label")
                                    .setDescription(option.description ? option.description : "Error description")
                                    .setDefault(option.default ? option.default : false)
                                    .setValue(option.value ? option.value : "Error value")
                            )
                        }
                    })

                    myActionRows.push(
                        new ActionRowBuilder().addComponents(select)
                    )
                    break;
                default:
                    console.log("error")
            }
        })

        return myActionRows
    }

    async sendMessageToChannel(channel, message = null, embeds = null, components = null, files = null) {
        return await client.guilds.cache.get(guildId)?.channels.cache.get(channel.id)?.send({
            content: message,
            embeds,
            components,
            files
        }).then(
            msg => {
                return msg;
            }
        );
    }

    async sendMessageToUser(user, message = null, embeds = null, components = null, files = null) {
        return await client.users.cache.get(user.id)?.send({
            content: message,
            embeds,
            components,
            files
        }).then(
            msg => {
                return msg;
            }
        );
    }

    async createCategory(name, interaction) {
        return await client.guilds.cache.get(guildId)?.channels.create({
            name: name,
            type: ChannelType.GuildCategory,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionFlagsBits.ViewChannel],
                }
            ],
        }).then(
            category => {
                return category;
            }
        );

    }

    async createRole(name, interaction) {
        return await interaction.guild.roles.create({
            name: 'Super Cool Blue People',
            color: Colors.Blue,
            reason: 'we needed a role for Super Cool People',
        }).then(
            role => {
                return role;
            }
        )
    }

    // get channel by id
    async getChannelById(id)  {
        return client.channels.cache.get(id)
    }

    async checkIfHasRole(member, roleId)  {
        try {
            return member.roles.cache.has(roleId)
        } catch (e) {
            console.log(answers.errorOccurred(e, 'checkIfHasRole').content)
        }
    }
    getMemberById(id)  {
        return client.guilds.cache.get(guildId).members.cache.get(id)
    }

    async editMessageInChannel (channelId, messageId, newMessage = null, newEmbeds = null, newComponents = null, newFiles = null )  {


        return client.guilds.cache.get(guildId).channels.cache.get(channelId).messages.cache.get(messageId).edit({
            content: newMessage,
            embeds: newEmbeds,
            components: newComponents,
            files: newFiles
        }).then(
            editedmsg => editedmsg
        )

    }

    async verifyUser(interaction) {
        const customId = interaction.customId;
        const targetUser = this.getMemberById(customId.split("_")[2])
        if (await this.checkIfHasRole(interaction.member, roles.ateam)) {

            await targetUser.roles.add(roles.member)
            await targetUser.roles.remove(roles.unverified)

            getSS("users").then(
                res => {
                    const users = res.users
                    const user = users.list.find(user => user.discordID === targetUser.id)
                    const userIndex = users.list.indexOf(user)


                    user.servers.find(server => server.name === servers.soutezeTryhard.name).verified = true
                    users.list[userIndex] = user

                    setDoc(doc(db, "ssbot", "users"), {users: users})

                    this.createEmbeds(templates.embeds.atextVerification.verified(user)).then(
                        embeds => {
                            this.editMessageInChannel(channels.atext,user.servers.find(server => server.name === servers.soutezeTryhard.name).atextMessageId,"", embeds, [] )
                            interaction.reply({content: "Uživatel byl úspěšně ověřen."})

                        }
                    )
                }
            )
        }
    }

    async mainInteractionListener(interaction) {
        if (interaction.isCommand()) {

            const { commandName } = interaction;

            switch (commandName) {
                case help.name: {
                    await help.execute(interaction);
                    break;
                }
                case sendMsg.name: {
                    await sendMsg.execute(interaction);
                    break;
                }
                case createCategory.name: {
                    await createCategory.execute(interaction);
                    break;
                }
                case automod.name: {
                    await automod.execute(interaction);
                    break;
                }
                default: {
                    await interaction.reply({content: "Unknown command", ephemeral: true});
                }
            }
        } else if (interaction.isButton()) {
            const customId = interaction.customId;

            if (customId.startsWith("verify_user_")) {
                await this.verifyUser(interaction)
            } else {
                interaction.reply({content: "Unknown button", ephemeral: true})
            }

        }

    }

    async memberJoinListener(member) {

        console.log("member joined")

        answers.welcomeMessage(member).then(
            msg => {
                this.sendMessageToUser(member, msg)
            }
        )

        this.createEmbeds(templates.embeds.atextVerification.unverified(member)).then(
            embeds => {
                this.createButtons([templates.buttons.verification.verify(member)]).then(
                    buttons => {
                        this.getChannelById(channels.atext).then(
                            channel => {
                                this.sendMessageToChannel(channel, ``, embeds, buttons).then(
                                    msg => {
                                        getSS("users").then(
                                            res => {
                                                function updateUserInServer(users, memberId, serverName, msgId) {
                                                    let myUser = users.list.find(user => user.discordID === memberId);

                                                    if (!myUser) {
                                                        myUser = {
                                                            discordID: memberId,
                                                            servers: []
                                                        };
                                                        users.list.push(myUser);
                                                    }

                                                    let myServer = myUser.servers.find(server => server.name === serverName);

                                                    if (!myServer) {
                                                        myServer = {
                                                            name: serverName,
                                                            joined: true,
                                                            verified: false,
                                                            atextMessageId: msgId
                                                        };
                                                        myUser.servers.push(myServer);
                                                    } else {
                                                        Object.assign(myServer, {
                                                            joined: true,
                                                            verified: false,
                                                            atextMessageId: msgId
                                                        });
                                                    }
                                                }

// Usage
                                                let users = res.users;

                                                updateUserInServer(users, member.id, servers.soutezeTryhard.name, msg.id);
                                                setDoc(doc(db, "ssbot", "users"), { users: users });
                                            }
                                        )
                                    }
                                )
                            }
                        )
                    }
                )
            }
        )
    }

    async memberLeaveListener(member) {
        getSS("users").then(
            res => {

                const users = res.users;

                // Find the user by their Discord ID
                const user = users.list.find(user => user.discordID === member.id);

                if (user) {
                    // Find the server within the user's servers array by name
                    const server = user.servers.find(server => server.name === servers.soutezeTryhard.name);

                    if (server) {
                        // Update the server properties
                        server.joined = false;
                        server.verified = false;
                    }
                }

                // Save the updated users object to the database
                setDoc(doc(db, "ssbot", "users"), { users });

                this.createEmbeds(templates.embeds.leaveServer.atextMessage(member)).then(
                    embeds => {
                        this.getChannelById(channels.atext).then(
                            channel => {
                                this.sendMessageToChannel(channel, ``, embeds)
                            }
                        )
                    }
                )
            }
        )
    }

    async messageCreateListener(message) {

        if (message.author.bot) return;
        this.getChannelById(channels.history).then(
            channel => {
                const myThread = channel.threads.cache.find(thread => thread.name === message.channel.name)
                if (myThread) {
                    myThread.send({
                        content: `## **[${message.author}]**   :incoming_envelope:   **[${message.channel}]**   :clock2:   **[${new Date(message.createdTimestamp).toLocaleString("cs-CZ")}]**\n> ${message.content}`,
                        files: message.attachments.map(attachment => attachment.url),
                    	allowedMentions: {parse: []	},
                        flags: MessageFlags.SuppressNotifications
                    })
                } else {
                    channel.threads.create({
                        name: message.channel.name,
                        autoArchiveDuration: 1440,
                        reason: "Historie kanálu",
                        startMessage: `# Historie kanálu ${message.channel} \n\n Toto je historie kanálu spravována Soutěže Tryhard Botem \n\n Tento kanál je vytvořen automaticky, a bude kopírovat všechny zprávy z kanálu ${message.channel} \n\n Tento kanál je vytvořen pro účely lepší moderace členů serveru.`,
                        message: `# Historie kanálu ${message.channel} \n\n Toto je historie kanálu spravována Soutěže Tryhard Botem \n\n Tento kanál je vytvořen automaticky, a bude kopírovat všechny zprávy z kanálu ${message.channel} \n\n Tento kanál je vytvořen pro účely lepší moderace členů serveru.`,

                    }).then(
                        thread => {
                            thread.send({
                                content: `## **[${message.author}]**   :incoming_envelope:   **[${message.channel}]**   :clock2:   **[${new Date(message.createdTimestamp).toLocaleString("cs-CZ")}]**\n> ${message.content}`,
                                files: message.attachments.map(attachment => attachment.url),
                                allowedMentions: {parse: []	},
                                flags: MessageFlags.SuppressNotifications
                            })
                        }
                    )
                }
            }
        )
    }

    async competitionListener(document) {
        const data = document.data()

        let allCompetitions = data.list.added
        let removedCompetitions = data.list.removed



        if (allCompetitions.some(competition => competition.postId === null)) {
            allCompetitions.forEach((competition, index) => {
                if (competition.postId === null) {
                    this.getChannelById(channels.soutěže).then(
                        channel => {
                            channel.threads.create({
                                name: competition.name,
                                autoArchiveDuration: 1440,
                                reason: "Vytvoření soutěže",
                                message: templates.messages.competitionPost(competition),
                            }).then(
                                thread => {

                                    competition.postId = thread.id
                                    allCompetitions[index] = competition

                                    const appliedTags = [];

                                    if (competition.registration.enabled) {
                                        appliedTags.push(forumTags.registrace);
                                    }

                                    if (competition.type === "soutěž") {
                                        appliedTags.push(forumTags.soutěž);
                                    }

                                    if (competition.type === "soustředění") {
                                        appliedTags.push(forumTags.soustředění);
                                    }

                                    if (competition.type === "seminář") {
                                        appliedTags.push(forumTags.seminář);
                                    }

                                    if (competition.type === "olympiáda") {
                                        appliedTags.push(forumTags.olympiáda);
                                    }

                                    if (competition.competition.dateType === "range") {
                                        appliedTags.push(forumTags.víceDní);
                                    }

                                    thread.setAppliedTags(appliedTags);


                                }
                            )
                        }
                    )
                }



            })
            setTimeout(
                () => {
                    console.log(allCompetitions)
                    setDoc(doc(db, "ssbot", "soutěže"), {list: {added: allCompetitions, removed: removedCompetitions}})

                }, 2000 )
        }






// Function to iterate through the components array
        const processComponentsArray = (componentsArray) => {
            let currentIndex = 0;

            const iterateComponents = () => {
                if (currentIndex >= componentsArray.length) {
                    // Stop the interval when all components have been processed
                    clearInterval(intervalId);
                    return;
                }

                const currentComponent = componentsArray[currentIndex];
                this.getChannelById(channels.soutěže).then(
                    channel => {
                        const myThread = channel.threads.cache.get(currentComponent.postId)
                        myThread.send(
                            {
                                content: "sorting",
                                flags: MessageFlags.SuppressNotifications
                            }
                        ).then(
                            message => {
                                setTimeout(
                                    () => {
                                        message.delete()
                                    }, 3000
                                )
                            }
                        )
                    })

                currentIndex++;
            }

            // Call iterateComponents initially and then every second (1000 milliseconds)
            const intervalId = setInterval(iterateComponents, 1000);
        }



// Call the function with your components array

        setTimeout(
            () => {

//


                const myCompetitions = data.list.added
                // sort all added competitions by date
                const myCompetitionsSorted = myCompetitions.sort((a, b) => {

                    const firstDate = a.competition.dateType === "single" ? a.competition.date.seconds : a.competition.date.from.seconds
                    const secondDate = b.competition.dateType === "single" ? b.competition.date.seconds : b.competition.date.from.seconds

                    return firstDate - secondDate
                }).reverse()
                processComponentsArray(myCompetitionsSorted)
            }, 15000
        )
    }
}

const functions = new Functions();
export default functions;
