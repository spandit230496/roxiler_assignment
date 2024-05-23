import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";

const DescriptionCard = ({ descriptions, month }) => {
  return (
    <Card sx={{ minWidth: 275, margin: 2, borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography
          variant="h5"
          component="div"
          sx={{ marginBottom: 2, fontWeight: "bold" }}
        >
          {`Category Descriptions for ${month}`}
        </Typography>
        <List>
          {descriptions.map((desc, index) => (
            <Box key={index}>
              <ListItem>
                <ListItemText
                  primary={`Category: ${desc.category}`}
                  secondary={`Count: ${desc.count}`}
                  primaryTypographyProps={{
                    fontSize: 16,
                    fontWeight: "medium",
                  }}
                  secondaryTypographyProps={{ fontSize: 14 }}
                />
              </ListItem>
              {index < descriptions.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </Box>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default DescriptionCard;
