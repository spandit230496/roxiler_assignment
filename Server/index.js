const express = require("express");
const conn = require("./Utils/dbutils");
const app = express();
const itemRoute = require("./Routes/ItemRoutes");
const cors = require("cors");

conn;

app.use(cors());
app.use(express.json());
app.use("/", itemRoute);

app.listen(5000, () => {
  console.log("server connected");
});
