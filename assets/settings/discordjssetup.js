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
                GatewayIntentBits.GuildVoiceStates

            ],
        partials:
            [

                Partials.Channel,
                Partials.Message

            ]
    }
);

export default client;