import React from "react";
import Stats from "./Stats";
import DescriptionCard from "./DescriptionCard";
import { Box } from "@mui/material";
import Details from "./Details";

const Chart = ({ data, month }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Stats stats={data.stats[0]} month={month} />
      <Details data={data} />
      <DescriptionCard descriptions={data.descriptions} month={month} />
    </Box>
  );
};

export default Chart;
