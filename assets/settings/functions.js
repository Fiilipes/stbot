import dotenv from 'dotenv';
import client from "./discordjssetup.js";

dotenv.config();

import {
    EmbedBuilder, ChannelType, PermissionFlagsBits, Colors
} from "discord.js";

const guildId = process.env.GUILD_ID;

class Functions {
    constructor() {
        this.client = client;
        this.guildId = guildId;
    }

    getCurrentFilePath() {
        try {
            return "/assets" + new Error().stack.split('\n')[2].trim().replace(/^at /, '').split("/assets")[1].split(".js")[0].concat(".js");
        } catch (e) {
            console.log(e);
        }
    }

    async createEmbeds(components) {
        try {
            const exampleEmbed = new EmbedBuilder()
                .setColor(components.color ? components.color : 0x0099FF)
                .setTitle(components.title ? components.title : 'Title');

            components.url && exampleEmbed.setURL(components.url);
            components.author && exampleEmbed.setAuthor(components.author);
            components.description && exampleEmbed.setDescription(components.description);
            components.thumbnail && exampleEmbed.setThumbnail(components.thumbnail);
            components.fields && exampleEmbed.addFields(components.fields);
            components.image && exampleEmbed.setImage(components.image);
            components.timestamp && exampleEmbed.setTimestamp(components.timestamp);
            components.footer && exampleEmbed.setFooter(components.footer);

            return [exampleEmbed];
        } catch (e) {
            console.log(e);
        }
    }

    async sendMessageToChannel(channel, message = null, embeds = null, components = null, files = null) {
        try {
            return await client.guilds.cache.get(guildId)?.channels.cache.get(channel.id)?.send({
                content: message,
                embeds,
                components,
                files
            }).then(
                msg => {
                    return msg;
                }
            );
        } catch (e) {
            console.log(e);
        }
    }

    async sendMessageToUser(user, message = null, embeds = null, components = null, files = null) {
        try {
            return await client.users.cache.get(user.id)?.send({
                content: message,
                embeds,
                components,
                files
            }).then(
                msg => {
                    return msg;
                }
            );
        } catch (e) {
            console.log(e);
        }
    }

    async createCategory(name, interaction) {
        try {
            return await client.guilds.cache.get(guildId)?.channels.create({
                name: name,
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel],
                    }
                ],
            }).then(
                category => {
                    return category;
                }
            ).catch(console.error);
        } catch (e) {
            console.log(e);
        }
    }

    async createRole(name, interaction) {
        try {
            return await interaction.guild.roles.create({
                name: 'Super Cool Blue People',
                color: Colors.Blue,
                reason: 'we needed a role for Super Cool People',
            }).then(
                role => {
                    return role;
                }
            ).catch(console.error);
        } catch (e) {
            console.log(e);
        }
    }

}

const functions = new Functions();
export default functions;