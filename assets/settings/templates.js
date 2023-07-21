import {ButtonStyle, Colors, hyperlink} from "discord.js";
import roles from "./roles.js";
import client from "./discordjssetup.js";
import functions from "./functions.js";
import websites from "./websites.js";

const templates = {
    "messages": {
      	"competitionPost": competition =>
`
# ${competition.name}
*${competition.type}   |   Offline*

${competition.registration.enabled ? `- Datum registrace: **<t:${competition.registration.date.seconds}:D>**` : ""}
- Datum soutěže: ${competition.competition.dateType === "single" ? `**<t:${competition.competition.date.seconds}:D>**` : `**<t:${competition.competition.date.from.seconds}:D>** - **<t:${competition.competition.date.to.seconds}:D>**`}
- Místo konání: **Ostrava**
- Web: **${hyperlink(websites.survivalServer + "/soutezetryhard/" + competition.name.toLowerCase().replace(/ /g, ""), "survivalserver.cz/soutezetryhard/" + competition.name.replace(/ /g, ""))}**
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
                description: `${functions.getMemberById(user.discordID)} je nyní ověřený!`,
                color: Colors.LuminousVividPink,
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

            } )
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
        }
    },
    "buttons": {
        "verification": {
            "verify": (member) => ({
                label: "Verify",
                style: ButtonStyle.Primary,
                customId: "verify_user_" + member.id,
            })
        }
    }
}

export default templates;