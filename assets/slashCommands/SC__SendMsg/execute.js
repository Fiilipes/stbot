import {createEmbeds, getCurrentFilePath, sendMessageToChannel, sendMessageToUser} from "../../settings/functions.js";
import images from "../../settings/images.js";
import links from "../../settings/links.js";
import answers from "../../settings/answers.js";

const execute = async (interaction) => {

    try {
        const subcommand = interaction.options.getSubcommand();

        const user = interaction.options.getUser('user') ? interaction.options.getUser('user') : undefined;
        const channel = interaction.options.getChannel('channel') ? interaction.options.getChannel('channel') : undefined;
        const message = interaction.options.getString('message') ? interaction.options.getString('message') : undefined;

        if (!user.bot) {
            switch (subcommand) {
                case 'guild':

                    if (channel) {
                        await sendMessageToChannel(
                            channel,
                            message,
                        ).then(
                            async (sentMessage) => {
                                answers.messageSentInChannel(
                                    channel,
                                    sentMessage
                                ).then(
                                    async (answer) => {
                                        await interaction.reply(answer)
                                    }
                                )
                            }
                        )
                    } else {
                        await interaction.reply(answers.errorOccurred("Channel is undefined", "SC__SendMsg"))
                    }

                    break;
                case 'dm':
                    if (user) {
                        await sendMessageToUser(
                            user,
                            message,
                        ).then(
                            async (sentMessage) => {
                                answers.messageSentToUser(
                                    user,
                                    sentMessage
                                ).then(
                                    async (answer) => {
                                        console.log(answer)
                                        await interaction.reply(answer)
                                    }
                                )
                            }
                        )
                    } else {
                        await interaction.reply(answers.errorOccurred("User is undefined", "SC__SendMsg"))
                    }
            }
        } else {
            answers.errorOccurred("You cannot send messages to bots", getCurrentFilePath()).then(
                async (answer) => {
                    await interaction.reply(answer)
                }
            )
        }




    } catch (error) {
        answers.errorOccurred(error, getCurrentFilePath()).then(
            async (answer) => {
                await interaction.reply(answer)
            }
        )
    }

}

export default execute;