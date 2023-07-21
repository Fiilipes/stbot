import {PermissionsBitField} from "discord.js";

const execute = async (interaction) => {

    const {guild, options} = interaction;
    const sub = options.getSubcommand();

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        interaction.reply({content: "You don't have permission to use this command!", ephemeral: true});
        return;
    }

    switch (sub) {
        case "flagged-words":
            await interaction.reply({content: "Loading", ephemeral: true});

            const rule = await guild.autoModerationRules.create({
                name: "Block profanity, sexual content and slurs by Soutěže tryhard bot",
                creatorId: "1130814174889508954",
                enabled: true,
                eventType: 1,
                triggerType: 4,
                triggerMetadata: {
                    presets: [1, 2, 3]
                },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: "This message was prevented by Soutěže tryhard bot auto moderation"
                        }
                    }
                ]
            }).catch(
                async error => {
                    setTimeout(
                        async () => {
                            console.log(error)
                            await interaction.editReply({content: error, ephemeral: true});
                        }, 2000
                    )
                }
            )

            setTimeout(
                async () => {
                    if (!rule) return;

                    await interaction.editReply({content: "Done!", ephemeral: true});

                }, 3000
            )

            break;
        case "keyword":
            await interaction.reply({content: "Loading", ephemeral: true});

            const word = options.getString("word");

            const rule2 = await guild.autoModerationRules.create({
                name: "Prevent the word" + word + " from being used by Soutěže tryhard bot",
                creatorId: "1130814174889508954",
                enabled: true,
                eventType: 1,
                triggerType: 1,
                triggerMetadata: {
                    keywordFilter: [word]
                },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: "This message was prevented by Soutěže tryhard bot auto moderation"
                        }
                    }
                ]
            }).catch(
                async error => {
                    setTimeout(
                        async () => {
                            console.log(error)
                            await interaction.editReply({content: error, ephemeral: true});
                        }, 2000
                    )
                }
            )

            setTimeout(
                async () => {
                    if (!rule2) return;

                    await interaction.editReply({content: "Done! yeah", ephemeral: true});

                }, 3000
            )

            break;

        case "spam-messages":
            await interaction.reply({content: "Loading", ephemeral: true});


            const rule3 = await guild.autoModerationRules.create({
                name: "Prevent spam messages by Soutěže tryhard bot",
                creatorId: "1130814174889508954",
                enabled: true,
                eventType: 1,
                triggerType: 3,
                // triggerMetadata: {
                //     mentionTotalLimit: number
                // },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: "This message was prevented by Soutěže tryhard bot auto moderation"
                        }
                    }
                ]
            }).catch(
                async error => {
                    setTimeout(
                        async () => {
                            console.log(error)
                            await interaction.editReply({content: error, ephemeral: true});
                        }, 2000
                    )
                }
            )

            setTimeout(
                async () => {
                    if (!rule3) return;

                    await interaction.editReply({content: "Done! spam", ephemeral: true});

                }, 3000
            )

            break;

            case "mention-spam":
                await interaction.reply({content: "Loading", ephemeral: true});

                const number = options.getInteger("number");

                const rule4 = await guild.autoModerationRules.create({
                    name: "Prevent spam mentions by Soutěže tryhard bot",
                    creatorId: "1131016160045977640",
                    enabled: true,
                    eventType: 1,
                    triggerType: 5,
                    triggerMetadata: {
                        mentionTotalLimit: number
                    },
                    actions: [
                        {
                            type: 1,
                            metadata: {
                                channel: interaction.channel,
                                durationSeconds: 10,
                                customMessage: "This message was prevented by Soutěže tryhard bot auto moderation"
                            }
                        }
                    ]
                }).catch(
                    async error => {
                        setTimeout(
                            async () => {
                                console.log(error)
                                await interaction.editReply({content: error, ephemeral: true});
                            }, 2000
                        )
                    }
                )

                setTimeout(
                    async () => {
                        if (!rule4) return;

                        await interaction.editReply({content: "Done! mention spam", ephemeral: true});

                    }, 3000
                )

                break;

    }

}

export default execute;