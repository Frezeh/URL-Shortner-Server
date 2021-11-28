const express = require("express");
const historyRouter = express.Router();
const Url = require("../models/url");
const cors = require("./cors");

historyRouter
  .route("/:id")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, async (req, res) => {
    try {
      const url = await Url.findOne({ urlCode: req.params.id });
      if (url) {
        return res.status(200).send(url.history);
      } else {
        return res.status(404).json("No Url found");
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json("Something went wrong");
    }
  });

module.exports = historyRouter;
