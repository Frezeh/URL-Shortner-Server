const express = require("express");
const redirectRouter = express.Router();
const Url = require("../models/url");
const si = require("systeminformation");
const cors = require('./cors');
const { v4: uuidv4 } = require("uuid");

redirectRouter
  .route("/:id")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, async (req, res) => {
    try {
      const url = await Url.findOne({ urlCode: req.params.id });
      if (url) {
        const cpu = await si.cpu();
        const data = {
          date: new Date().toLocaleTimeString(),
          _id: uuidv4(),
          manufacturer: cpu.manufacturer,
          brand: cpu.brand,
          model: cpu.model,
          vendor: cpu.vendor,
          family: cpu.family,
          cores: cpu.cores,
          socket: cpu.socket
        }
        // const stats = 
        await Url.updateOne(
          {
            urlCode: req.params.id,
          },
          {
            $push: {
              history: {
                $each: [data],
                $position: 0,
              },
            },
          }
        );
        return res.status(200).redirect(url.longUrl);
      } else {
        return res.status(404).json("No Url found");
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json("Something went wrong");
    }
  });

module.exports = redirectRouter;
