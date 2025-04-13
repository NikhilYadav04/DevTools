import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  date: {
    required: true,
    type: String,
  },
  reportID: {
    required: true,
    type: String,
  },
  userLink: {
    required: true,
    type: [String],
  },
  internalLinks: {
    required: true,
    type: [String],
  },
  externalLinks: {
    required: true,
    type: [String],
  },
  correctLinks: {
    required: true,
    type: [String],
  },
  errorLinks: {
    required: true,
    type: [String],
  },
  replacedLinks: {
    required: true,
    type: [String],
  },
});

const historySchema = new mongoose.Schema({
  userID: {
    required: true,
    type: String,
  },
  links: [reportSchema],
});

export const History = mongoose.model("History", historySchema);
export const Report = mongoose.model("Report", reportSchema);
