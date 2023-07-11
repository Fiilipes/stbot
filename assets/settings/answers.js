import {createEmbeds} from "./functions.js";
import links from "./links.js";
import images from "./images.js";
import client from "./discordjssetup.js";

const answers = {
    "errorOccurred": async (error, place) => {
        return {
            "embeds": await createEmbeds(
                {
                    color: 0xFF9900,
                    title: 'Nastala chyba',
                    description: `Nastala chyba v místě ${place}`,
                },
            ),
            "ephemeral": true
        }
    },
    "notPermitted": {
        "content": "Nemáš dostatečná práva pro použití tohoto příkazu.",
        "ephemeral": true
    },
    "messageSentInChannel": async (channel, message) => {
        return {
            "embeds": await createEmbeds(
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
    },
    "messageSentToUser": async  (user, message) => {
        console.log(message)
        return {
            "embeds": await createEmbeds(
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
    }
}

export default answers;