import React, { useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import TheApp from './components/TheApp';
import Grid from '@mui/material/Grid';
import ResearcherGraph from './components/ResearcherGraph/ResearcherGraph';
import Navbar from "./components/Navbar/navbar";
import SearchBar from "./components/Searchbar/searchbar"
import DropdownMenu from "./components/Dropdown/dropdown";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Grid container spacing={2}>
      <Grid item xs={12}>
        <Navbar></Navbar>
      </Grid>
      <Grid id="search-bar-main" item xs={12} justifyContent="center" display="flex">
        <SearchBar text="Search Researcher Graphs" size="100vh"></SearchBar>
      </Grid>
      <Grid id="dropdown-menu" item xs={12} display="flex" justifyContent="right" flexWrap="nowrap">
        <DropdownMenu text="View Style"></DropdownMenu>
        <DropdownMenu text="View Options"></DropdownMenu>
        <DropdownMenu text="Bookmarks"></DropdownMenu>
      </Grid>
      <Grid item xs={12}>
      <React.StrictMode>
        <ResearcherGraph />
      </React.StrictMode>
      </Grid>
    </Grid>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
