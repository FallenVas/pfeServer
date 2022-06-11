const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const axios = require("axios").default;
const chartDataModel = require("./models/chartData");
const uri = process.env.MONGODB_URI;
const cron = require("node-cron");

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connection established");
  })
  .catch((err) => {
    console.log("Something wrong happened");
    console.log(err);
  });

cron.schedule("0 0 */24 * * *", () => {
    getChartDataDaily();
});
app.get("/getDataChart", async (req, res) => {
  const data = await chartDataModel.findOne();
  res.json(data.chartData);
});
const getChartDataDaily = async () => {
  const coins = [
    "BTC",
    "ETH",
    "USDT",
    "USDC",
    "BNB",
    "ADA",
    "XRP",
    "BUSD",
    "SOL",
    "DOGE",
  ];
  const chartData = [];
  const date = new Date();

  for (let j = 0; j < coins.length; j++) {
    axios({
      method: "get",
      url:
        `https://rest.coinapi.io/v1/exchangerate/${coins[j]}/USD/history?period_id=1DAY&limit=10&time_end=` +
        date.toISOString(),
      headers: { "X-CoinAPI-Key": process.env.COIN_API_KEY },
    })
      .then((response) => {
        const item = {};
        item.symbol = coins[j];
        item.data = [];
        for (let i = 0; i < response.data.length; i++) {
          item.data.push({
            day: i + 1,
            value: response.data[i].rate_close,
          });
        }
        chartData.push(item);
      })
      .catch((error) => {
        console.log(error);
      });
    await delay(3000);
  }
  const newChartData = new chartDataModel({ chartData });
  try {
    await chartDataModel.deleteMany({});
    await newChartData.save();
    console.log("saved");
  } catch (error) {
    console.log(error.message);
  }
};
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
