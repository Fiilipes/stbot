import templates from "../../settings/templates.js";
import functions from "../../settings/functions.js";
import answers from "../../settings/answers.js";

const execute = async (interaction, competitionsClass) => {

    const subcommand = interaction.options.getSubcommand();
    const type = interaction.options.getString("type");

    switch (subcommand) {
        case "add": {

            await competitionsClass.addCompetition(interaction, type)

        }
    }




}

export default execute;