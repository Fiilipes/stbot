import functions from "../../settings/functions.js";

import answers from "../../settings/answers.js";

const execute = async (interaction) => {

    try {


        const subcommand = interaction.options.getSubcommand() ? interaction.options.getSubcommand() : undefined;
        const user = interaction.options.getUser('user') ? interaction.options.getUser('user') : undefined;
        const channel = interaction.options.getChannel('channel') ? interaction.options.getChannel('channel') : undefined;
        const message = interaction.options.getString('message') ? interaction.options.getString('message') : undefined;

        switch (subcommand) {
            case 'guild':

                if (channel) {
                    await functions.sendMessageToChannel(
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
                            ).catch(
                                async (error) => {
                                    await interaction.reply(answers.errorOccurred(error, functions.getCurrentFilePath()))
                                }
                            )
                        }
                    ).catch(
                        async (error) => {
                            await interaction.reply(answers.errorOccurred(error, functions.getCurrentFilePath()))
                        }
                    )
                } else {
                    answers.alert("Channel is undefined.").then(
                        async (answer) => {
                            await interaction.reply(answer)
                        }
                    ).catch(
                        async (error) => {
                            await interaction.reply(answers.errorOccurred(error, functions.getCurrentFilePath()))
                        }
                    )
                }

                break;
            case 'dm':
                if (user) {
                    if (!user.bot) {
                        await functions.sendMessageToUser(
                            user,
                            message,
                        ).then(
                            async (sentMessage) => {
                                answers.messageSentToUser(
                                    user,
                                    sentMessage
                                ).then(
                                    async (answer) => {
                                        await interaction.reply(answer)
                                    }
                                ).catch(
                                    async (error) => {
                                        await interaction.reply(answers.errorOccurred(error, functions.getCurrentFilePath()))
                                    }
                                )
                            }
                        ).catch(
                            async (error) => {
                                await interaction.reply(answers.errorOccurred(error, functions.getCurrentFilePath()))
                            }
                        )
                    } else {
                        answers.alert("You cannot send messages to bots.").then(
                            async (answer) => {
                                await interaction.reply(answer)
                            }
                        ).catch(
                            async (error) => {
                                await interaction.reply(answers.errorOccurred(error, functions.getCurrentFilePath()))
                            }
                        )
                    }
                } else {
                    answers.alert("User is undefined.").then(
                        async (answer) => {
                            await interaction.reply(answer)
                        }
                    ).catch(
                        async (error) => {
                            await interaction.reply(answers.errorOccurred(error, functions.getCurrentFilePath()))
                        }
                    )
                }
        }

    } catch (error) {
        answers.errorOccurred(error, functions.getCurrentFilePath()).then(
            async (answer) => {
                await interaction.reply(answer)
            }
        ).catch(
            async (error) => {
                await interaction.reply(answers.errorOccurred(error, functions.getCurrentFilePath()))
            }
        )
    }

}

export default execute;