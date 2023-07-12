import functions from "../../../settings/functions.js";
import answers from "../../../settings/answers.js";

const QuestionsModal = (interaction, customId, questions) => {
    try {
        functions.createModal(customId, "Vytvoření soutěže", questions).then(
            async (modal) => {
                await interaction.showModal(modal)
            }
        ).catch(
            async (error) => {
                await interaction.reply(answers.errorOccurred(error, functions.getCurrentFilePath()))
            }
        )
    } catch (error) {
        interaction.reply(answers.errorOccurred(error, functions.getCurrentFilePath()));
    }
}

export default QuestionsModal;