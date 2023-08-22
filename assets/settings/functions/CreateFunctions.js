import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    ModalBuilder, RoleSelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
    TextInputBuilder,
    TextInputStyle, UserSelectMenuBuilder
} from "discord.js";

export default class MessageComponents {
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
                .setCustomId(component.customId ? component.customId : "error")
                .setLabel(component.label ? component.label : "Error label")
                .setStyle(component.style)

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
}