import { generateStreamToken } from "../config/stream.js";

export const getStreamToken = async (req, res) => {
  try {
    const token = await generateStreamToken(req.auth().userId);
    res.status(200).json({
      token: token,
    });
  } catch (error) {
    console.error("Error generating token for the User: ", error);
    res.status(500).json({
      message: "Failed to generate Stream token",
    });
  }
};
