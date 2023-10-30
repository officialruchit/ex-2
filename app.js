const express = require("express");
const app = express();
app.use(express.static(__dirname));
app.use(express.json());

const model = require("./model");

const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: false }));

const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/demo";
mongoose
  .connect(url)
  .then(() => console.log("connect"))
  .catch(() => {
    console.log("err");
  });
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/data", async (req, res) => {
  res.json(await model.find());
});
app.post("/data", async (req, res) => {
  const { name, price, qty } = req.body;
  const data = new model({
    name,
    price,
    qty,
  });
  await data.save();
  res.json(await model.find());
});
app.del("/data/:id", async (req, res) => {
  const dd = await model.findByIdAndRemove(req.params.id);
  res.json(dd);
});
app.put("/data/:id", async (req, res) => {
  const { name, price, qty } = req.body;
  const data = {
    name,
    price,
    qty,
  };
  const dd = await model.findByIdAndUpdate(req.params.id, data, { new: true });
  res.json(dd);
});

app.listen(4444, () => {
  console.log("done");
});
