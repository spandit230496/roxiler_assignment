import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table as MuiTable,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableContainer,
  TableSortLabel,
  IconButton,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  TablePagination,
} from "@mui/material";
import Chart from "./Chart";

const Table = () => {
  const months = {
    Jan: 1,
    Feb: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const [month, setMonth] = useState("Jan");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [details, setDetails] = useState();

  const tableHeaders = [
    "Id",
    "Title",
    "Price",
    "Category",
    "Description",
    "Sold",
    "Image",
  ];

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:5000/get_all_items?page=${page}&rowsPerPage=${rowsPerPage}&query=${query}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDetailedData = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/get_combined?month=${months[month]}`
      );
      setDetails(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, query]);

  useEffect(() => {
    getDetailedData();
  }, [month]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const searchItem = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/search_item?search=${query}&page=${page}`
      );
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    searchItem();
  }, [query]);
  return (
    <div>
      <Paper sx={{ width: "80%", margin: "auto", padding: 2 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <TextField
            placeholder="Search here"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            variant="outlined"
            size="small"
          />
          <TextField
            select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            label="Month"
            variant="outlined"
            size="small"
            style={{ minWidth: 120 }}
          >
            {Object.keys(months).map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <TableContainer>
          {isLoading ? (
            <Typography variant="h6" align="center">
              Loading...
            </Typography>
          ) : error ? (
            <Typography variant="h6" color="error" align="center">
              Error fetching data
            </Typography>
          ) : (
            <MuiTable>
              <TableHead>
                <TableRow>
                  {tableHeaders.map((header) => (
                    <TableCell key={header}>
                      <TableSortLabel>{header}</TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id || item._id}>
                    <TableCell>{item.id || item._id}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.sold ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <IconButton>
                        <img
                          src={item.image}
                          height={30}
                          width={30}
                          alt={item.title}
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </MuiTable>
          )}
        </TableContainer>
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
      <Button onClick={() => setPage(page + 1)}>{` Next >`}</Button>
      <Button
        onClick={() => setPage(Math.max(0, page + 1))}
      >{` Prev <`}</Button>
      <h1>Items Statistics</h1>
      {details && <Chart data={details} month={month} />}
    </div>
  );
};

export default Table;
