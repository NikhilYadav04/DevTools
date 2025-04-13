import axios from "axios";
import env from "dotenv";

const GEMINI_URL = process.env.GEMINI_URL;
const CRAWLER_URL = process.env.CRAWL_URL;

export const website = async (req, res) => {
  try {
    const { url, max_pages, category } = req.query;
    console.log(url);
    console.log(max_pages);

    const response = await axios.post(CRAWLER_URL, {
      url,
      max_pages,
      category,
    });

    const success = [];
    const error = [];
    const internal = [];
    const external = [];

    let list = response.data.links;

    if (!list.length) {
      return res.status(404).json({
        success: false,
        message: "Error Checking Links,Please Try Again.",
      });
    }

    //* filter out broken links and working links
    list.forEach((item) => {
      (item.status_code === 200 || item.status_code === null
        ? success
        : error
      ).push({ url: item.url });
    });

    list.forEach((item) => {
      (item.source === "external" ? internal : external).push({
        url: item.url,
      });
    });

    res.status(200).json({
      success: true,
      userLink: url,
      successLinks: success,
      errorLinks: error,
      internalLinks: internal,
      externalLinks: external,
      successCount: success.length,
      errorCount: error.length,
      internalCount: internal.length,
      externalCount: external.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const ask = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res
        .status(400)
        .json({ success: false, error: "Prompt is required" });
    }

    const response = await axios.post(GEMINI_URL, { prompt });

    res.status(200).json({
      success: true,
      response: response.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
