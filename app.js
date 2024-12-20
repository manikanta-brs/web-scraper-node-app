const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
const port = 4005;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const amazonURL =
    "https://www.amazon.in/gp/browse.html?node=4092115031&ref_=nav_em_sbc_tvelec_gaming_consoles_0_2_9_12";

  try {
    // Fetch the HTML content of the page
    const { data } = await axios.get(amazonURL);

    // Load the HTML into cheerio
    const $ = cheerio.load(data);

    // Extract the data
    const items = [];
    $(".a-section.octopus-pc-card-content .a-list-item").each(
      (index, element) => {
        const title = $(element).find(".octopus-pc-asin-title").text().trim();
        const price = $(element).find(".a-price .a-offscreen").text().trim();
        const imageURL = $(element).find("img").attr("src");

        // Push the extracted data into an array
        items.push({ title, price, imageURL });
      }
    );

    // Log the extracted data
    console.log(items);

    // Render the data to the view
    res.render("index", { data: items });
  } catch (error) {
    console.error("Error scraping the website:", error);
    res.status(500).send("Error scraping the website.");
  }
});

app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
