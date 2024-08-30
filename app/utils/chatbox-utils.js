import axios from 'axios';

export const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  

export const handleScrapeUrl = async (url) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/scrapeAndUpsert", url);
      const data = await response.json();
      setLoading(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: `Successfully upserted ${data.upsertedCount} reviews from the provided URL.`,
        },
      ]);
    } catch (error) {
      console.error("Failed to scrape the URL:", error);
      setLoading(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "Failed to scrape the provided URL. Please try again.",
        },
      ]);
    }
  };
  
  export const handleSearchQuery = async (query) => {
    try {
      setLoading(true);
      const response = await fetch.post("/api/recommend", query);
      const data = await response.json();
      setLoading(false);
      const formattedResponse = data.topMatches
        .map(
          (match) =>
            `Professor: ${match.professor}\nSubject: ${match.subject}\nReview: ${match.review}\nStars: ${match.stars}\n\n`
        )
        .join("");
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: `Based on your query, here are the top matches:\n\n${formattedResponse}`,
        },
      ]);
    } catch (error) {
      console.error("Failed to process the search query:", error);
      setLoading(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "Failed to process the query. Please try again.",
        },
      ]);
    }
  };
  