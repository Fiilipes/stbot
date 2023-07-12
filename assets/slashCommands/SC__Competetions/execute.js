import answers from "../../settings/answers.js";
import functions from "../../settings/functions.js";
import client from "../../settings/discordjssetup.js";
import {Events} from "discord.js";
import createQuestionModal from "./(functions)/questionsModal.js";
import QuestionsModal from "./(functions)/questionsModal.js";

const execute = async (interaction) => {
    try {
        const subcommand = interaction.options.getSubcommand();

        const type = interaction.options.getString('type') ? interaction.options.getString('type') : undefined;

        switch (subcommand) {
            case 'create':
                if (type) {
                    switch (type) {
                        case 'soutez':

                            /*

                            1. Modal
                            - Název soutěže
                            - Začátek registrace (optional)
                            - Konec registrace (optional)
                            - Datum konání soutěže

                            2. Optional Select Menus

                            - vybrat lidi do soutěže
                            - vytvořit soutěži channel?
                            - vytvořit pro soutěž notes dokument?
                            - může se joinout kdokoliv?
                            - přidat odkazy k soutěži

                             */

                            const customId = interaction.user.id + "-" + "create-competition-modal";
                            const questions = {
                                questionsModal: [
                                    {
                                        customId: "name",
                                        label: "Název soutěže",
                                        placeholder: "Název soutěže",
                                        style: "paragraph"
                                    }
                                ],
                                selectMenus: [
                                    {

                                    }
                                ]
                            }

                            const answers = {
                                questionsModal: [],
                                selectMenus: []
                            }

                            QuestionsModal(interaction, customId, questions.questionsModal)

                            client.on(Events.InteractionCreate, async interaction => {
                                if (interaction.isModalSubmit()) {
                                    if (interaction.customId === customId) {
                                        await interaction.reply("Modal submitted.")
                                        questions.questionsModal.forEach(question => {
                                            answers.questionsModal.push({
                                                customId: question.customId,
                                                value: interaction.fields.getTextInputValue(question.customId)
                                            })
                                        })

                                        console.log(answers.questionsModal)
                                    }
                                }
                            })




                            break;
                        case 'korespondencni-seminar':
                            break;
                        case 'soustredeni':
                            break;
                        default:
                            answers.alert("Type is invalid.").then(
                                async (answer) => {
                                    await interaction.reply(answer)
                                }
                            ).catch(
                                async (error) => {
                                    await interaction.reply(answers.errorOccurred(error, functions.getCurrentFilePath()))
                                }
                            )
                            break;
                    }
                } else {
                    answers.alert("Type is undefined.").then(
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