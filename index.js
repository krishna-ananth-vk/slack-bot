import express from "express";
import axios from "axios";

const CHANNEL_ID = process.env.CHANNEL_ID;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;


const app = express();

// Use middleware to parse URL-encoded data (if needed)
app.use(express.urlencoded({ extended: true }));

// Listen to all GET requests under "/slack/events/"
app.get("/slack/events/:event", async (req, res) => {
  const { event } = req.params; // Extract dynamic part from URL (e.g., 'standup')

  if (event === "standup") {
    try {
      // Simulate fetching event data (you can modify this to process other data as needed)
      const message = {
        channel: CHANNEL_ID,
        text: "@channel join standup online", // Message text
      };

      // If no events are found, return a message
      const response = await axios.post(
        "https://slack.com/api/chat.postMessage",
        message,
        {
          headers: {
            Authorization: `Bearer ${SLACK_BOT_TOKEN}`, // Authentication header
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.ok) {
        console.error("Slack API Error:", response.data.error);
        return res
          .status(500)
          .json({
            message: "Failed to send message to Slack.",
            channel: CHANNEL_ID,
          });
      }

      return res.json({
        message: "Message sent to Slack successfully.",
        slack_response: response.data,
      });
    } catch (err) {
      console.error("Server Error:", err);
      return res
        .status(500)
        .json({
          message: "An unexpected error occurred.",
          channel: CHANNEL_ID,
        });
    }
  } else {
    // Handle unknown or unsupported events
    return res
      .status(400)
      .json({ message: `Unsupported event type: ${event}` });
  }
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => console.log(`Slack bot is running on port ${PORT}`));
