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
import db from "./assets/settings/firebase.js";
import {doc, onSnapshot} from "firebase/firestore";
import userInformations from "./assets/contextMenus/CM__UserInformations/setup.js";
import users from "./assets/slashCommands/SC__Users/setup.js";
import competitions from "./assets/slashCommands/SC__Competitions/setup.js";


client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    client.user.setPresence({ activities: [{ name: 'Test mode' }], status: 'online' });
    setInterval(
        () => {
            console.log(".")
            functions.user.updateUsers();
        }, 15000
    )
});

client.login(token);

import pkg from "node:process"
import {channels} from "./assets/settings/channels.js";
const nodeProcess = pkg.process;

process.on('unhandledRejection', async(reason, promise) => {
    console.log('Unhandled rejection at:', promise, 'reason:', reason)
});
process.on("uncaughtException",  (err) => {
    console.log("Uncaught exception: ", err);
})
process.on("uncaughtExceptionMonitor",  (err, origin) => {
    console.log("Uncaught exception monitor: ", err, origin);
})


// somebody joined the server
client.on(Events.GuildMemberAdd, member => functions.listener.memberJoinListener(member));
// somebody left the server
client.on(Events.GuildMemberRemove, member => functions.listener.memberLeaveListener(member));

client.on(Events.InteractionCreate, (interaction) => functions.mainInteractionListener(interaction));

// somebody creates a message
client.on(Events.MessageCreate, message => functions.listener.messageCreateListener(message));



onSnapshot(doc(db, "ssbot", "soutěže"), (doc) => setTimeout(() => functions.listener.competitionListener(doc), 1000));
onSnapshot(doc(db, "ssbot", "informations"), (doc) => setTimeout(() => functions.listener.informationListener(doc), 1000));


new REST({version: '10'}).setToken(token).put(
    Routes.applicationCommands(clientId),
    {
        body:

            [
                // Slash commands
                help.slashCommand,
                sendMsg.slashCommand,
                createCategory.slashCommand,
                automod.slashCommand,
                users.slashCommand,
                competitions[0].slashCommand,
                competitions[1].slashCommand,
                // Context menus
                userInformations.contextMenu

            ]
    }
);