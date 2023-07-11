import links from "./links.js";
import images from "./images.js";
import client from "./discordjssetup.js";
import websites from "./websites.js";
import {hyperlink} from "discord.js";
import functions from "./functions.js";

const answers = {
    "errorOccurred": async (error, place) => {
        console.log(place)
        return {
            "embeds": await functions.createEmbeds(
                {
                    color: 0xE0C606,
                    title: 'Nastala chyba',
                    description: error,
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
    "notPermitted": {
        "content": "Nemáš dostatečná práva pro použití tohoto příkazu.",
        "ephemeral": true
    },
    "messageSentInChannel": async (channel, message) => {
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
    },
    "messageSentToUser": async  (user, message) => {
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
    }
}

export default answers;