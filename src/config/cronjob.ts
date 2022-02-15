const cron = require("node-cron");
import shell = require(shelljs);
import { sendEmailJob } from "./mailer";

export const startCron = () => {
    console.log("Cron job is running...");
    cron.schdule("0 0 * * mon", async function () {
        console.log("Sending email");
        await sendEmailJob();

    });
};

