const Item = require("../Model/itemModel");

const getAllItem = async (req, res) => {
  const perPage = 10;
  const { page, month } = req.query;
  const requestedPage = Math.max(0, parseInt(page, 10) || 0);

  try {
    let query = {};

    if (month) {
      const monthInt = parseInt(month, 10);
      if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
        return res.status(400).json({ message: "Invalid month" });
      }
      query = {
        $expr: {
          $eq: [{ $toInt: { $substr: ["$dateOfSale", 5, 2] } }, monthInt],
        },
      };
    }

    const items = await Item.find(query)
      .limit(perPage)
      .skip(perPage * requestedPage);

    res.status(200).send(items);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An error occurred" });
  }
};

const getStats = async (month) => {
  return Item.aggregate([
    {
      $addFields: {
        month: { $substr: ["$dateOfSale", 5, 2] },
      },
    },
    {
      $match: { month: month.toString().padStart(2, "0") },
    },
    {
      $group: {
        _id: "$month",
        totalSales: {
          $sum: {
            $cond: { if: { $eq: ["$sold", true] }, then: "$price", else: 0 },
          },
        },
        soldCount: {
          $sum: { $cond: { if: { $eq: ["$sold", true] }, then: 1, else: 0 } },
        },
        unsoldCount: {
          $sum: {
            $cond: { if: { $eq: ["$sold", false] }, then: 1, else: 0 },
          },
        },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
};

const getChart = async (month) => {
  const monthString = month.toString().padStart(2, "0");

  const maxPriceResult = await Item.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $toInt: { $substr: ["$dateOfSale", 5, 2] } }, month],
        },
      },
    },
    { $group: { _id: null, maxPrice: { $max: "$price" } } },
  ]);

  if (maxPriceResult.length === 0) {
    throw new Error("No items found for the specified month");
  }

  const maxPrice = maxPriceResult[0].maxPrice;

  const items = await Item.find({
    $expr: { $eq: [{ $toInt: { $substr: ["$dateOfSale", 5, 2] } }, month] },
  });

  return { maxPrice, items };
};

const getDescription = async (month) => {
  const result = await Item.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $toInt: { $substr: ["$dateOfSale", 5, 2] } }, month],
        },
      },
    },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  return result.map((item) => ({
    category: item._id,
    count: item.count,
  }));
};

const getCombinedData = async (req, res) => {
  const month = parseInt(req.query.month, 10);
  if (isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ message: "Invalid month" });
  }

  try {
    const [stats, chartData, descriptions] = await Promise.all([
      getStats(month),
      getChart(month),
      getDescription(month),
    ]);

    const { maxPrice, items } = chartData;

    const priceRanges = [];
    let rangeStart = 0;
    while (rangeStart < maxPrice) {
      const rangeEnd = Math.min(rangeStart + 99, maxPrice);
      priceRanges.push({
        label: `${rangeStart}-${rangeEnd}`,
        min: rangeStart,
        max: rangeEnd,
      });
      rangeStart = rangeEnd + 1;
    }

    const separatedProducts = {};
    priceRanges.forEach((range) => {
      separatedProducts[range.label] = items.filter(
        (item) => item.price >= range.min && item.price <= range.max
      );
    });

    res.json({
      stats,
      priceRanges: separatedProducts,
      descriptions,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchItems = async (req, res) => {
  const perPage = 10;
  const page = 0;
  const { search } = req.query;
  const requestedPage = Math.max(0, parseInt(page, 10) || 0);

  try {
    if (!search) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const searchRegex = new RegExp(search, "i");
    const query = {
      $or: [
        { title: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
      ],
    };

    const items = await Item.find(query)
      .limit(perPage)
      .skip(perPage * requestedPage);

    res.status(200).send(items);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An error occurred" });
  }
};

module.exports = {
  searchItems,
  getAllItem,
  getStats,
  getChart,
  getDescription,
  getCombinedData,
};
