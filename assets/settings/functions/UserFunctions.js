import templates from "../templates.js";
import {channels} from "../channels.js";
import functions from "../functions.js";
import roles from "../roles.js";
import db, {getSS} from "../firebase.js";
import servers from "../servers.js";
import {doc, setDoc} from "firebase/firestore";

export default class UserFunctions {
    kickUser(user, reason, interaction) {
        functions.create.createEmbeds(templates.embeds.kickedFromServer.atextMessage(user, reason)).then(embeds => {
            functions.get.getChannelById(channels.atext).then(channel => {
                channel.send({embeds: embeds})
            })
        })
        functions.create.createEmbeds(templates.embeds.kickedFromServer.announcementMessage(user, reason)).then(embeds => {
            functions.get.getChannelById(channels.info).then(channel => {
                channel.send({embeds: embeds}).then(
                    msg => {
                        functions.create.addInformation({
                            author: functions.user.reformateUser(msg.author),
                            messageId: msg.id,
                            time: msg.createdTimestamp,
                            type: "punishment",
                            value: {
                                type: "kick",
                                user: functions.user.reformateUser(user),
                                reason: reason,
                            }
                        })
                    }
                )
            })
        })
        functions.create.createEmbeds(templates.embeds.kickedFromServer.toUser(user, reason)).then(embeds => {
            user.send({embeds: embeds})
        })
        interaction.guild.members.kick(user, reason).then(() => {

            console.log("kick");

        })
    }
    banUser(user, reason, interaction, banSeconds) {
        functions.create.createEmbeds(templates.embeds.bannedFromServer.atextMessage(user, reason)).then(embeds => {
            functions.get.getChannelById(channels.atext).then(channel => {
                channel.send({embeds: embeds})
            })
        })
        functions.create.createEmbeds(templates.embeds.bannedFromServer.announcementMessage(user, reason)).then(embeds => {
            functions.get.getChannelById(channels.info).then(channel => {
                channel.send({embeds: embeds}).then(
                    msg => {
                        functions.create.addInformation({
                            author: functions.user.reformateUser(msg.author),
                            messageId: msg.id,
                            time: msg.createdTimestamp,
                            type: "punishment",
                            value: {
                                type: "ban",
                                user: functions.user.reformateUser(user),
                                reason: reason,
                            }
                        })
                    }
                )
            })
        })
        functions.create.createEmbeds(templates.embeds.bannedFromServer.toUser(user, reason)).then(embeds => {
            user.send({embeds: embeds})
        })


        interaction.guild.members.ban(user, {reason: reason, deleteMessageSeconds: banSeconds}).then(() => {
            console.log("banned");
        })
    }

    muteUser(user, reason, interaction, time) {
        functions.create.createEmbeds(templates.embeds.muted.atextMessage(user, reason, time)).then(embeds => {
            functions.get.getChannelById(channels.atext).then(channel => {
                channel.send({embeds: embeds})
            })
        })
        functions.create.createEmbeds(templates.embeds.muted.announcementMessage(user, reason, time)).then(embeds => {
            functions.get.getChannelById(channels.info).then(channel => {
                channel.send({embeds: embeds}).then(
                    msg => {
                        functions.create.addInformation({
                            author: functions.user.reformateUser(msg.author),
                            messageId: msg.id,
                            time: msg.createdTimestamp,
                            type: "punishment",
                            value: {
                                type: "mute",
                                user: functions.user.reformateUser(user),
                                time: time,
                                reason: reason,
                            }
                        })
                    }
                )
            })
        })
        functions.create.createEmbeds(templates.embeds.muted.toUser(user, reason, time)).then(embeds => {
            user.send({embeds: embeds})
        })


        console.log(time)


        this.assignRoleToUser(functions.get.getMemberById(user.id), roles.muted).then(() => {
            this.removeRoleFromUser(functions.get.getMemberById(user.id), roles.member).then(() => {
                setTimeout(() => {
                    this.unMuteUser(user)
                }, time * 1000 * 60)
            })

        })

    }

    showUserInformation(user, interaction) {
        functions.create.createEmbeds(templates.embeds.userInformations(user)).then(
            embeds => interaction.reply({
                embeds: embeds,
                ephemeral: true
            })
        )
    }

    unMuteUser(user) {
        functions.create.createEmbeds(templates.embeds.unmuted.atextMessage(user)).then(embeds => {
            functions.get.getChannelById(channels.atext).then(channel => {
                channel.send({embeds: embeds})
            })
        })
        this.removeRoleFromUser(functions.get.getMemberById(user.id), roles.muted).then(() => {
            this.assignRoleToUser(functions.get.getMemberById(user.id), roles.member).then(() => {
                functions.create.createEmbeds(templates.embeds.unmuted.toUser()).then(embeds => {
                    user.send({embeds: embeds})
                })
            })
        })

    }

    reformateUser(user) {
        return {
            discordID: user.id,
            discordUsername: user.username,
            discordAvatar: user.avatar,
            discordDiscriminator: user.discriminator,
        }
    }

    async verifyUser(interaction) {
        const customId = interaction.customId;
        const targetUser = functions.get.getMemberById(customId.split("_")[2])
        if (await functions.control.checkIfHasRole(interaction.member, roles.ateam)) {

            await targetUser.roles.add(roles.member)
            await targetUser.roles.remove(roles.unverified)

            getSS(["users"]).then(
                res => {
                    const users = res["users"].users
                    const user = users.list.find(user => user.discordID === targetUser.id)
                    const userIndex = users.list.indexOf(user)


                    user.servers.find(server => server.name === servers.soutezeTryhard.name).verified = true
                    users.list[userIndex] = user

                    setDoc(doc(db, "ssbot", "users"), {users: users})

                    functions.create.createEmbeds(templates.embeds.atextVerification.verified(user)).then(
                        embeds => {
                            functions.edit.editMessageInChannel(channels.atext,user.servers.find(server => server.name === servers.soutezeTryhard.name).atextMessageId,"", embeds, [] )

                        }
                    )
                }
            )
        }
    }

    async impersonateUserInChannel(name, avatarUrl, message, channel) {
        return channel.createWebhook({
            name: name,
            avatar: avatarUrl,
        }).then(
            webhook => {
                return webhook.send(message).then(
                    msg => {
                        setTimeout(
                            () => {
                                webhook.delete()
                            }, 3000
                        )
                        return msg
                    }
                )

            }
        )
    }

    updateUsers() {
        getSS(["users"]).then(
            res => {
                let users = res["users"].users
                let changed = false

                users.list.forEach(
                    (user, index) => {
                        if (!user?.servers?.find((server) => server?.name === "Soutěže Tryhard").verified) return
                        const userOnServer = functions.get.getMemberById(user.discordID)

                        if (userOnServer) {
                            if (userOnServer.user.username !== user.discordUsername) {
                                user.discordUsername = userOnServer.user.username
                                users.list[index] = user
                                changed = true
                            }
                            if (userOnServer.user.discriminator !== user.discordDiscriminator) {
                                user.discordDiscriminator = userOnServer.user.discriminator
                                users.list[index] = user
                                changed = true
                            }
                            if (userOnServer.user.avatar !== user.discordAvatar) {
                                user.discordAvatar = userOnServer.user.avatar
                                users.list[index] = user
                                changed = true
                            }
                        }
                    }
                )

                if (changed) {
                    setDoc(doc(db, "ssbot", "users"), {users: users})
                    console.log("users updated")
                }

            }
        )
    }

    assignRoleToUser(user, role) {
        return user.roles.add(role)
    }

    removeRoleFromUser(user, role) {
        return user.roles.remove(role)
    }
}