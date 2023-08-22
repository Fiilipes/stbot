import {
    ActionRowBuilder,
    ButtonBuilder, ChannelType, Colors,
    EmbedBuilder,
    ModalBuilder, PermissionFlagsBits, RoleSelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
    TextInputBuilder,
    TextInputStyle, UserSelectMenuBuilder
} from "discord.js";
import client from "../discordjssetup.js";
import db, {getSS} from "../firebase.js";
import {doc, setDoc} from "firebase/firestore";
import dotenv from 'dotenv';
dotenv.config();
const guildId = process.env.GUILD_ID;
export default class CreateFunctions {
    async createEmbeds(components) {
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

    }

    async createModal (customId, title, components) {
        const modal = new ModalBuilder()
            .setCustomId(customId ? customId : "error")
            .setTitle(title ? title : "Error title");

        let myActionRows = []
        components.forEach(component => {
            const myInput = new TextInputBuilder()
                .setCustomId(component.customId ? component.customId : "error")
                .setLabel(component.label ? component.label : "Error label")
                .setPlaceholder(component.placeholder? component.placeholder : "")
                .setValue(component.value? component.value : "")
                .setStyle(component.style.toLowerCase() === "paragraph" ? TextInputStyle.Paragraph : TextInputStyle.Short)

            const myActionRow = new ActionRowBuilder().addComponents(myInput)

            myActionRows.push(myActionRow)

        })

        myActionRows.forEach(
            actionRow => modal.addComponents(actionRow)
        )

        return modal
    }

    async createButtons(components)  {

        let buttons = []
        components.forEach(component => {
            const button = new ButtonBuilder()
                .setLabel(component.label ? component.label : "Error label")
                .setStyle(component.style)

            if (component.url) {
                button.setURL(component.url)
            } else {
                button.setCustomId(component.customId ? component.customId : "error")
                if (component.emoji) {
                    button.setEmoji(component.emoji)
                }
            }

            buttons.push(button)


        })

        return new ActionRowBuilder().addComponents(buttons)

    }

    async createSelectMenus(components) {
        const myActionRows = []

        components.forEach(component => {

            switch (component.type) {
                case "user":
                    myActionRows.push(
                        new ActionRowBuilder().addComponents(
                            new UserSelectMenuBuilder()
                                .setCustomId(component.customId ? component.customId : "error-users")
                                .setPlaceholder(component.placeholder ? component.placeholder : "Error placeholder")
                                .setMinValues(component.minValues ? component.minValues : 0)
                                .setMaxValues(component.maxValues ? component.maxValues : 10)
                        )
                    )
                    break;
                case "role":
                    myActionRows.push(
                        new ActionRowBuilder().addComponents(
                            new RoleSelectMenuBuilder()
                                .setCustomId(component.customId ? component.customId : "error-roles")
                                .setPlaceholder(component.placeholder ? component.placeholder : "Error placeholder")
                                .setMinValues(component.minValues ? component.minValues : 0)
                                .setMaxValues(component.maxValues ? component.maxValues : 10)
                        )
                    )

                    break;
                case "normal":

                    const select = new StringSelectMenuBuilder()
                        .setCustomId(component.customId ? component.customId : "error-normal")
                        .setPlaceholder(component.placeholder ? component.placeholder : "Error placeholder")

                    component.options.forEach(option => {

                        if (option.emoji) {
                            select.addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(option.label ? option.label : "Error label")
                                    .setDescription(option.description ? option.description : "Error description")
                                    .setEmoji(option.emoji ? option.emoji : "❌")
                                    .setDefault(option.default ? option.default : false)
                                    .setValue(option.value ? option.value : "Error value")
                            )
                        } else {
                            select.addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(option.label ? option.label : "Error label")
                                    .setDescription(option.description ? option.description : "Error description")
                                    .setDefault(option.default ? option.default : false)
                                    .setValue(option.value ? option.value : "Error value")
                            )
                        }
                    })

                    myActionRows.push(
                        new ActionRowBuilder().addComponents(select)
                    )
                    break;
                default:
                    console.log("error")
            }
        })

        return myActionRows
    }

    async createCategory(name, permissions, position) {
        return await client.guilds.cache.get(guildId)?.channels.create({
            name: name,
            type: ChannelType.GuildCategory,
            permissionOverwrites: permissions,
            position: position
        }).then(
            category => {
                return category;
            }
        );
    }

    async createChannel(name, type, parent, permissions) {
        return await client.guilds.cache.get(guildId)?.channels.create({
            name: name,
            type: type,
            parent: parent,
            permissionOverwrites: permissions
        }).then(
            channel => {
                return channel;
            }
        );
    }

    async createRole(name, guild) {
        return await guild.roles.create({
            name: name,
            color: Colors.Blue,
            reason: `Role byla vytvořena pro účastníky soutěže ${name}.`,
        }).then(
            role => {
                return role;
            }
        )
    }

    async sendMessageToChannel(channel, message = null, embeds = null, components = null, files = null) {
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
    }

    async sendMessageToUser(user, message = null, embeds = null, components = null, files = null) {
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
    }

    addInformation({author, messageId, time, type, value}) {
        getSS(["informations"]).then(
            res => {
                const informations = res["informations"].list
                informations.push({
                    author: author,
                    type: type,
                    time: time,
                    messageId: messageId,
                    value: value
                })
                setDoc(doc(db, "ssbot", "informations"), {list: informations})
            }
        )
    }

}