import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Box from "@material-ui/core/Box";
import Stack from "@mui/material/Stack";
import {GraphEvents, GetSigma} from "../ResearcherGraph/helpers/GraphEvents";
import "./searchbar.css"
import "../ResearcherGraph/helpers/GraphEvents.js"

export default function Search_Bar(props) {
  const [searchQuery, setSearchQuery] = useState("");
  const sigma = GetSigma();

  const ZoomOnNode = (node) => {
    console.log("Zooming Camera")
    console.log(node)
    let camera = sigma.getCamera();
    let zoom_ratio = 2;
    let zoom_factor = camera.ratio/zoom_ratio
    camera.x = node.x;
    camera.y = node.y;
    if (zoom_factor <= 1) {
      camera.ratio = 1.5
      zoom_factor = camera.ratio/zoom_ratio
    }
    camera.animatedZoom({duration: 50 * zoom_factor, factor: zoom_factor});
  }
  const ZoomToNode = (node) => {
    console.log("Moving Camera")
    console.log(node)
    let camera = sigma.getCamera();
    camera.animate(node, {duration: 500});
  }
  
  const SearchForNode = () => {
    console.log(searchQuery)
    let node = sigma.getNodeDisplayData(searchQuery);
    console.log(node)
    if (node) {
      ZoomOnNode(node);
    }
    else {
      console.log("Could not find node")
    }
  }

  return (
    <Box className="search-bar-box" component={Stack} direction="row">
      <TextField
        id="search-bar"
        className="text"
        onInput={(e) => {
          setSearchQuery(e.target.value);
        }}
        onKeyPress={(event) => { 
          if (event.key == "Enter") {SearchForNode()}
        }}
        label={props.text}
        variant="outlined"
        placeholder="Search..."
        size="small"
        sx={{ width: props.size }}
      />
      <IconButton type="submit" aria-label="search" onClick={SearchForNode}>
        <SearchIcon style={{ fill: "grey" }} />
      </IconButton>
  </Box>
  );
}

