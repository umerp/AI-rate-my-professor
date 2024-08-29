import axios from "axios";

export const fetchChatHistory = async () => {
  try {
    const response = await axios.get(`/api/messages`);
    return response.data.messages;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
};

export const saveMessage = async (messages) => {
  try {
    await axios.post("/api/messages", { messages });
  } catch (error) {
    console.error("Error saving message:", error);
  }
};

