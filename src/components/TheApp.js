import React, { useState, useEffect } from "react";
import '../index.css';
import Grid from '@mui/material/Grid';
import ResearcherGraph from './ResearcherGraph/ResearcherGraph';
import Navbar from "./Navbar/navbar";
import SearchBar from "./Searchbar/searchbar"
import DropdownMenu from "./Dropdown/dropdown";

import Amplify from "@aws-amplify/core";
import { Auth } from "@aws-amplify/auth";
import awsmobile from "../aws-exports";
import { API } from "aws-amplify";

import {
  getResearchers,
  getEdges,
  getAllFaculties,
} from "../graphql/queries";

Amplify.configure(awsmobile);
Auth.configure(awsmobile);


export default function TheApp(props) {
  const [researcherNodes, setResearcherNodes] = useState([]);
  const [graphEdges, setGraphEdges] = useState([]);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  const [allFaculties, setAllFaculties] = useState([]);
  const [chosenFaculties, setChosenFaculties] = useState([]);

  //Everytime the filters for faculty changes get the graphs nodes and edges
  useEffect(() => {
    changeGraph();
  }, [])

  //On page load get the faculties
  useEffect(() => {
    getTheFaculties();
  }, [])

  const getGraph = async () => {
    const researchers = await API.graphql({
      query: getResearchers,
      variables: {"facultiesToFilterOn": chosenFaculties},
    });
    setResearcherNodes(researchers.data.getResearchers);

    const edgesResult = await API.graphql({
      query: getEdges,
      variables: {"facultiesToFilterOn": chosenFaculties},
    });
    setGraphEdges(edgesResult.data.getEdges)
  }

  const getTheFaculties = async () => {
    const getFaculties = await API.graphql({
      query: getAllFaculties,
    });
    setAllFaculties(getFaculties.data.getAllFaculties)
  }

  const changeGraph = () => {
    setGraphEdges([])
    setResearcherNodes([])
    getGraph();
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Navbar></Navbar>
      </Grid>
      <Grid id="search-bar-main" item xs={12} justifyContent="center" display="flex">
        <SearchBar text="Search Researcher Graphs" size="100vh" autoCompleteOptions={autoCompleteOptions}></SearchBar>
      </Grid>
      <Grid id="dropdown-menu" item xs={12} display="flex" justifyContent="right" flexWrap="nowrap">
        <DropdownMenu text="View Style"></DropdownMenu>
        <DropdownMenu text="View Options"></DropdownMenu>
        <DropdownMenu text="Bookmarks"></DropdownMenu>
      </Grid>
      <Grid item xs={12}>
        <ResearcherGraph researcherNodes={researcherNodes}  
        graphEdges={graphEdges} facultyOptions={allFaculties}
        selectedFaculties={chosenFaculties} setSelectedFaculties={setChosenFaculties}
        changeGraph={changeGraph}/>
      </Grid>
      <Grid id="search-bar-sub" item xs={12} display="flex" justifyContent="center" flexWrap="nowrap">
        <SearchBar text="Search Graph" size="50vh"></SearchBar>
      </Grid>
    </Grid>
  )
}