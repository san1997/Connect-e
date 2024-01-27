const { IgApiClient } = require("instagram-private-api");

const username = process.argv[2];
const msg = process.argv[3];

const postToInsta = async () => {
    try {
        const ig = new IgApiClient();
        ig.state.generateDevice("duets.app");
        await ig.account.login("duets.app", "boishome1");

        const userId = await ig.user.getIdByUsername(username);
        const thread = ig.entity.directThread([userId.toString()]);

        await thread.broadcastText(msg);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
};

const main = async () => {
    const result = await postToInsta();
    if (result) {
        console.log(`Message Sent Successfully`);
    } else {
        console.log(`Failed to send the message`);
    }
};

main();
