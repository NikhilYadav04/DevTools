import { getFormattedDate } from "../helper/dateFormatter.js";
import { generateEncryptedID } from "../helper/encryptGenerate.js";
import { History } from "../models/history.js";

export const store = async (req, res) => {
  try {
    const { userID } = req.query;

    const { userLink, internalLinks,externalLinks,correctLinks, errorLinks, replacedLinks } = req.body;

    //* get the current date
    const date = getFormattedDate();

    //* generate the reportID
    const reportID = generateEncryptedID();

    let historySchema = await History.findOne({ userID });

    //* if no history record found make a new one
    const history = {
      date,
      reportID,
      userLink,
      internalLinks,
      externalLinks,
      correctLinks,
      errorLinks,
      replacedLinks,
    };

    if (!historySchema) {
      //* if no history record found make a new one
      const newHistory = new History({
        userID,
        links: [history],
      });

      await newHistory.save();
    } else {
      //* If history exists, push the new record to the array instead of overwriting
      historySchema.links.push(history);

      await historySchema.save();
    }

    return res.status(200).json({
      success: true,
      message: "Success",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: `Error : ${e.message}`,
    });
  }
};

export const get_history = async (req, res) => {
  try {
    const { userID } = req.query;

    const history = await History.findOne({ userID });

    return res.status(200).json({
      success: true,
      message: history.links,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: `Error : ${e.message}`,
    });
  }
};

export const delete_history = async (req, res) => {
  try {
    const { userID, reportID } = req.query;

    let historySchema = await History.findOne({ userID });

    //* create a new list with the reportID to be deleted
    const updatedLinks = historySchema.links.filter(
      (link) => link.reportID !== reportID
    );

    //* delete that link
    historySchema.links = updatedLinks;
    await historySchema.save();

    return res.status(200).json({
      success: true,
      message: "Success",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: `Error : ${e.message}`,
    });
  }
};

export const clear_history = async (req, res) => {
  try {
    const { userID } = req.query;

    let historySchema = await History.findOne({ userID });

    //* Clear the links array
    historySchema.links = [];
    await historySchema.save();

    return res.status(200).json({
      success: true,
      message: "Success",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: `Error : ${e.message}`,
    });
  }
};

export const scan_all = async (req, res) => {
  try {
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: `Error : ${e.message}`,
    });
  }
};
