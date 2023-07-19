import dotenv from 'dotenv';
import client from "./discordjssetup.js";

dotenv.config();

import {
    EmbedBuilder,
    ChannelType,
    PermissionFlagsBits,
    Colors,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    UserSelectMenuBuilder, RoleSelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Events
} from "discord.js";
import answers from "./answers.js";
import help from "../slashCommands/SC__Help/setup.js";
import sendMsg from "../slashCommands/SC__SendMsg/setup.js";
import createCategory from "../slashCommands/SC__CreateCategory/setup.js";
import automod from "../slashCommands/SC__Automod/setup.js";

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

    async createCategory(name, interaction) {
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
        );

    }

    async createRole(name, interaction) {
        return await interaction.guild.roles.create({
            name: 'Super Cool Blue People',
            color: Colors.Blue,
            reason: 'we needed a role for Super Cool People',
        }).then(
            role => {
                return role;
            }
        )
    }

    async mainInteractionListener(interaction) {
        if (!interaction.isCommand()) return;

        const { commandName } = interaction;

        switch (commandName) {
            case help.name: {
                await help.execute(interaction);
                break;
            }
            case sendMsg.name: {
                await sendMsg.execute(interaction);
                break;
            }
            case createCategory.name: {
                await createCategory.execute(interaction);
                break;
            }
            case automod.name: {
                await automod.execute(interaction);
                break;
            }
            default: {
                await interaction.reply({content: "Unknown command", ephemeral: true});
            }
        }
    }


}

const functions = new Functions();
export default functions;