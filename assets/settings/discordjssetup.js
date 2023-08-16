import {Client, GatewayIntentBits, Partials} from "discord.js";

const client = new Client(
    {
        intents:
            [

                GatewayIntentBits.Guilds,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildWebhooks,

            ],
        partials:
            [

                Partials.Channel,
                Partials.Message

            ]
    }
);

export default client;