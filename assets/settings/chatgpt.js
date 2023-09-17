import axios from "axios";



export const ChatGPT = async (prompt) => {
    return new Promise(async (resolved, rejected) => {
        try {
            const body = {
                messages: [{
                    content: prompt,
                    role: 'user',
                }]
            };

            const dateBefore = Date.now();

            const fetch = await axios('https://ava-alpha-api.codelink.io/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(body)
            });

            const output = fetch.data;

            const splittedNonFiltered = output.split('\n');

            const splitted = [];

            for (let i = 0; i < splittedNonFiltered.length; i++) {
                if (splittedNonFiltered[i].length <= 0 || splittedNonFiltered[i] === '') continue;

                splitted.push('{' + splittedNonFiltered[i] + '}');
            };

            splitted.shift(); // Removes the first useless message, since it returns empty content string.

            const pattern = new RegExp(`\\{\\s*"content"\\s*:\\s*"([^"]*?)"\\s*\\}`, 'g');

            const final = [];

            splitted.forEach((input) => {
                const match = input.match(pattern);

                if (!match) return;

                final.push(match[0].split(':')[1].replace(/"|}/g, ''));
            });

            const dateAfter = Date.now();

            resolved({
                response: final.join(''),
                time: dateAfter - dateBefore
            });
        } catch (e) {
            rejected(e);
        };
    });
};
