import {bold, ButtonStyle, Colors, hyperlink} from "discord.js";
import roles from "./roles.js";
import client from "./discordjssetup.js";
import functions from "./functions.js";
import websites from "./websites.js";
import servers from "./servers.js";
import images from "./images.js";

const templates = {
    "messages": {
      	"competitionPost": (competition,chatChannel,announcmentChannel, role) => {
              const miles = competition.miles.sort(
                  //sort by date.value but if it is single date, sort by date.value.seconds and if it is range, sort by date.value.from.seconds
                    (a, b) => {
                        if (a.date.type === "single" && b.date.type === "single") {
                            return a.date.value.seconds - b.date.value.seconds
                        } else if (a.date.type === "range" && b.date.type === "range") {
                            return a.date.value.from.seconds - b.date.value.from.seconds
                        } else if (a.date.type === "single" && b.date.type === "range") {
                            return a.date.value.seconds - b.date.value.from.seconds
                        } else if (a.date.type === "range" && b.date.type === "single") {
                            return a.date.value.from.seconds - b.date.value.seconds
                        }
                    }
              ).map(mile => {
                    return (
                        `
- **${mile.label}**: ${mile.date.type === "single" ? `**<t:${mile.date.value.seconds}:R>** | **<t:${mile.date.value.seconds}:D>**` : `**<t:${mile.date.value.from.seconds}:R>** | **<t:${mile.date.value.from.seconds}:D>** - **<t:${mile.date.value.to.seconds}:D>**`}
                        `
                    )
                }).join("")
            console.log(miles)
              return (
                  `
# ${competition.name}
*${competition.type}*

${competition.miles.length > 0 ? `## Etapy soutěže \n${miles}` : ""}

## Informace k soutěži 
${chatChannel && announcmentChannel ? `- Novinky, informace a chat pro soutěž: **${announcmentChannel}** | **${chatChannel}**` : ""}
${competition.place ? `- Místo konání: **${competition.place}**` : ""}
${competition.users.length > 0 ? `- Účastníci: **${competition.users.map(
                      user => ` <@${user.discordID}>`
                  )}**${role?` | ${role}`:""}` : "- Nikdo se zatím neúčastní"}
                  
${competition.description ?  `## Popis soutěže \n${competition.description}` : ""}
`

              )
        },


        "userInformations": targetUser => `Username: ${targetUser.username}\nID: ${targetUser.id}`,
        "history": {
              "newChannel": channel => `# Historie kanálu ${channel} \n\n Toto je historie kanálu spravována Soutěže Tryhard Botem \n\n Tento kanál je vytvořen automaticky, a bude kopírovat všechny zprávy z kanálu ${channel} \n\n Tento kanál je vytvořen pro účely lepší moderace členů serveru.`,
              "newMessage": message => `## **[${message.author}]**   :incoming_envelope:   **[${message.channel}]**   :clock2:   **[${new Date(message.createdTimestamp).toLocaleString("cs-CZ")}]**\n> ${message.content}`
        },
        "competitionAnnouncment": (competition, chatChannel, announcmentChannel, thread) =>
`
# ${competition.name}
- Tato kategorie byla vytvořena pro událost **${thread}**

> ${announcmentChannel} slouží jako zdroj informací a novinek k události
> ${chatChannel} slouží jako místo pro komunikaci mezi účastníky soutěže
`
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
                description: `${functions.get.getMemberById(user.discordID)} je nyní ověřený!`,
                color: Colors.Green,
                thumbnail: functions.get.getMemberById(user.discordID).displayAvatarURL(),
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
                description: `**${member.username}** byl zabanován z důvodu:\n*${reason}*`,
                color: Colors.DarkButNotBlack,
                thumbnail: images.banned,
                timestamp: new Date(),
                author: {
                    name: client.user.username,
                    iconURL: client.user.avatarURL(),
                },
                footer: {
                    text: "ST Punishment System",
                }
            }),
            "announcementMessage": (member, reason) => ( {
                title: "Člen byl zabanován",
                description: `**${member.username}** byl zabanován z důvodu:\n*${reason}*`,
                color: Colors.DarkButNotBlack,
                thumbnail: images.banned,
                timestamp: new Date(),
                author: {
                    name: client.user.username,
                    iconURL: client.user.avatarURL(),
                },
                footer: {
                    text: "ST Punishment System",
                }
            }),
            "toUser": (member, reason) => ( {
                title: "Byl jsi zabanován ze serveru " + bold(servers.soutezeTryhard.name),
                description: `Byl jsi zabanován z důvodu: ${reason}\n- Pokud si myslíš, že si dostal ban neprávem, obrať se na **A-team**`,
                color: Colors.DarkButNotBlack,
                thumbnail: images.banned,
                timestamp: new Date(),
                author: {
                    name: client.user.username,
                    iconURL: client.user.avatarURL(),
                },
                footer: {
                    text: "ST Punishment System",
                }
            })
        },
        "kickedFromServer": {
            "atextMessage": (member, reason) => ( {
                title: "Člen byl vyhozen",
                description: `**${member.username}** byl vyhozen z důvodu:\n*${reason}*`,
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
                description: `**${member.username}** byl vyhozen z důvodu:\n*${reason}*`,
                color: Colors.Red,
                thumbnail: member.displayAvatarURL(),
                timestamp: new Date(),
                footer: {
                    text: client.user.username,
                    iconURL: client.user.avatarURL(),
                }
            }),
            "toUser": (member, reason) => ( {
                title: "Byl jsi vyhozen ze serveru " + bold(servers.soutezeTryhard.name),
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
                thumbnail: member.displayAvatarURL(),
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
                thumbnail: member.displayAvatarURL(),
                timestamp: new Date(),
                footer: {
                    text: client.user.username,
                    iconURL: client.user.avatarURL(),
                }
            } ),
            "toUser": (member, reason, time) => ( {
                title: "Byl jsi ztlumen na serveru " + bold(servers.soutezeTryhard.name),
                description: `Byl jsi ztlumen z důvodu: **${reason}** na dobu **${time}** minut.\n Po uplynutí doby ti bude mute automaticky zrušen. \nPokud si myslíš, že si dostal mute neprávem, obrať se na **A-team**`,
                color: Colors.DarkVividPink,
                thumbnail: images.muted,
                timestamp: new Date(),
                footer: {
                    text: client.user.username,
                    iconURL: client.user.avatarURL(),
                }
            } )
        },
        "unmuted": {
            "atextMessage": (member) => ( {
                title: "Člen byl odztlumen",
                description: `Členovi ${member} bylo zrušeno ztlumení`,
                color: Colors.DarkVividPink,
                thumbnail: member.displayAvatarURL(),
                timestamp: new Date(),
                footer: {
                    text: client.user.username,
                    iconURL: client.user.avatarURL(),
                }
            } ),
            "toUser": () => ( {
                title: "Tvůj mute na serveru " + bold(servers.soutezeTryhard.name) + " byl zrušen",
                description: `Již můžeš chatovat a psát na serveru jako předtím.`,
                color: Colors.DarkVividPink,
				thumbnail: images.unmuted,
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