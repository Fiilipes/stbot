import templates from "../../settings/templates.js";
import functions from "../../settings/functions.js";
import answers from "../../settings/answers.js";

const execute = async (interaction) => {
    // answers.help().then(
    //     answer => {
    //         interaction.reply(answer);
    //
    //     }
    // )

    const query = interaction.options.getString("query");
    await interaction.reply({
        content:`You selected **${query}** guild`, ephemeral: true
    })




}

export default execute;