const express = require("express");
const urlRouter = express.Router();
const validUrl = require("valid-url");
const shortid = require("shortid");
const dotenv = require("dotenv");
const cors = require('./cors');
const Url = require("../models/url");

dotenv.config();

/* GET Url. */
urlRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .post(cors.cors, async (req, res) => {
    const { longUrl } = req.body;
    const baseUrl = process.env.BASEURL;
    const urlCode = shortid.generate();

    // Check to see if baseUrl is a valid domain name
    if (!validUrl.isUri(baseUrl)) {
      return res.status(401).json("Invalid base url");
    }

    // Validate longUrl and generate short URL here
    if (validUrl.isUri(longUrl)) {
      try {
        let url = await Url.findOne({ longUrl });

        if (url) {
          res.json(url);
        } else {
          const shortUrl = baseUrl + "/" + urlCode;

          url = new Url({
            longUrl,
            shortUrl,
            urlCode,
            date: new Date().toLocaleTimeString(),
          });

          await url.save();

          res.json(url);
        }
      } catch (err) {
        console.error(err.message);
        res.status(500).json("Something went wrong");
      }
    } else {
      res.status(401).json("Invalid Url");
    }
  });

module.exports = urlRouter;
