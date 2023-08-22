import client from "../discordjssetup.js";
import dotenv from 'dotenv';
dotenv.config();
const guildId = process.env.GUILD_ID;

export default class EditFunctions {
    async editMessageInChannel (channelId, messageId, newMessage = null, newEmbeds = null, newComponents = null, newFiles = null )  {

        console.log(guildId)
        console.log(channelId)
        console.log(messageId)

        return client.guilds.cache.get(guildId).channels.cache.get(channelId).messages.cache.get(messageId).edit({
            content: newMessage,
            embeds: newEmbeds,
            components: newComponents,
            files: newFiles
        }).then(
            editedmsg => editedmsg
        )

    }

}