import functions from "../../settings/functions.js";

const execute = async (interaction) => {

    await functions.user.showUserInformation(interaction.targetUser, interaction)
}

export default execute;