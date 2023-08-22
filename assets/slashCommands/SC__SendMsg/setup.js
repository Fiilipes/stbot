import {SlashCommandBuilder} from "discord.js";
import execute from "./execute.js";

const NAME= "send"
const DESCRIPTION= "Poslat zprávu"

const SLASHCOMMAND = new SlashCommandBuilder()
    .setName(NAME)
    .setDescription(DESCRIPTION)
    .addSubcommand(
        subcommand =>
            subcommand
                .setName('dm')
                .setDescription('Poslat zprávu do DM')
                .addUserOption(
                    option =>
                        option
                            .setName('user')
                            .setDescription('Uživatel, kterému se má zpráva poslat')
                            .setRequired(true)
                )
                .addStringOption(
                    option =>
                        option
                            .setName('message')
                            .setDescription('Zpráva')
                            .setRequired(true)
                )
    )
    .addSubcommand(
        subcommand =>
            subcommand
                .setName('guild')
                .setDescription('Poslat zprávu na server')
                .addChannelOption(
                    option =>
                        option
                            .setName('channel')
                            .setDescription('Kanál, do kterého se má zpráva poslat')
                            .setRequired(true)
                )
                .addStringOption(
                    option =>
                        option
                            .setName('message')
                            .setDescription('Zpráva')
                            .setRequired(true)
                )
                .addBooleanOption(
                    option =>
                        option
                            .setName('impersonate')
                            .setDescription('Poslat zprávu za pomocí Vaší identity. (Webhook)')
                            .setRequired(false)
                )
    )


const sendMsg = {
    name: NAME,
    description: DESCRIPTION,
    slashCommand: SLASHCOMMAND.toJSON(),
    execute
}

export default sendMsg