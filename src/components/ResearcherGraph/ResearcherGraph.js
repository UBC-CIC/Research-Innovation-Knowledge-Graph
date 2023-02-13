import React, { useState, useEffect } from "react";
import "@react-sigma/core/lib/react-sigma.min.css";
import {
  SigmaContainer,
  ControlsContainer,
  ZoomControl,
  FullScreenControl,
} from "@react-sigma/core";
import { Container, Card, Grid, CardContent, Typography, Box, FormGroup, FormControlLabel, Checkbox, Button } from "@mui/material";
import "./ResearcherGraph.css";
import GraphDefinition from "./helpers/GraphDefinition";
import {GraphEvents} from "./helpers/GraphEvents";
import Graph from "graphology";
import {random } from 'graphology-layout';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import CircularProgress from '@mui/material/CircularProgress';
import Amplify from "@aws-amplify/core";
import { Auth } from "@aws-amplify/auth";
import awsmobile from "../../aws-exports";
import { API } from "aws-amplify";

import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'
import FacultyFiltersDialog from "../FacultyFiltersDialog";

import {
  getResearcher,
  getSharedPublications
} from "../../graphql/queries";

Amplify.configure(awsmobile);
Auth.configure(awsmobile);

const ResearcherGraph = (props) => {
  const [graph, setGraph] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);

  const [selectedResearcher, setSelectedResearcher] = useState(null);

  const [edgeResearcherOne, setEdgeResearcherOne] = useState(null);
  const [edgeResearcherTwo, setEdgeResearcherTwo] = useState(null);
  const [sharedPublications, setSharedPublications] = useState([]);
  //can use setSelectNode to set the node selected during search

  useEffect(() => {
    const jsonGraph = {
      attributes:{},
      nodes: props.researcherNodes,
      edges: props.graphEdges,
    }

    const graph = Graph.from(jsonGraph)
    random.assign(graph); //assigns each node a random x,y value between [0,1]
    forceAtlas2.assign(graph, {iterations: 100}); //assigns nodes x,y values with force directed
    setGraph(graph)

  }, [props.researcherNodes, props.graphEdges])

  //On change of the selected node get information on the researcher
  useEffect(() => {
    console.log("triggered")
    if(selectedNode) {
      console.log("here")
      getResearcherFunction(selectedResearcher);
    } else{
      setSelectedResearcher(null);
    }
  }, [selectedNode])

  useEffect(() => {
    if(selectedEdge) {
      getEdgeInformation();
    }else{
      setEdgeResearcherOne(null);
      setEdgeResearcherTwo(null);
      setSharedPublications([]);
    }
  }, [selectedEdge])

  const getResearcherFunction = async () => {
    const result = await API.graphql({
      query: getResearcher,
      variables: {"id": selectedNode}
    });
    let researcher = result.data.getResearcher;
    setSelectedResearcher(researcher);
  }

  const getEdgeInformation = async () => {
    let researchersIds = selectedEdge.split("&&");
    let researcherOneId = researchersIds[0];
    let researcherTwoId = researchersIds[1];

    console.log(researcherOneId)
    console.log(researcherTwoId)

    //Get the researcher information

    let result = await API.graphql({
      query: getResearcher,
      variables: {"id": researcherOneId}
    });
    let researcher = result.data.getResearcher;
    setEdgeResearcherOne(researcher);

    result = await API.graphql({
      query: getResearcher,
      variables: {"id": researcherTwoId}
    });
    researcher = result.data.getResearcher;
    setEdgeResearcherTwo(researcher);

    result = await API.graphql({
      query: getSharedPublications,
      variables: {"id1": researcherOneId, "id2": researcherTwoId}
    });
    let publications = result.data.getSharedPublications;
    console.log(publications);
    setSharedPublications(publications);
  }

  /*	title, journal, yearPublished, authors, link are the fields of a publication you can show */
  const publications = sharedPublications.map((publicationData) =>
    <div key={publicationData.toString()} className="paper-link">
      <div>
        <a href={publicationData.link} target="_blank" rel="noopener noreferrer">   
          <Latex>{publicationData.title}</Latex> 
          <OpenInNewIcon fontSize="inherit" />
        </a>
      </div>
    </div>
  );

  const handleCheckFaculty = (e, faculty) => {
    if (e.target.checked) {
      props.setSelectedFaculties((prev) => [...prev, faculty]);
    } else {
      props.setSelectedFaculties(
        props.selectedFaculties.filter(
          (selectedFaculty) => selectedFaculty !== faculty
        )
      );
    }
  };
  
  const applyFilters = () => {
    props.changeGraph();
  }

  const handleClose = () => {
    props.setOpenFacultyFiltersDialog(false);
  };

  return (
    <div className="Researcher-Graph">
      <Grid container spacing={0} alignItems="stretch" direction="row">
        <Grid item xs={4}>
          {/** Shows information on selected node and edge*/}
          <Card id="researcher-info-card">
            <CardContent>
              {selectedNode && !selectedEdge && (
                selectedResearcher ? (
                <>
                  <Typography gutterBottom variant="h5" color="#002145" margin="0px" component="div">
                    <b>{selectedResearcher.firstName + " " + selectedResearcher.lastName}</b>
                  </Typography>
                  <Typography variant="subtitle1" color="#002145">
                    <b>{selectedResearcher.rank}</b>
                  </Typography>
                  <Typography variant="body2" color="#404040">
                    {selectedResearcher.faculty}
                  </Typography>
                  <br/>
                  <Typography variant="body2" color="#404040">
                  <b>Department: </b>
                    {selectedResearcher.department}
                  </Typography>
                  <Typography variant="body2" color="#404040">
                  <b>Email: </b>
                    {selectedResearcher.email}
                  </Typography>
                  <Typography variant="body2" color="#404040">
                    <b>{"Scopus Id: "}</b>
                    {selectedResearcher.id}
                  </Typography>
                  <br/>
                  <Typography variant="caption" color="text.secondary">
                    Click on connected node to see information about how they
                    are connected
                  </Typography>
                </>
                ) : (<center><CircularProgress color="inherit" /></center>)
              )}
              {selectedEdge && (
                edgeResearcherOne && edgeResearcherTwo && sharedPublications.length!=0 ? (
                <>
                <Typography gutterBottom variant="h5" color="#002145" margin="0px" component="div">
                    <b>{edgeResearcherOne.firstName + " " + edgeResearcherOne.lastName + " &" }</b> 
                  </Typography>
                  <Typography gutterBottom variant="h5" color="#002145" margin="0px" component="div">
                    <b> {edgeResearcherTwo.firstName + " " + edgeResearcherTwo.lastName}</b>
                  </Typography>
                  <br/>
                  <Typography variant="subtitle1" margin="0px" color="#002145">
                    <b>Shared Publications</b>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {publications}
                  </Typography>
                </>
                ) : (<center><CircularProgress color="inherit" /></center>)
              )}
              {!selectedNode && (
                <Typography variant="body2" color="text.secondary">
                  Click on a node to view more information about the researcher
                </Typography>
              )}
            </CardContent>
          </Card>
          <FacultyFiltersDialog
            open={props.openFacultyFiltersDialog}
            handleClose={handleClose}
            allFaculties={props.facultyOptions}
            selectedFaculties={props.selectedFaculties}
            handleCheckFaculty={handleCheckFaculty}
            applyFilters={applyFilters}
          />
        </Grid>
        <Grid item xs={8}>
          <Container maxWidth={false}>
            {" "}
            {/* sets the width of the graph -scales to the size of the page */}
            <Card id="researcher-graph-card">
              <SigmaContainer
                graph={graph}
                style={{ height: "75vh" }}
                settings={{
                  zIndex: true,
                  labelRenderedSizeThreshold: 7, //the size at which the the nodes label show up
                }}
              >
                <GraphEvents
                  firstClickedNode={selectedNode}
                  setFirstClickedNode={setSelectedNode}
                  selectedEdge={selectedEdge}
                  setSelectedEdge={setSelectedEdge}
                />
                <ControlsContainer position={"bottom-right"}>
                  <ZoomControl />
                  <FullScreenControl />
                </ControlsContainer>
              </SigmaContainer>
            </Card>
          </Container>
        </Grid>
      </Grid>
    </div>
  );
};

export default ResearcherGraph;
