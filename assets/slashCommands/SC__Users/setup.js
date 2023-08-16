import {SlashCommandBuilder} from "discord.js";
import execute from "./execute.js";

const NAME= "users"
const DESCRIPTION= "Manage users on the server"

const SLASHCOMMAND = new SlashCommandBuilder()
    .setName(NAME)
    .setDescription(DESCRIPTION)
    .addSubcommand(
        subcommand => subcommand
            .setName("ban")
            .setDescription("Ban a user from the server")
            .addUserOption(
                option => option
                    .setName("user")
                    .setDescription("The user to ban")
                    .setRequired(true)
            )
            .addStringOption(
                option => option
                    .setName("reason")
                    .setDescription("The reason for the ban")
                    .setRequired(true)
            )
            .addStringOption(
                option => option
                    .setName("delete-messages")
                    .setDescription("Delete messages from the user")
                    .setChoices(
                        {
                            name: "Donot delete any",
                            value: "any"
                        },
                        {
                            name: "Previous hour",
                            value: "hour"
                        },
                        {
                            name: "Previous 6 hours",
                            value: "6hours"
                        },
                        {
                            name: "Previous 12 hours",
                            value: "12hours"
                        },
                        {
                            name: "Previous 24 hours",
                            value: "1"
                        },
                        {
                            name: "Previous 3 days",
                            value: "3"
                        },
                        {
                            name: "Previous 7 days",
                            value: "7"
                        }
                    )
                    .setRequired(true)
            )
    )
    .addSubcommand(
        subcommand => subcommand
            .setName("kick")
            .setDescription("Kick a user from the server")
            .addUserOption(
                option => option
                    .setName("user")
                    .setDescription("The user to kick")
                    .setRequired(true)
            )
            .addStringOption(
                option => option
                    .setName("reason")
                    .setDescription("The reason for the kick")
                    .setRequired(true)
            )
    )
    .addSubcommand(
        subcommand => subcommand
            .setName("mute")
            .setDescription("Mute a user on the server")
            .addUserOption(
                option => option
                    .setName("user")
                    .setDescription("The user to mute")
                    .setRequired(true)
            )
            .addStringOption(
                option => option
                    .setName("reason")
                    .setDescription("The reason for the mute")
                    .setRequired(true)
            )
            .addStringOption(
                option => option
                    .setName("time")
                    .setDescription("The time for the mute in minutes")
                    .setRequired(true)
            )
    )
    .addSubcommand(
        subcommand => subcommand
            .setName("unmute")
            .setDescription("Unmute a user on the server")
            .addUserOption(
                option => option
                    .setName("user")
                    .setDescription("The user to unmute")
                    .setRequired(true)
            )
    )
    .addSubcommand(
        subcommand => subcommand
            .setName("warn")
            .setDescription("Warn a user on the server")
            .addUserOption(
                option => option
                    .setName("user")
                    .setDescription("The user to warn")
                    .setRequired(true)
            )
            .addStringOption(
                option => option
                    .setName("reason")
                    .setDescription("The reason for the warn")
                    .setRequired(true)
            )
    )
    .addSubcommand(
        subcommand => subcommand
            .setName("verify")
            .setDescription("Verify a user on the server")
            .addUserOption(
                option => option
                    .setName("user")
                    .setDescription("The user to verify")
                    .setRequired(true)
            )
    )
    .addSubcommand(
        subcommand => subcommand
            .setName("unverify")
            .setDescription("Unverify a user on the server")
            .addUserOption(
                option => option
                    .setName("user")
                    .setDescription("The user to unverify")
                    .setRequired(true)
            )
    )
    .addSubcommand(
        subcommand => subcommand
            .setName("info")
            .setDescription("Get info about a user on the server")
            .addUserOption(
                option => option
    	                    .setName("user")
    	                    .setDescription("The user to get info about")
    	                    .setRequired(true)
            )
    )


const users = {
    name: NAME,
    description: DESCRIPTION,
    slashCommand: SLASHCOMMAND.toJSON(),
    execute
}

export default users;