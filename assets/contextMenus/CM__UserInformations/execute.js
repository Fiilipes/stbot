import functions from "../../settings/functions.js";
import templates from "../../settings/templates.js";

const execute = async (interaction) => {

    await functions.createEmbeds(templates.embeds.userInformations(interaction.targetUser)).then(
        embeds => interaction.reply({
            embeds: embeds,
            ephemeral: true
        })

    )
}

export default execute;