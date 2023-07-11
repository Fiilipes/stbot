import answers from "./answers.js";
import client from "./discordjssetup.js";


import dotenv from 'dotenv';
import {EmbedBuilder} from "discord.js";
import * as path from "path";
dotenv.config();
// get guild id from .env
const guildId = process.env.GUILD_ID;

const getCurrentFilePath = () => {
    try {
        // replace last character with empty string
        return new Error().stack.split('\n')[2].trim().replace(/^at /, '').split("/assets")[1].slice(0, -1)
    } catch (e) {
        console.log(answers.errorOccurred(e, 'getCurrentFilePath').content)
    }
}
const createEmbeds = async (components) => {
    try {
        const exampleEmbed = new EmbedBuilder()
            .setColor(components.color ? components.color : 0x0099FF)
            .setTitle(components.title ? components.title : 'Title')

        components.url && exampleEmbed.setURL(components.url)
        components.author && exampleEmbed.setAuthor(components.author)
        components.description && exampleEmbed.setDescription(components.description)
        components.thumbnail && exampleEmbed.setThumbnail(components.thumbnail)
        components.fields && exampleEmbed.addFields(components.fields)
        components.image && exampleEmbed.setImage(components.image)
        components.timestamp && exampleEmbed.setTimestamp(components.timestamp)
        components.footer && exampleEmbed.setFooter(components.footer)

        return [exampleEmbed]

    } catch (e) {
        console.log(answers.errorOccurred(e, 'createEmbeds').content)
    }
}

const sendMessageToChannel = async (channel, message = null, embeds = null, components = null, files = null ) => {
    console.log(embeds)
    try {
        return await client.guilds.cache.get(guildId).channels.cache.get(channel.id).send({
            content: message,
            embeds: embeds,
            components: components,
            files: files
        }).then(
            msg => {
                return msg
            }
        )
    } catch (e) {
        console.log(answers.errorOccurred(e, 'sendMessageToChannel').content)
    }
}

const sendMessageToUser = async (user, message = null, embeds = null, components = null, files = null ) => {
    try {
        return await client.users.cache.get(user.id).send({
            content: message,
            embeds: embeds,
            components: components,
            files: files
        }).then(
            msg => {
                return msg
            }
        )
    } catch (e) {
        console.log(answers.errorOccurred(e, 'sendMessageToUser').content)
    }
}



export {
    createEmbeds,
    sendMessageToChannel,
    sendMessageToUser,
    getCurrentFilePath
}