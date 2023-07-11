import {SlashCommandBuilder} from "discord.js";
import execute from "./execute.js";

const NAME= "createcategory"
const DESCRIPTION= "List all of my commands or info about a specific command"

const SLASHCOMMAND = new SlashCommandBuilder()
    .setName(NAME)
    .setDescription(DESCRIPTION)

const createCategory = {
    name: NAME,
    description: DESCRIPTION,
    slashCommand: SLASHCOMMAND.toJSON(),
    execute
}

export default createCategory;