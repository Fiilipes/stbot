import {SlashCommandBuilder} from "discord.js";
import execute from "./execute.js";

const NAME= "automod"
const DESCRIPTION= "Setup the automod system"

const SLASHCOMMAND = new SlashCommandBuilder()
    .setName(NAME)
    .setDescription(DESCRIPTION)
    .addSubcommand(
        subcommand => subcommand
            .setName("flagged-words").setDescription("Block profanity, sexual content and slurs")
    )
    .addSubcommand(
        subcommand => subcommand
            .setName("spam-messages").setDescription("Block messages suspected of spam")
    )
    .addSubcommand(
        subcommand => subcommand
            .setName("mention-spam").setDescription("Block messages containing a certain amount of mentions").addIntegerOption(
                option => option.setName("number").setDescription("The amount of mentions to block").setRequired(true)
            )
    )
    .addSubcommand(
        subcommand => subcommand
            .setName("keyword").setDescription("Block a given keywword in the server").addStringOption(
                option => option.setName("word").setDescription("The word to block").setRequired(true)
            )
    )

const automod = {
    name: NAME,
    description: DESCRIPTION,
    slashCommand: SLASHCOMMAND.toJSON(),
    execute
}

export default automod;