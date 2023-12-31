import roles from "../roles.js";
import answers from "../answers.js";
import templates from "../templates.js";
import {categories, channels} from "../channels.js";
import db, {getSS} from "../firebase.js";
import servers from "../servers.js";
import {doc, setDoc} from "firebase/firestore";
import history from "../history.js";
import {ChannelType, MessageFlags, PermissionFlagsBits} from "discord.js";
import forumTags from "../forumTags.js";
import client from "../discordjssetup.js";
import functions from "../functions.js";

import dotenv from 'dotenv';
dotenv.config();
const guildId = process.env.GUILD_ID;
import {ChatGPT} from "../chatgpt.js";

export default class ListenerFunctions {
    async memberJoinListener(member) {

        if (member.user.bot) return

        functions.user.assignRoleToUser(member, roles.unverified)

        answers.welcomeMessage(member).then(
            msg => {
                functions.create.sendMessageToUser(member, msg)
            }
        )

        functions.create.createEmbeds(templates.embeds.atextVerification.unverified(member)).then(
            embeds => {
                functions.create.createButtons([templates.buttons.verification.verify(member), templates.buttons.punishment.ban(member.user),templates.buttons.punishment.kick(member.user) ]).then(
                    buttons => {
                        functions.get.getChannelById(channels.atext).then(
                            channel => {
                                functions.create.sendMessageToChannel(channel, ``, embeds, [buttons]).then(
                                    msg => {
                                        getSS(["users"]).then(
                                            res => {
                                                function updateUserInServer(users, serverName, msgId) {
                                                    let myUser = users.list.find(user => user.discordID === member.id);

                                                    if (!myUser) {
                                                        myUser = {
                                                            discordID: member.id,
                                                            discordUsername: member.user.username,
                                                            discordAvatar: member.user.avatar,
                                                            discordDiscriminator: member.user.discriminator,
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
                                                let users = res["users"];

                                                updateUserInServer(users, servers.soutezeTryhard.name, msg.id);
                                                setDoc(doc(db, "ssbot", "users"), users);
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
        getSS(["users"]).then(
            res => {

                const users = res["users"];

                // Find the user by their Discord ID
                const user = users.list.find(user => user.discordID === member.id);

                if (user) {
                    // Find the server within the user's servers array by name
                    const server = user.servers.find(server => server.name === servers.soutezeTryhard.name);

                    if (server) {
                        // Update the server properties
                        server.joined = false;
                        server.verified = false;

                        functions.create.createEmbeds(templates.embeds.atextVerification.alreadyLeft(member)).then(
                            embeds => {

                                server.atextMessageId && functions.edit.editMessageInChannel(channels.atext, server.atextMessageId, "", embeds, [])
                            }
                        )
                    }
                }

                // Save the updated users object to the database
                setDoc(doc(db, "ssbot",     "users"),  users );

                functions.create.createEmbeds(templates.embeds.leaveServer.atextMessage(member)).then(
                    embeds => {
                        functions.get.getChannelById(channels.atext).then(
                            channel => {
                                functions.create.sendMessageToChannel(channel, ``, embeds)
                            }
                        )
                    }
                )
            }
        )
    }

    async messageCreateListener(message) {

        if (message.author.bot) return;

        if (message.channel.id === channels.npctalk) {
            message.channel.sendTyping()
            const res = await ChatGPT(`Jsi discord assistent, který bude pomáhat lidem na našem discord serveru. Náš server je přátelská komunita lidí, kteří se navzájem baví při hraní různých her či jiných aktivitách. Ownerem našeho serveru je ${functions.get.getMemberById("701509602814066909")} a admini jsou Donkey Monroe a Big Jack. Ti co na tomto serveru mají větší moc tedy owner a admini se nazývají A-Team. Server má celkem 50 členů a vznikl 25.6. 2021. Na tomto serveru je nutné být verifikován A-Teamem. Když je člen verifikován má plný přístup k serveru. Na našem serveru také probíhají každý týden ve středu v 19:00 eventy a více informací lidé mohou zjistit v #eventy-info. Také je na našem server žebříček všech verifikovaných členů v #leaderboard. Naše virtuální měna se nazývá ss coin a lidé si za ní v shopu mohou kupovat různé itemy.  Web našeho discord serveru je https://survivalserver.cz. Nepiš blbosti, piš jen to co víš. Nepiš nic o tom jak bys odpověděl na otázky. Jen odpověz na otázku. Pokud nebude otázka dávat smysl a nebo nebudeš moci odpovědět pomocí dat co jsem ti poskytl, odpověz že na tuto otázku zatím neznáš odpověď. Nepiš jak odpovídáš na otázky. Když nevíš co napsat tak místo psaní věcí na které se nikdo neptal napiš že nevíš. Pokud budeš psát blbosti, budeš z toho mít problémy. Pokud budeš psát blbosti, budeš z toho mít problémy. Odpovídej pouze na otázky, které přímo souvisí s naším serverem. Toto je otázka na kterou se tě zeptal člen našeho serveru, který potřebuje pomoc týkající se našeho serveru ${message.content}.`)
            // const res = await ChatGpt(message.content)
            message.reply(res.response)
            console.log(functions.get.findMostRelevantSource(message.content))

        }

        if (message.channel.id === channels.info) {
            functions.get.getChannelById(channels.atext).then(
                channel => {
                    answers.newInformation(message).then(
                        msg => {
                            channel.send(msg)
                        }
                    )
                }
            )
        }



        if (history.allowedChannels.includes(message.channel.id)) {
            functions.get.getChannelById(channels.history).then(
                channel => {
                    const myThread = channel.threads.cache.find(thread => thread.name === message.channel.name)
                    if (myThread) {
                        myThread.send({
                            content: templates.messages.history.newMessage(message),
                            files: message.attachments.map(attachment => attachment.url),
                            allowedMentions: {parse: []	},
                            flags: MessageFlags.SuppressNotifications
                        })
                    } else {
                        channel.threads.create({
                            name: message.channel.name,
                            autoArchiveDuration: 1440,
                            reason: "Historie kanálu",
                            message: templates.messages.history.newChannel(message.channel),
                        }).then(
                            thread => {

                                const appliedTags = [];

                                if (message.channel.parent.id === categories["text-channels"]) {
                                    appliedTags.push(forumTags.history["text-channels"]);
                                }

                                thread.setAppliedTags(appliedTags);

                                thread.send({
                                    content: templates.messages.history.newMessage(message),
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


    }



    async competitionListener(document) {

        const data = document.data()

        let allCompetitions = data.list.added
        let removedCompetitions = data.list.removed

        removedCompetitions.forEach(
            competition => {
                functions.get.getChannelById(channels.soutěže).then(
                    channel => {
                        try {
                            channel.threads.cache.get(competition.postId).delete()
                        } catch (e) {}


                    }
                )
                try {
                    console.log(competition.categoryId)
                    client.guilds.cache.get(guildId).channels.cache.get(competition.categoryId).delete()
                } catch (e) {}
                try {
                    console.log(competition.chatChannelId)
                    client.guilds.cache.get(guildId).channels.cache.get(competition.chatChannelId).delete()
                } catch (e) {}
                try {
                    console.log(    competition.announcmentChannelId)
                    client.guilds.cache.get(guildId).channels.cache.get(competition.announcmentChannelId).delete()
                } catch (e) {}
                try {
                    console.log(competition.roleId)
                    client.guilds.cache.get(guildId).roles.cache.get(competition.roleId).delete()
                } catch (e) {}
            }
        )


        if (allCompetitions.some(competition => competition.postId === null)) {
            for (const competition of allCompetitions) {
                // get index of current competition
                const index = allCompetitions.indexOf(competition);
                if (competition.postId === null) {
                    // creating discord channels
                    if (competition.createChannel) {
                        await functions.create.createRole(competition.name, client.guilds.cache.get(guildId)).then(
                            async (role) => {
                                if (competition.users) {
                                    for (const user in competition.users?.length > 0) {
                                        await functions.user.assignRoleToUser(functions.get.getMemberById(user.discordID), role.id)
                                    }
                                }


                                await functions.create.createCategory(competition.name, [
                                    {
                                        id: client.guilds.cache.get(guildId).roles.everyone.id,
                                        deny: [PermissionFlagsBits.ViewChannel],
                                    },
                                    {
                                        id: role.id,
                                        allow: [PermissionFlagsBits.ViewChannel],
                                    }
                                ], 3).then(
                                    async (category) => {
                                        await functions.create.createChannel("📣┃info", ChannelType.NewsChannel, category.id, []).then(
                                            async (announcmentChannel) => {
                                                await functions.create.createChannel("🎓┃diskuse", ChannelType.TextChannel, category.id, []).then(
                                                    async (chatChannel) => {
                                                        await functions.get.getChannelById(channels.soutěže).then(
                                                            async (channel) => {
                                                                await channel.threads.create({
                                                                    name: competition.name,
                                                                    autoArchiveDuration: 1440,
                                                                    reason: "Vytvoření události",
                                                                    message: templates.messages.competitionPost(competition, chatChannel, announcmentChannel, role),
                                                                }).then(
                                                                    thread => {

                                                                        competition.postId = thread.id
                                                                        competition.announcmentChannelId = announcmentChannel.id
                                                                        competition.chatChannelId = chatChannel.id
                                                                        competition.categoryId = category.id
                                                                        competition.roleId = role.id
                                                                        allCompetitions[index] = competition

                                                                        // const appliedTags = [];
                                                                        //
                                                                        // if (competition.miles.find((mile) => mile.name === "registration")) {
                                                                        //     appliedTags.push(forumTags.competitions.registrace);
                                                                        // }
                                                                        // if (competition.type === "vícekolová soutěž") {
                                                                        //     appliedTags.push(forumTags.competitions["vícekolová soutěž"]);
                                                                        // }
                                                                        //
                                                                        // if (competition.type === "jednokolová soutěž") {
                                                                        //     appliedTags.push(forumTags.competitions["jednokolová soutěž"]);
                                                                        // }
                                                                        //
                                                                        // if (competition.competition.dateType === "range") {
                                                                        //     appliedTags.push(forumTags.competitions.víceDní);
                                                                        // }

                                                                        // thread.setAppliedTags(appliedTags);



                                                                        announcmentChannel.send(templates.messages.competitionAnnouncment(competition, chatChannel, announcmentChannel, thread))


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
                        )
                    } else {
                        await functions.get.getChannelById(channels.soutěže).then(
                            async (channel) => {
                                await channel.threads.create({
                                    name: competition.name,
                                    autoArchiveDuration: 1440,
                                    reason: "Vytvoření události",
                                    message: templates.messages.competitionPost(competition, null, null, null),
                                }).then(
                                     (thread) => {

                                        console.log(thread.name)
                                        console.log(thread.id)

                                        competition.postId = thread.id
                                        allCompetitions[index] = competition

                                        const appliedTags = [];

                                        try {
                                            if (competition.registration.enabled) {
                                                appliedTags.push(forumTags.competitions.registrace);
                                            }

                                            if (competition.type === "vícekolová soutěž") {
                                                appliedTags.push(forumTags.competitions["vícekolová soutěž"]);
                                            }

                                            if (competition.type === "jednokolová soutěž") {
                                                appliedTags.push(forumTags.competitions["jednokolová soutěž"]);
                                            }

                                            if (competition.competition.dateType === "range") {
                                                appliedTags.push(forumTags.competitions.víceDní);
                                            }

                                            thread.setAppliedTags(appliedTags);
                                        } catch (e) {

                                        }


                                    }
                                )
                            }
                        )
                    }


                }
            }

            console.log(allCompetitions)
            await setDoc(doc(db, "ssbot", "soutěže"), {list: {added: allCompetitions, removed: removedCompetitions}})

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
                functions.get.getChannelById(channels.soutěže).then(
                    channel => {
                        const myThread = channel.threads.cache.get(currentComponent.postId)
                        console.log(myThread.name)
                        console.log(myThread.appliedTags)
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

    informationListener(document) {
        const data = document.data()

        let allInformations = data.list

        if (allInformations.some(information => information.messageId === null)) {
            allInformations.forEach((information, index) => {
                if (information.messageId === null) {
                    functions.get.getChannelById(channels.info).then(
                        channel => {

                            functions.user.impersonateUserInChannel(information.author.discordUsername, information.author.discordAvatar, information.value.content, channel).then(
                                msg => {
                                    information.messageId = msg.id
                                    allInformations[index] = information
                                }
                            )

                        }
                    )
                }
            })
            setTimeout(
                () => {
                    setDoc(doc(db, "ssbot", "informations"), {list: allInformations})
                }, 2000
            )
        }
    }
}