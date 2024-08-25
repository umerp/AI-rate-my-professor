import axios from 'axios';

export const fetchChatHistory = async () => {
  try {
    const response = await axios.get(`/api/fetchMessage`);
    return response.data.messages;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
};

export const saveMessage = async (message) => {
  try {
    await axios.post("/api/saveMessage", { message });
  } catch (error) {
    console.error("Error saving message:", error);
  }
};

export const fetchBotResponse = async (lastUserMessage) => {
  try {
    const res = await axios.post("/api/sendMessage", {
      message: lastUserMessage,
    });
    return res.data.reply || "Sorry I couldn't process that.";
  } catch (error) {
    console.error("Error fetching response:", error);
    return "Sorry I couldn't process that.";
  }
};
