const route = require("express").Router();
const {
  getAllItem,
  getStats,
  getChart,
  getDescription,
  getCombinedData,
  searchItems,
} = require("../Controller/itemController.js");

route.get("/get_all_items", getAllItem);
route.get("/stats", getStats);
route.get("/chart", getChart);
route.get("/get_description", getDescription);
route.get("/get_combined", getCombinedData);
route.get("/search_item", searchItems);

module.exports = route;
