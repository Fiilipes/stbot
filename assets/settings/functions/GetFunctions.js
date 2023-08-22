import client from "../discordjssetup.js";
import dotenv from 'dotenv';
dotenv.config();
const guildId = process.env.GUILD_ID;

const sources = [
    { title: 'Datum vzniku', keywords: ['kdy', 'vznik', "začátek", "počátky", "datum"] },
    { title: 'Vedení server', keywords: ['kdo', 'vedení', "admin", "owner", "helper", "moderátor", "a-team"] },
    // ... další zdroje
];
export default class GetFunctions {
    async getChannelById(id)  {
        return client.channels.cache.get(id)
    }
    getMemberById(id)  {
        return client.guilds.cache.get(guildId).members.cache.get(id)
    }
    getCurrentFilePath() {
        try {
            return "/assets" + new Error().stack.split('\n')[2].trim().replace(/^at /, '').split("/assets")[1].split(".js")[0].concat(".js");
        } catch (e) {
            console.log(e);
        }
    }
    extractKeywordsFromQuestion(question) {
        // Předpokládejme, že máte pole stop slov
        const stopWords = ['jak', 's', 'v', 'se', 'na', 'a', 'je', 'co', 'pro', 's', 'do'];

        // Převedeme otázku na malá písmena a rozdělíme na slova
        const words = question.toLowerCase().split(' ');

        // Filtrujeme stop slova a krátká slova (např. slova s méně než 3 písmeny)
        const filteredKeywords = words.filter(word => !stopWords.includes(word) && word.length >= 3);

        // Můžete provést další úpravy, jako odstranění diakritiky, specialních znaků, apod.

        // Vrátíme pole klíčových slov
        return filteredKeywords;
    }
    countMatchingKeywords(keywordsA, keywordsB) {
        // Vytvoříme množiny klíčových slov pro snazší manipulaci
        const setA = new Set(keywordsA);
        const setB = new Set(keywordsB);

        // Spočítáme počet shodujících se klíčových slov
        let matchCount = 0;
        for (const keyword of setA) {
            if (setB.has(keyword.toLowerCase())) {
                matchCount++;
            }
        }

        return matchCount;
    }

    findMostRelevantSource(question) {
        const questionKeywords = this.extractKeywordsFromQuestion(question);

        let bestSource = null;
        let bestMatchCount = 0;

        sources.forEach(source => {
            const matchCount = this.countMatchingKeywords(questionKeywords, source.keywords);
            if (matchCount > bestMatchCount) {
                bestMatchCount = matchCount;
                bestSource = source;
            }
        });

        return [bestSource, bestMatchCount];
    }

}