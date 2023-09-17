import {SlashCommandBuilder} from "discord.js";
import execute from "./execute.js";

const NAME= ["c", "competitions"]
const DESCRIPTION= "List all of my commands or info about a specific command"

const competitions = [];

for (let i = 0; i < NAME.length; i++) {
    const SLASHCOMMAND = new SlashCommandBuilder()
        .setName(NAME[i])
        .setDescription(DESCRIPTION)
        .addSubcommand(
            subcommand => subcommand
                .setName("add")
                .setDescription("Add a new competition")
                .addStringOption(
                    option => option
                        .setName("type")
                        .setDescription("Type of the competition")
                        .setRequired(true)
                        .addChoices(
                            {
                                name: "Jednokolová Soutěž",
                                value: "jednokolová_soutěž"
                            },
                            {
                                name: "Vícekolová Soutěž",
                                value: "vícekolová_soutěž"
                            }
                        )
                )
        )

    // create a const with name of the command
    competitions.push({
        name: NAME[i],
        description: DESCRIPTION,
        slashCommand: SLASHCOMMAND.toJSON(),
        execute
    });
}

export default competitions;