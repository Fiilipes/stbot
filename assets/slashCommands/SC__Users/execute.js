import db, {getSS} from "../../settings/firebase.js";
import answers from "../../settings/answers.js";
import functions from "../../settings/functions.js";
import roles from "../../settings/roles.js";
import {doc, setDoc} from "firebase/firestore";
import templates from "../../settings/templates.js";
import {channels} from "../../settings/channels.js";

const execute = async (interaction) => {

    const subcommand = interaction.options.getSubcommand();
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") ? interaction.options.getString("reason") : null;
    const time = interaction.options.getString("time") ? interaction.options.getString("time") : null;
    const deleteMessages = interaction.options.getString("delete-messages") ? interaction.options.getString("delete-messages") : null;

    let banSeconds = 0;
    switch (deleteMessages) {
        case "any": banSeconds = 0; break;
        case "hour": banSeconds = 3600; break;
        case "6hours": banSeconds = 21600; break;
        case "12hours": banSeconds = 43200; break;
        case "1": banSeconds = 86400; break;
        case "3": banSeconds = 259200; break;
        case "7": banSeconds = 604800; break;
		default: banSeconds = 0;
    }


    if (await functions.checkIfHasRole(interaction.member, roles.ateam)) {
        let userInDatabase
        let indexOfUserInDatabase
        let users
        getSS(["users"]).then(res => {

            users = res["users"].users;

            userInDatabase = users.list.find(userInDatabase => userInDatabase.discordID === user.id);
            indexOfUserInDatabase = users.list.indexOf(userInDatabase);


            if (userInDatabase) {
                try {

                    switch (subcommand) {
                        case "ban":

                            console.log("hello")
                            console.log(user)

                            interaction.reply(answers.userBanned(user, reason))

                            functions.banUser(user, reason, interaction, banSeconds)


                            break;
                        case "kick":
                            console.log("------------------------------------------------------------")
                            console.log(user)
                            // interaction.reply(answers.userKicked(user, reason))
                            //
                            // functions.kickUser(user, reason, interaction)

                            break;
                        case "mute":
                            console.log("mute");

                            break;
                        case "unmute":
                            console.log("unmute");

                            break;
                        case "warn":
                            console.log("warn");

                            break;
                        case "verify":
                            console.log("verify");

                            break;
                        case "unverify":
                            console.log("unverify");

                            break;
                        case "info":
                            console.log("info");

                            break;
                        default:
                            console.log("default");
                    }

                } catch (error) {
                    console.log(error);
                }
            } else {
                interaction.reply(answers.notInDatabase);
            }

        })



    } else {
        interaction.reply(answers.notPermitted)
    }
}

export default execute;