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
    UserSelectMenuBuilder,
    RoleSelectMenuBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    Events,
    ButtonBuilder, MessageFlagsBitField, MessageFlags, hyperlink
} from "discord.js";
import answers from "./answers.js";
import help from "../slashCommands/SC__Help/setup.js";
import sendMsg from "../slashCommands/SC__SendMsg/setup.js";
import createCategory from "../slashCommands/SC__CreateCategory/setup.js";
import automod from "../slashCommands/SC__Automod/setup.js";
import {doc, setDoc} from "firebase/firestore";
import db, {getSS} from "./firebase.js";
import templates from "./templates.js";
import {categories, channels} from "./channels.js";
import servers from "./servers.js";
import roles from "./roles.js";
import websites from "./websites.js";
import forumTags from "./forumTags.js";
import userInformations from "../contextMenus/CM__UserInformations/setup.js";
import history from "./history.js";
import users from "../slashCommands/SC__Users/setup.js";
import competitions from "../slashCommands/SC__Competitions/setup.js";

const guildId = process.env.GUILD_ID;


import UserFunctions from "./functions/UserFunctions.js";
import CreateFunctions from "./functions/CreateFunctions.js";
import ControlFunctions from "./functions/ControlFunctions.js";
import DeleteFunctions from "./functions/DeleteFunctions.js";
import EditFunctions from "./functions/EditFunctions.js";
import GetFunctions from "./functions/GetFunctions.js";
import ListenerFunctions from "./functions/ListenerFunctions.js";
import CompetitionsClass from "./competitions.js";

const competitionsClass = new CompetitionsClass()

class Functions {

    constructor() {
        this.user = new UserFunctions();
        this.create = new CreateFunctions();
        this.control = new ControlFunctions();
        this.delete = new DeleteFunctions();
        this.edit = new EditFunctions();
        this.get = new GetFunctions();
        this.listener = new ListenerFunctions();
    }

    async mainInteractionListener(interaction) {
        if (interaction.isChatInputCommand()) {

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
                case users.name: {
                    await users.execute(interaction);
                    break;
                }
                case competitions[0].name: {
                    await competitions[0].execute(interaction, competitionsClass);
                    break;
                }
                case competitions[1].name: {
                    await competitions[1].execute(interaction, competitionsClass);
                    break;
                }

                default: {
                    await interaction.reply({content: "Unknown command", ephemeral: true});
                }
            }
        } else if (interaction.isButton()) {
            const customId = interaction.customId;

            if (customId.startsWith("verify_user_")) {
                await this.user.verifyUser(interaction)
            } else if (customId.startsWith("ban_user_")) {
                await this.create.createModal(customId, "Ban user", [
                    {
                        customId: "ban_user_reason",
                        label: "Proč by měl uživatel dostat ban?",
                        placeholder: "Reason",
                        value: "",
                        style: "paragraph"
                    } ]).then(
                    modal => {
                        interaction.showModal(modal)
                    })
            } else if (customId.startsWith("kick_user_")) {

                await this.create.createModal(customId, "Kick user", [
                    {
                        customId: "kick_user_reason",
                        label: "Proč by měl být uživatel vyhozeen?",
                        placeholder: "Reason",
                        value: "",
                        style: "paragraph"
                    } ]).then(
                    modal => {
                        interaction.showModal(modal)
                    })
            } else {
                switch (customId) {
                    case "chat": {
                        await this.create.createModal(customId, "S čím potřebujete pomoci", [
                            {
                                customId: "help_problem",
                                label: "Popište svůj problém",
                                placeholder: "Zde pište...",
                                value: "",
                                style: "paragraph"
                            } ]).then(
                            modal => {
                                interaction.showModal(modal)
                            })
                    }
                }
            }

        } else if (interaction.isContextMenuCommand()) {
            const { commandName } = interaction;

            switch (commandName) {
                case "user-informations": {
                    await userInformations.execute(interaction);

                    break;
                }
                default: {
                    await interaction.reply({content: "Unknown context menu command", ephemeral: true});
                }
            }
        } else if (interaction.isModalSubmit()) {
            const { customId } = interaction;
            if (customId === "jednokolová_soutěž" || customId === "vícekolová_soutěž") {
                const name = interaction.fields.getTextInputValue("competition_name")
                const activeSession = competitionsClass.activeSessions.find(session => session.discordID === interaction.user.id)
                if (activeSession) {
                    await activeSession.interaction.deleteReply()
                    competitionsClass.activeSessions = competitionsClass.activeSessions.filter(session => session.discordID !== interaction.user.id)
                }

                switch (customId) {
                    case "jednokolová_soutěž": {
                        interaction.reply(`# ${name}`)

                        competitionsClass.activeSessions.push({
                            discordID: interaction.user.id,
                            interaction: interaction
                        })
                        break;
                    }
                    case "vícekolová_soutěž": {
                        interaction.reply(`# ${name}`)

                        competitionsClass.activeSessions.push({
                            discordID: interaction.user.id,
                            interaction: interaction
                        })
                        break;
                    }
                }



            }  else if (customId.startsWith("ban_user_")) {

                const targetUser = this.get.getMemberById(customId.split("_")[2]).user
                const reason = interaction.fields.getTextInputValue("ban_user_reason")

                this.user.banUser(targetUser, reason, interaction, 0)

                interaction.reply(answers.userBanned(targetUser, reason))

            } else if (customId.startsWith("kick_user_")) {

                const targetUser = this.get.getMemberById(customId.split("_")[2]).user
                const reason = interaction.fields.getTextInputValue("kick_user_reason")

                this.user.kickUser(targetUser, reason, interaction)

                interaction.reply(answers.userKicked(targetUser, reason))

            } else {
                switch (customId) {
                    case "chat": {
                        const problem = interaction.fields.getTextInputValue("help_problem")
                        interaction.reply({
                            content: `Děkujeme za zaslání problému, brzy se na něj podíváme: ${problem}`,
                            ephemeral: true
                        })
                    }
                }
            }
        } else if (interaction.isAutocomplete()) {
            try {
                switch (interaction.commandName) {
                    case "help": {
                        const value = interaction.options.getFocused().toLowerCase();

                        let choices = ["Minecraft", "STTT"]



                        const filtered = choices.filter(choice => choice.toLowerCase().includes(value)).slice(0, 25)

                        if (!interaction) return;

                        await interaction.respond(
                            filtered.map(choice => ({
                                name: choice,
                                value: choice,
                            }))
                        )
                        break;
                    }
                    default: {
                        await console.log("Unknown autocomplete command")
                    }
                }

            } catch (error) {}
        }
    }
}

const functions = new Functions();
export default functions;
