import React, { useState, useEffect } from "react";
import '../index.css';
import Grid from '@mui/material/Grid';
import ResearcherGraph from './ResearcherGraph/ResearcherGraph';
import Navbar from "./Navbar/navbar";
import {SearchBar} from "./Searchbar/searchbar"
import Tutorial from "./Tutorial/Tutorial";

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
  const [researcherNodes, setResearcherNodes] = useState(null);
  const [graphEdges, setGraphEdges] = useState(null);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  const [allFaculties, setAllFaculties] = useState([]);
  const [currentlyAppliedFaculties, setCurrentlyAppliedFaculties] = useState([]);
  const [currentlyAppliedKeywordFilter, setCurrentlyAppliedKeywordFilter] = useState("");
  const [keywordFilter, setKeywordFilter] = useState("");
  const [chosenFaculties, setChosenFaculties] = useState([]);
  const [openFacultyFiltersDialog, setOpenFacultyFiltersDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [run, setRun] = useState(false);

  //On page load get the faculties
  useEffect(() => {
    getTheFaculties();
  }, [])

  //On page load and every time filters are changed re-make the graph
  useEffect(() => {
    changeGraph();
  }, [currentlyAppliedFaculties, currentlyAppliedKeywordFilter])

  const getGraph = async () => {
    const researchers = await API.graphql({
      query: getResearchers,
      variables: {"facultiesToFilterOn": currentlyAppliedFaculties, "keyword": keywordFilter.toLowerCase()},
    });
    setResearcherNodes(researchers.data.getResearchers);

    const edgesResult = await API.graphql({
      query: getEdges,
      variables: {"facultiesToFilterOn": currentlyAppliedFaculties, "keyword": keywordFilter.toLowerCase()},
    });

    console.log(edgesResult)
    setGraphEdges(edgesResult.data.getEdges)
    setAutoCompleteOptions(Object.values(researchers.data.getResearchers).map(formatOptions));
  }

  const formatOptions = (entry) => {
    let retval = entry.attributes
    retval.id = entry.key
    return retval
  }

  const getTheFaculties = async () => {
    const getFaculties = await API.graphql({
      query: getAllFaculties,
    });
    setAllFaculties(getFaculties.data.getAllFaculties)
  }

  const changeGraph = () => {
    setGraphEdges(null);
    setResearcherNodes(null);
    getGraph();
  }

  function startTutorial() {
    setRun(true);
  }

  return (
    <Grid container spacing={2}>
      <Tutorial selectedNode={selectedNode} setSelectedNode={setSelectedNode}
                selectedEdge={selectedEdge} setSelectedEdge={setSelectedEdge}
                openFacultyFiltersDialog={openFacultyFiltersDialog}
                run={run} setRun={setRun}/>
      <Grid item xs={12}>
        <Navbar startTutorial={startTutorial}/>
      </Grid>
      <Grid id="search-bar-main" item xs={12}>
        <SearchBar text="Search Graph" size="100vh" setOpenFacultyFiltersDialog={setOpenFacultyFiltersDialog} 
        autoCompleteOptions={autoCompleteOptions} searchQuery={searchQuery} setSearchQuery={setSearchQuery}></SearchBar>
      </Grid>
      <Grid item xs={12}>
        <ResearcherGraph researcherNodes={researcherNodes}  
        graphEdges={graphEdges} facultyOptions={allFaculties}
        currentlyAppliedFaculties={currentlyAppliedFaculties} setCurrentlyAppliedFaculties={setCurrentlyAppliedFaculties}
        selectedFaculties={chosenFaculties} setSelectedFaculties={setChosenFaculties}
        changeGraph={changeGraph} openFacultyFiltersDialog={openFacultyFiltersDialog} setOpenFacultyFiltersDialog={setOpenFacultyFiltersDialog}
        keywordFilter={keywordFilter} setKeywordFilter={setKeywordFilter}
        currentlyAppliedKeywordFilter={currentlyAppliedKeywordFilter} setCurrentlyAppliedKeywordFilter={setCurrentlyAppliedKeywordFilter}
        selectedNode={selectedNode} setSelectedNode={setSelectedNode}
        selectedEdge={selectedEdge} setSelectedEdge={setSelectedEdge}
        />
      </Grid>
    </Grid>
  )
}