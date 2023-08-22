import templates from "../templates.js";
import {channels} from "../channels.js";
import functions from "../functions.js";

export default class PunishmentFunctions {
    kickUser(user, reason, interaction) {
        functions.messageComponents.createEmbeds(templates.embeds.kickedFromServer.atextMessage(user, reason)).then(embeds => {
            functions.getChannelById(channels.atext).then(channel => {
                channel.send({embeds: embeds})
            })
        })
        functions.messageComponents.createEmbeds(templates.embeds.kickedFromServer.announcementMessage(user, reason)).then(embeds => {
            functions.getChannelById(channels.info).then(channel => {
                channel.send({embeds: embeds}).then(
                    msg => {
                        functions.addInformation({
                            author: functions.reformateUser(msg.author),
                            messageId: msg.id,
                            time: msg.createdTimestamp,
                            type: "punishment",
                            value: {
                                type: "kick",
                                user: functions.reformateUser(user),
                                reason: reason,
                            }
                        })
                    }
                )
            })
        })
        functions.messageComponents.createEmbeds(templates.embeds.kickedFromServer.toUser(user, reason)).then(embeds => {
            user.send({embeds: embeds})
        })
        interaction.guild.members.kick(user, reason).then(() => {

            console.log("kick");

        })
    }
    banUser(user, reason, interaction, banSeconds) {
        functions.messageComponents.createEmbeds(templates.embeds.bannedFromServer.atextMessage(user, reason)).then(embeds => {
            functions.getChannelById(channels.atext).then(channel => {
                channel.send({embeds: embeds})
            })
        })
        functions.messageComponents.createEmbeds(templates.embeds.bannedFromServer.announcementMessage(user, reason)).then(embeds => {
            functions.getChannelById(channels.info).then(channel => {
                channel.send({embeds: embeds}).then(
                    msg => {
                        functions.addInformation({
                            author: functions.reformateUser(msg.author),
                            messageId: msg.id,
                            time: msg.createdTimestamp,
                            type: "punishment",
                            value: {
                                type: "ban",
                                user: functions.reformateUser(user),
                                reason: reason,
                            }
                        })
                    }
                )
            })
        })
        functions.messageComponents.createEmbeds(templates.embeds.bannedFromServer.toUser(user, reason)).then(embeds => {
            user.send({embeds: embeds})
        })


        interaction.guild.members.ban(user, {reason: reason, deleteMessageSeconds: banSeconds}).then(() => {
            console.log("banned");
        })
    }
}