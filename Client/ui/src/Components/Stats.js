import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const Stats = ({ stats, month }) => {
  return (
    <Card sx={{ minWidth: 275, margin: 2, borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography
          variant="h5"
          component="div"
          sx={{ marginBottom: 2, fontWeight: "bold" }}
        >
          {`Sales Statistics for ${month}`}
        </Typography>
        <Box sx={{ marginBottom: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: "medium" }}>
            Sold Count:
          </Typography>
          <Typography variant="body2">{stats.soldCount}</Typography>
        </Box>
        <Box sx={{ marginBottom: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: "medium" }}>
            Total Sales:
          </Typography>
          <Typography variant="body2">
            ${stats.totalSales.toFixed(2)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: "medium" }}>
            Unsold Count:
          </Typography>
          <Typography variant="body2">{stats.unsoldCount}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Stats;
