import functions from "../../settings/functions.js";

const execute = async (interaction) => {

    functions.create.createRole("test", interaction.guild).then(
        role => {
            console.log(role);
            console.log(role.id);

        }
    )

    interaction.reply({content: "Hey???", ephemeral: true});
}

export default execute;