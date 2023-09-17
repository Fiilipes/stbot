import dotenv from 'dotenv';
import functions from "./functions.js";
dotenv.config();
const guildId = process.env.GUILD_ID;

class CompetitionsClass {
    constructor(props) {
        this.activeSessions = []
    }

    async addCompetition(interaction, type) {
        console.log(type)

        switch (type) {
            case "jednokolová_soutěž": {
                await functions.create.createModal(type, "Vytváření Jednokolové Soutěže", [
                    {
                        customId: "competition_name",
                        placeholder: "Zde napište jak by se soutěž měla jmenovat",
                        label: "Název soutěže",
                        style: "short"
                    }
                ]).then(
                    async modal => {
                        interaction.showModal(modal)
                    }
                )

                break;
            }
            case "vícekolová_soutěž": {
                await functions.create.createModal(type, "Vytváření Vícekolové Soutěže", [
                    {
                        customId: "competition_name",
                        placeholder: "Zde napište jak by se soutěž měla jmenovat",
                        label: "Název soutěže",
                        style: "short"
                    }
                ]).then(
                    async modal => {
                        interaction.showModal(modal)
                    }
                )
                break;
            }
        }
    }

}

export default CompetitionsClass;