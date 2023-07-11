import {SlashCommandBuilder} from "discord.js";
import execute from "./execute.js";

const NAME= "competitions"
const DESCRIPTION= "Manage all competitions"

const SLASHCOMMAND = new SlashCommandBuilder()
    .setName(NAME)
    .setDescription(DESCRIPTION)
    .addSubcommand(
        subcommand =>
            subcommand
        .setName('create')
        .setDescription('Create a new competition')
        .addStringOption(
            option =>
                option
                    .setName('type')
                    .setDescription('Type of competition')
                    .setChoices(
                        {
                            name: 'Soutěž',
                            value: 'soutez'
                        },
                        {
                            name: 'Korespondenční seminář',
                            value: 'korespondencni-seminar'
                        },
                        {
                            name: 'Soustředění',
                            value: 'soustredeni'
                        }
                    )
                    .setRequired(true)
        )
    )

const competitions = {
    name: NAME,
    description: DESCRIPTION,
    slashCommand: SLASHCOMMAND.toJSON(),
    execute
}

export default competitions;