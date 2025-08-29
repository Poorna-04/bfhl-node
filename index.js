const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

// --------- Config (edit or set as ENV vars) ---------
const FULL_NAME = (process.env.FULL_NAME || "john doe").toLowerCase();
const DOB_DDMMYYYY = process.env.DOB_DDMMYYYY || "17091999";
const EMAIL = process.env.EMAIL || "john@xyz.com";
const ROLL_NUMBER = process.env.ROLL_NUMBER || "ABCD123";
// -----------------------------------------------------

// Helper: build user_id
const buildUserId = (fullName, dob) => {
  return fullName.trim().replace(/\s+/g, "_") + "_" + dob;
};

// Helper: alternating caps
const alternatingCaps = (str) => {
  return str
    .split("")
    .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join("");
};

app.get("/bfhl", (req, res) => {
  res.json({ operation_code: 1 });
});

app.post("/bfhl", (req, res) => {
  try {
    const data = req.body.data || [];

    let even_numbers = [];
    let odd_numbers = [];
    let alphabets = [];
    let special_characters = [];
    let totalSum = 0;

    data.forEach((item) => {
      if (/^\d+$/.test(item)) {
        let num = parseInt(item);
        totalSum += num;
        if (num % 2 === 0) {
          even_numbers.push(item);
        } else {
          odd_numbers.push(item);
        }
      } else if (/^[a-zA-Z]+$/.test(item)) {
        alphabets.push(item.toUpperCase());
      } else {
        special_characters.push(item);
      }
    });

    // Collect all alphabetic chars from input, reverse, alternating caps
    let allAlphaChars = data
      .join("")
      .split("")
      .filter((ch) => /[a-zA-Z]/.test(ch));
    let concat_string = alternatingCaps(allAlphaChars.reverse().join(""));

    res.json({
      is_success: true,
      user_id: buildUserId(FULL_NAME, DOB_DDMMYYYY),
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: totalSum.toString(),
      concat_string,
    });
  } catch (err) {
    res.json({
      is_success: false,
      user_id: buildUserId(FULL_NAME, DOB_DDMMYYYY),
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: "",
      error: err.message,
    });
  }
});

// Hosting PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BFHL API running on port ${PORT}`);
});
