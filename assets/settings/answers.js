import links from "./links.js";
import images from "./images.js";
import client from "./discordjssetup.js";
import websites from "./websites.js";
import {Colors, hyperlink} from "discord.js";
import functions from "./functions.js";

const errorAnswers = {
    "errorOccurred": async (error, place) => {
        console.log(place)
        // max 50 characters
        console.log(error)
        return {
            "embeds": await functions.createEmbeds(
                {
                    color: 0xE0C606,
                    title: 'Nastala chyba',
                    description: error.message.toString(),
                    thumbnail: images.thinking,
                    fields: [
                        {
                            name: 'Místo chyby:',
                            value: hyperlink("**Github.com**" + place.split("/assets")[1],websites.githubRepository + place, "Github")
                        }
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: client.user.username,
                        iconURL: client.user.avatarURL(),
                    }


                },
            ),
            "ephemeral": true
        }
    },
}

const answers = {
    "alert": async (error) => {
        try {
            return {
                "embeds": await functions.createEmbeds(
                    {
                        color: 0x0099FF,
                        title: 'Upozornění',
                        description: error,
                        thumbnail: images.alert,
                        timestamp: new Date(),
                        footer: {
                            text: client.user.username,
                            iconURL: client.user.avatarURL(),
                        }
                    },
                ),
                "ephemeral": true
            }
        } catch (error) {
            return errorAnswers.errorOccurred(error, functions.getCurrentFilePath())
        }
    },
    "notPermitted": {
        "content": "Nemáš dostatečná práva pro použití tohoto příkazu.",
        "ephemeral": true
    },
    "messageSentInChannel": async (channel, message) => {
        try {
            return {
                "embeds": await functions.createEmbeds(
                    {
                        color: 0x0099FF,
                        title: 'Zpráva byla odeslána',

                        description: `Vámi odeslaná zpráva byla úspěšně odeslána na server do kanálu ${channel}`,
                        thumbnail: images.sent,
                        fields: [
                            {
                                name: 'Obsah zprávy:',
                                value: message.content,
                            }
                        ],
                        timestamp: new Date(),
                        footer: {
                            text: client.user.username,
                            iconURL: client.user.avatarURL(),
                        }
                    }
                ),
                "ephemeral": true
            }
        } catch (error) {
            return errorAnswers.errorOccurred(error, functions.getCurrentFilePath())
        }
    },
    "messageSentToUser": async  (user, message) => {
        try {
            return {
                "embeds": await functions.createEmbeds(
                    {
                        color: 0x0099FF,
                        title: 'Zpráva byla odeslána',

                        description: `Vámi odeslaná zpráva byla úspěšně doručena uživateli ${user}`,
                        thumbnail: images.sent,
                        fields: [
                            {
                                name: 'Obsah zprávy:',
                                value: message.content,
                            }
                        ],
                        timestamp: new Date(),
                        footer: {
                            text: client.user.username,
                            iconURL: client.user.avatarURL(),
                        }
                    }
                ),
                "ephemeral": true
            }
        } catch (error) {
            return errorAnswers.errorOccurred(error, functions.getCurrentFilePath())
        }
    },
    "welcomeMessage": async (member) => {
        return `# Vítej na **Soutěže Tryhard**, ${member} !\n` +
            `Je mým potěšením tě zde přivítat mezi námi. Aby ses ovšem dostal do kontaktu s ostatníma, je nutné vyčkat než Vás náš A-team verifikuje. Mezi tím si však můžete detailně přečíst pravidla nebo odpovědět na pár uvítacích otázek :) \n` +
            "\n" +
            "Děkuji za pochopení\n" +
            "Soutěže Tryhard Bot"

    },
    "notInDatabase": {
        "content": "Tento uživatel není v databázi.",
        "ephemeral": true
    },
    "userBanned": (user, reason) => {
        return {
            "embeds": [
                {
                    color: Colors.DarkerGrey,
                    title: 'Uživatel byl zabanován',
                    description: `Uživatel ${user} byl zabanován z důvodu: ${reason}`,
                    thumbnail: {
                        url: images.banned
                    },
                    timestamp: new Date(),
                    footer: {
                        text: client.user.username,
                        iconURL: client.user.avatarURL(),
                    }
                }
            ],
            "ephemeral": true
        }
    },
    "userMuted": (user, reason, time) => {
        return {
            "embeds": [
                {
                    color: Colors.DarkerGrey,
                    title: 'Uživatel byl ztlumen',
                    description: `Uživatel ${user} byl ztlumen z důvodu: ${reason} na dobu ${time} minut.`,
                    thumbnail: {
                        url: images.muted
                    },
                    timestamp: new Date(),
                    footer: {
                        text: client.user.username,
                        iconURL: client.user.avatarURL(),
                    }
                }
            ],
            "ephemeral": true
        }
    },
    "userWarned": (user, reason) => {
        return {
            "embeds": [
                {
                    color: Colors.DarkerGrey,
                    title: 'Uživatel byl varován',
                    description: `Uživatel ${user} byl varován z důvodu: ${reason}`,
                    thumbnail: {
                        url: images.warned
                    },
                    timestamp: new Date(),
                    footer: {
                        text: client.user.username,
                        iconURL: client.user.avatarURL(),
                    }
                }
            ],
            "ephemeral": true
        }
    },
    "userUnmuted": (user) => {
        return {
            "embeds": [
                {
                    color: Colors.DarkerGrey,
                    title: 'Uživateli byl zrušen mute',
                    description: `Uživateli ${user} byl zrušen jeho mute.`,
                    thumbnail: {
                        url: images.unmuted
                    },
                    timestamp: new Date(),
                    footer: {
                        text: client.user.username,
                        iconURL: client.user.avatarURL(),
                    }
                }
            ],
            "ephemeral": true
        }
    },
    "userKicked": (user, reason) => {
        return {
            "embeds": [
                {
                    color: Colors.DarkerGrey,
                    title: 'Uživatel byl vyhozen',
                    description: `Uživatel ${user} byl vyhozen z důvodu: ${reason}`,
                    thumbnail: {
                        url: images.kicked
                    },
                    timestamp: new Date(),
                    footer: {
                        text: client.user.username,
                        iconURL: client.user.avatarURL(),
                    }
                }
            ],
            "ephemeral": true
        }
    }
}

// combine objects
Object.assign(answers, errorAnswers)

export default answers;