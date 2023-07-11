import {
    Events, REST, Routes
} from 'discord.js';

import help from "./assets/slashCommands/SC__Help/setup.js";
import sendMsg from "./assets/slashCommands/SC__SendMsg/setup.js";

import dotenv from 'dotenv';
dotenv.config();

// get token from .env
const token = process.env.TOKEN;

// get client id from .env
const clientId = process.env.CLIENT_ID;

// get guild id from .env
const guildId = process.env.GUILD_ID;

import client from './assets/settings/discordjssetup.js';
import createCategory from "./assets/slashCommands/SC__CreateCategory/setup.js";
import competitions from "./assets/slashCommands/SC__Competetions/setup.js";

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    client.user.setPresence({ activities: [{ name: 'Test mode' }], status: 'online' });
});

client.login(token);

client.on(Events.InteractionCreate, async interaction => {
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
        case competitions.name: {
            await competitions.execute(interaction);
            break;
        }
        default: {
            await interaction.reply({content: "Unknown command", ephemeral: true});
        }
    }

})


new REST({version: '10'}).setToken(token).put(
    Routes.applicationGuildCommands(clientId, guildId),
    {
        body:

            [
                help.slashCommand,
                sendMsg.slashCommand,
                createCategory.slashCommand,
                competitions.slashCommand
            ]
    }
);