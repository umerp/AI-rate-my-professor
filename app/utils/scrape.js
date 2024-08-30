export async function scrapeProfessorData(url) {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
  
      const reviews = [];
      $(".Rating__RatingBody-sc-1rhvpxz-0").each((i, element) => {
        const review = $(element)
          .find(".Comments__StyledComments-dzzyvm-0")
          .text()
          .trim();
        const subject = $(element)
          .find(".RatingHeader__StyledClass-sc-1nlhx7j-0")
          .text()
          .trim();
        const stars = $(element)
          .find(".RatingHeader__StyledClass-sc-1nlhx7j-0")
          .text()
          .trim().length;
  
        reviews.push({
          review,
          subject,
          stars,
        });
      });
  
      return reviews;
    } catch (error) {
      console.error("Error scraping data:", error);
      return [];
    }
  }