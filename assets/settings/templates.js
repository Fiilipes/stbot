import {bold, ButtonStyle, Colors, hyperlink} from "discord.js";
import roles from "./roles.js";
import client from "./discordjssetup.js";
import functions from "./functions.js";
import websites from "./websites.js";
import servers from "./servers.js";
import images from "./images.js";

const templates = {
    "messages": {
      	"competitionPost": competition =>
`
# ${competition.name}
*${competition.type}*

${competition.registration.enabled ? `- Datum registrace: **<t:${competition.registration.date.seconds}:D>**` : ""}
- Datum soutěže: ${competition.competition.dateType === "single" ? `**<t:${competition.competition.date.seconds}>** | **<t:${competition.competition.date.seconds}:D>**` : `**<t:${competition.competition.date.from.seconds}>** | **<t:${competition.competition.date.from.seconds}:D>** - **<t:${competition.competition.date.to.seconds}:D>**`}
- Místo konání: **${competition.place}**
- Bližší informace: **${competition.description}**
${competition.users.length > 0 ? `- Účastníci: **${competition.users.map(
    user => ` <@${user.id}>`
)}**` : "Nikdo se neúčastní"}
- Web: **${hyperlink("survivalserver.cz/soutezetryhard/udalosti/" + competition.name.replace(/ /g, ""), websites.survivalServer + "/soutezetryhard/udalosti/" + competition.name.toLowerCase().replace(/ /g, ""))}**
`,


        "userInformations": targetUser => `Username: ${targetUser.username}\nID: ${targetUser.id}`,
        "history": {
              "newChannel": channel => `# Historie kanálu ${channel} \n\n Toto je historie kanálu spravována Soutěže Tryhard Botem \n\n Tento kanál je vytvořen automaticky, a bude kopírovat všechny zprávy z kanálu ${channel} \n\n Tento kanál je vytvořen pro účely lepší moderace členů serveru.`,
              "newMessage": message => `## **[${message.author}]**   :incoming_envelope:   **[${message.channel}]**   :clock2:   **[${new Date(message.createdTimestamp).toLocaleString("cs-CZ")}]**\n> ${message.content}`
        }

    },
    "embeds": {
        "atextVerification": {
            "unverified": (member) => ( {
                title: "Nový člen serveru",
                description: `${member} se připojil na server!`,
                color: Colors.Blurple,
                thumbnail: member.user.displayAvatarURL(),
                fields: [
                    {
                        name: "Status",
                        value: `<@&${roles.unverified}>`,
                    }
                ],
                timestamp: new Date(),
                footer: {
                    text: client.user.username,
                    iconURL: client.user.avatarURL(),
                }

            }),
            "verified": (user) => ( {
                title: "Nový člen serveru",
                description: `${functions.getMemberById(user.discordID)} je nyní ověřený!`,
                color: Colors.Green,
                thumbnail: functions.getMemberById(user.discordID).displayAvatarURL(),
                fields: [
                    {
                        name: "Status",
                        value: `<@&${roles.member}>`,
                    }
                ],
                timestamp: new Date(),
                footer: {
                    text: client.user.username,
                    iconURL: client.user.avatarURL(),
                }

            } ),
            "alreadyLeft": (member) => ({
                title: "Nový člen serveru",
                description: `${member.displayName} se přpojil na server ale po nějaké době už jej opustil!`,
                color: Colors.Red,
                thumbnail: member.user.displayAvatarURL(),
                fields: [
                    {
                        name: "Status",
                        value: `left`,
                    }
                ],
                timestamp: new Date(),
                footer: {
                    text: client.user.username,
                    iconURL: client.user.avatarURL(),
                }
            })


        },
        "leaveServer": {
            "atextMessage": (member) => ( {
                title: "Člen opustil server",
                description: `${member.displayName} opustil server!`,
                color: Colors.Blurple,
                thumbnail: member.user.displayAvatarURL(),
                timestamp: new Date(),
                footer: {
                    text: client.user.username,
                    iconURL: client.user.avatarURL(),
                }

            } )
        },
        "userInformations": (targetUser) => ({
            title: "User informations",
            description: `Username: **${targetUser.username}**\nID: **${targetUser.id}**`,
            color: Colors.Blurple,
            thumbnail: targetUser.displayAvatarURL(),
            timestamp: new Date(),
            footer: {
                text: client.user.username,
                iconURL: client.user.avatarURL(),
            }
        }),
        "bannedFromServer": {
            "atextMessage": (member, reason) => ( {
                title: "Člen byl zabanován",
                description: `${member.username} byl zabanován z důvodu: ${reason}`,
                color: Colors.Red,
                thumbnail: member.displayAvatarURL(),
                timestamp: new Date(),
                footer: {
                    text: client.user.username,
                    iconURL: client.user.avatarURL(),
                }
            }),
            "announcementMessage": (member, reason) => ( {
                title: "Člen byl zabanován",
                description: `${member.username} byl zabanován z důvodu: ${reason}`,
                color: Colors.Red,
                thumbnail: member.displayAvatarURL(),
                timestamp: new Date(),
                footer: {
                    text: client.user.username,
                    iconURL: client.user.avatarURL(),
                }
            }),
            "toUser": (member, reason) => ( {
                title: "Byl jsi zabanován ze serveru " + bold(servers.soutezeTryhard),
                description: `Byl jsi zabanován z důvodu: ${reason}\n- Pokud si myslíš, že si dostal ban neprávem, obrať se na **A-team**`,
                color: Colors.Red,
                thumbnail: images.banned,
                timestamp: new Date(),
                footer: {
                    text: client.user.username,
                    iconURL: client.user.avatarURL(),
                }
            })
        },
        "kickedFromServer": {
            "atextMessage": (member, reason) => ( {
                title: "Člen byl vyhozen",
                description: `${member.username} byl vyhozen z důvodu: ${reason}`,
                color: Colors.Red,
                thumbnail: member.displayAvatarURL(),
                timestamp: new Date(),
                footer: {
                    text: client.user.username,
                    iconURL: client.user.avatarURL(),
                }
            }),
            "announcementMessage": (member, reason) => ( {
                title: "Člen byl vyhozen",
                description: `${member.username} byl vyhozen z důvodu: ${reason}`,
                color: Colors.Red,
                thumbnail: member.displayAvatarURL(),
                timestamp: new Date(),
                footer: {
                    text: client.user.username,
                    iconURL: client.user.avatarURL(),
                }
            }),
            "toUser": (member, reason) => ( {
                title: "Byl jsi vyhozen ze serveru " + bold(servers.soutezeTryhard),
                description: `Byl jsi vyhozen z důvodu: ${reason}\n- Pokud si myslíš, že si dostal kick neprávem, obrať se na **A-team**`,
                color: Colors.Red,
                thumbnail: images.kicked,
                timestamp: new Date(),
                footer: {
                    text: client.user.username,
                    iconURL: client.user.avatarURL(),
                }
            } )
        },
        "muted": {
            "atextMessage": (member, reason, time) => ( {
                title: "Člen byl ztlumen",
                description: `${member} byl ztlumen z důvodu: **${reason}** na dobu **${time}** minut.\n Po uplynutí doby mu bude mute automaticky zrušen.`,
                color: Colors.DarkVividPink,
                thumbnail: member.user.displayAvatarURL(),
                timestamp: new Date(),
                footer: {
                    text: client.user.username,
                    iconURL: client.user.avatarURL(),
                }
            } ),
            "announcementMessage": (member, reason, time) => ( {
                title: "Člen byl ztlumen",
                description: `${member} byl ztlumen z důvodu: **${reason}** na dobu **${time}** minut.`,
                color: Colors.DarkVividPink,
                thumbnail: member.user.displayAvatarURL(),
                timestamp: new Date(),
                footer: {
                    text: client.user.username,
                    iconURL: client.user.avatarURL(),
                }
            } ),
            "toUser": (member, reason, time) => ( {
                title: "Byl jsi ztlumen na serveru " + bold(servers.soutezeTryhard),
                description: `Byl jsi ztlumen z důvodu: **${reason}** na dobu **${time}** minut.\n Po uplynutí doby ti bude mute automaticky zrušen. \nPokud si myslíš, že si dostal mute neprávem, obrať se na **A-team**`,
                color: Colors.DarkVividPink,
                thumbnail: {
                    url: images.muted
                },
                timestamp: new Date(),
                footer: {
                    text: client.user.username,
                    iconURL: client.user.avatarURL(),
                }
            } )
        },
        "unmuted": {
            "atextMessage": (member) => ( {
                title: "Člen byl odmuten",
                description: `${member} byl odmuten.`,
                color: Colors.DarkVividPink,
                thumbnail: member.user.displayAvatarURL(),
                timestamp: new Date(),
                footer: {
                    text: client.user.username,
                    iconURL: client.user.avatarURL(),
                }
            } ),
            "toUser": (member) => ( {
                title: "Tvůj mute na serveru " + bold(servers.soutezeTryhard) + " byl zrušen",
                description: `Již můžeš chatovat a psát na serveru jako předtím.`,
                color: Colors.DarkVividPink,
				thumbnail: {
                    url: images.unmuted
                },
                timestamp: new Date(),
                footer: {
                    text: client.user.username,
                    iconURL: client.user.avatarURL(),
                }

            } )
        },

    },
    "buttons": {
        "verification": {
            "verify": (member) => ({
                label: "Verify",
                style: ButtonStyle.Primary,
                customId: "verify_user_" + member.id,
            })
        },
        "punishment": {
            "ban": (member) => ({
                label: "Ban",
                style: ButtonStyle.Danger,
                customId: "ban_user_" + member.id,
            }),
            "kick": (member) => ({
                label: "Kick",
                style: ButtonStyle.Danger,
                customId: "kick_user_" + member.id,
            })
        }
    }
}

export default templates;