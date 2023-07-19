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
import functions from "./assets/settings/functions.js";
import automod from "./assets/slashCommands/SC__Automod/setup.js";


client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    client.user.setPresence({ activities: [{ name: 'Test mode' }], status: 'online' });
});

client.login(token);

client.on(Events.InteractionCreate, (interaction) => functions.mainInteractionListener(interaction));


new REST({version: '10'}).setToken(token).put(
    Routes.applicationCommands(clientId),
    {
        body:

            [
                help.slashCommand,
                sendMsg.slashCommand,
                createCategory.slashCommand,
                automod.slashCommand
            ]
    }
);