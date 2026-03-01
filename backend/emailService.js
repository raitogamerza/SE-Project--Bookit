const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');

// This service connects to Gmail via IMAP and looks for unread bank emails
// specifically targeting KBank's format (or general transfer formats)
// that contain the decimal amount we expect.

async function checkRecentEmails(expectedAmount, emailUser, emailPass) {
    if (!emailUser || !emailPass) {
        throw new Error("Missing EMAIL_USER or EMAIL_PASS in environment variables.");
    }

    const config = {
        imap: {
            user: emailUser,
            password: emailPass,
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            authTimeout: 3000,
            tlsOptions: { rejectUnauthorized: false }
        }
    };

    try {
        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');

        // Search criteria: Unread emails from today
        const delay = 24 * 3600 * 1000; // 1 day in milliseconds
        const yesterday = new Date();
        yesterday.setTime(Date.now() - delay);
        const searchCriteria = ['UNSEEN', ['SINCE', yesterday.toISOString()]];

        // Fetch bodies of the messages
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false
        };

        const results = await connection.search(searchCriteria, fetchOptions);

        for (let item of results) {
            const all = item.parts.find(part => part.which === 'TEXT');
            const id = item.attributes.uid;
            const idHeader = "Imap-Id: " + id + "\r\n";

            try {
                const parsed = await simpleParser(idHeader + all.body);
                const textContent = parsed.text || '';
                const htmlContent = parsed.html || '';

                // Combine text and HTML to increase chances of finding the amount
                const fullContent = (textContent + " " + htmlContent).toLowerCase();

                // We are looking for the exact decimal amount string in the email body
                const amountStr = Number(expectedAmount).toFixed(2);

                // Regex to find amounts like: 100.25, 1,000.50, 100.25 ฿, 100.25 บาท
                // It looks for digits, optional commas, a period, and two digits
                const regexPattern = /[0-9]{1,3}(?:,[0-9]{3})*\.[0-9]{2}/g;
                const matches = fullContent.match(regexPattern);

                if (matches) {
                    // Normalize matches (remove commas) and check if any match our expected amount
                    const foundMatch = matches.some(match => {
                        const cleanMatch = match.replace(/,/g, '');
                        return cleanMatch === amountStr;
                    });

                    if (foundMatch) {
                        console.log(`[EmailService] Valid payment found for amount: ${amountStr}`);
                        // Found a match! Mark email as read so we don't process it again for another order
                        await connection.addFlags(id, ['\\Seen']);
                        connection.end();
                        return true;
                    }
                }
            } catch (parseErr) {
                console.error("[EmailService] Error parsing email body:", parseErr);
            }
        }

        connection.end();
        return false;

    } catch (err) {
        console.error("IMAP Connection Error:", err);
        return false;
    }
}

module.exports = { checkRecentEmails };
