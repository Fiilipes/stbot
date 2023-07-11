import functions from "../../settings/functions.js";

const execute = async (interaction) => {

    functions.createRole("test", interaction).then(
        role => {
            console.log(role);
            console.log(role.id);

        }
    )

    interaction.reply({content: "Hey???", ephemeral: true});
}

export default execute;