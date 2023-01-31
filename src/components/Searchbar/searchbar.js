import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Box from "@material-ui/core/Box";
import Stack from "@mui/material/Stack";
import "./searchbar.css"

const filterData = (query, data) => {
  if (!query) {
    return data;
  } else {
    return data.filter((d) => d.toLowerCase().includes(query));
  }
};

const data = [
  "Hello"
];

export default function Search_Bar(props) {
  const [searchQuery, setSearchQuery] = useState("");
  const dataFiltered = filterData(searchQuery, data);

  return (
    <Box className="search-bar-box" component={Stack} direction="row">
      <TextField
        id="search-bar"
        className="text"
        onInput={(e) => {
          setSearchQuery(e.target.value);
        }}
        label={props.text}
        variant="outlined"
        placeholder="Search..."
        size="small"
        sx={{ width: props.size }}
      />
      <IconButton type="submit" aria-label="search">
        <SearchIcon style={{ fill: "grey" }} />
      </IconButton>
  </Box>
  );
}

