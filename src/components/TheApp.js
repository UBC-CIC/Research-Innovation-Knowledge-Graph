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
} from "../graphql/queries";

Amplify.configure(awsmobile);
Auth.configure(awsmobile);


export default function TheApp(props) {
  const [researcherNodes, setResearcherNodes] = useState([]);
  const [graphEdges, setGraphEdges] = useState([]);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);

  useEffect(() => {
    getResearcherNodes();
    getResearcherEdges();
  }, [])

  const getResearcherNodes = async () => {
    const researchers = await API.graphql({
      query: getResearchers,
    });

    let researcherList = researchers.data.getResearchers;

    console.log(researcherList);

    let ResearcherNodes = [];
    let toStopDups = [];
    
    for(let i = 0; i<researcherList.length; i++) {

      //Create all the researcher nodes
      let fullName = researcherList[i].firstName + ' ' + researcherList[i].lastName
      let key = researcherList[i].id
      //Key should probably be an ID
      if(!toStopDups.includes(researcherList[i].id)) {
        ResearcherNodes.push({key: researcherList[i].id, attributes: {label: fullName, size:10}})
        toStopDups.push(researcherList[i].id)
      }
    }
    setResearcherNodes(ResearcherNodes);
  }

  const getResearcherEdges = async () => {
    const edgesResult = await API.graphql({
      query: getEdges,
    });

    let edges = edgesResult.data.getEdges;

    let researcherEdges = [];
    
    for(let i = 0; i<edges.length; i++) {
      researcherEdges.push({key:edges[i].key, source: edges[i].source, target: edges[i].target, 
        undirected:true, attributes:{size: 1, color:"red"}})//attributes:{size:edges[i].size, color:"red"}})
    }


    console.log(researcherEdges)
    setGraphEdges(researcherEdges)
  }

  useEffect(() => {
    let autoCompleteResearcherOptions = []
    for(let i = 0; i<researcherNodes.length; i++){
      autoCompleteResearcherOptions.push({"label": researcherNodes[i].attributes.label, "id": researcherNodes[i].key})
    }
    setAutoCompleteOptions(autoCompleteResearcherOptions);
    console.log(autoCompleteResearcherOptions)
  }, [researcherNodes])
  

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
        <ResearcherGraph researcherNodes={researcherNodes}  graphEdges={graphEdges}/>
      </Grid>
      <Grid id="search-bar-sub" item xs={12} display="flex" justifyContent="center" flexWrap="nowrap">
        <SearchBar text="Search Graph" size="50vh"></SearchBar>
      </Grid>
    </Grid>
  )
}