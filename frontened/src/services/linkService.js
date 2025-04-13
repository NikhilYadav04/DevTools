import axios from "axios";

const API_URL = "http://localhost:3000";

export const scanWebsite = async ({ userLink, maxPage, category }) => {
  console.log("🟢 scanWebsite called with:", { userLink, category, maxPage });

  const response = await axios.post(
    `${API_URL}/scan/website?url=${userLink}&max_pages=${maxPage}&category=${category}`
  );
  console.log(response.data);

  return response.data;
};

export const notifyWebsite = async ({
  futureMinutes,
  userLink,
  email,
  maxPage,
  category,
}) => {
  console.log(futureMinutes, userLink, email, maxPage, category);
  const response = await axios.post(
    `${API_URL}/notify/schedule?minutes=${futureMinutes}&url=${userLink}&email=${email}&max_pages=${maxPage}&category=${category}`
  );

  return response.data;
};

export const getGeminiReplacement = async (errorLinks) => {
  const prompt = `Given below is a list of broken website links: ${JSON.stringify(
    errorLinks
  )}. Provide a corrected list of URLs. Fix spelling mistakes in URLs. If a direct replacement is unavailable, return 'no' in its place. Respond only with a JavaScript array of strings.`;

  const response = await axios.post(`${API_URL}/scan/ask`, { prompt });

  console.log(response.data);

  return response.data;
};

export const saveToHistory = async ({
  userID,
  userLink,
  correctLinks,
  errorLinks,
  replacedLinks,
  internalLinks,
  externalLinks,
}) => {
  const response = await axios.post(
    `${API_URL}/history/store?userID=${userID}`,
    {
      userLink,
      correctLinks,
      errorLinks,
      replacedLinks,
      internalLinks,
      externalLinks,
    }
  );

  return response.data;
};
