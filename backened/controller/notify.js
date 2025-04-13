import { minutesToCron } from "../services/cronMinuteConvert.js";
import { transporter } from "../services/nodemailer.js";
import cron from "node-cron";
import axios from "axios";

export const send_email = async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    transporter.sendMail({
      to: to,
      subject: subject,
      html: body,
    });

    return res.status(200).json({
      message: "Email Sent Successfully",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: `Error : ${e.message}`,
    });
  }
};

export const schedule = async (req, res) => {
  try {
    let { minutes, url,max_pages, category,email } = req.query;

    minutes = parseInt(minutes, 10);
    max_pages = parseInt(max_pages,10);

    //* Calculate execution time
    const executionTime = new Date(Date.now() + minutes * 60 * 1000);
    const cronExpression = `${executionTime.getMinutes()} ${executionTime.getHours()} ${executionTime.getDate()} ${
      executionTime.getMonth() + 1
    } *`;

    //* Start the cron job

    const job = cron.schedule(
      cronExpression,
      async () => {
        //* scan the link

        const response = await axios.post(
          `http://127.0.0.1:3000/scan/website?url=${url}&max_pages=${max_pages}&category=${category}`
        );

        const successCount = response.data.successCount;
        const failedCount = response.data.errorCount;

        const shortUrl = new URL(url).hostname; // Extracts only the domain (e.g., example.com)

        console.log(successCount);

        //* send email with results to user

        await axios.post("http://localhost:3000/notify/send-email", {
          to: email,
          subject: `Scan successful for ${shortUrl}`,
          body: `Your website has been scanned.\n
        ✅ ${successCount} links are working.\n
        ❌ ${failedCount} links are broken or not working.\n
        🔗 Click the link below to see the full results:\n${url}`,
        });

        job.stop();
      },
      { scheduled: true }
    );

    return res.status(200).json({
      success: true,
      message: "Reminder Scheduled",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: `Error : ${e.message}`,
    });
  }
};
