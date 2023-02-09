import React, { useState, useEffect } from "react";
import "@react-sigma/core/lib/react-sigma.min.css";
import {
  SigmaContainer,
  ControlsContainer,
  ZoomControl,
  FullScreenControl,
} from "@react-sigma/core";
import { Container, Card, Grid, CardContent, Typography } from "@mui/material";
import "./ResearcherGraph.css";
import GraphDefinition from "./helpers/GraphDefinition";
import GraphEvents from "./helpers/GraphEvents";
import Graph from "graphology";
import {random } from 'graphology-layout';
import forceAtlas2 from 'graphology-layout-forceatlas2';

import Amplify from "@aws-amplify/core";
import { Auth } from "@aws-amplify/auth";
import awsmobile from "../../aws-exports";
import { API } from "aws-amplify";

import {
  getResearcher
} from "../../graphql/queries";

Amplify.configure(awsmobile);
Auth.configure(awsmobile);

const ResearcherGraph = (props) => {
  const [graph, setGraph] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);

  const [selectedResearcher, setSelectedResearcher] = useState({})

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
      getResearcherFunction();
    }
  }, [selectedNode])

  const getResearcherFunction = async () => {
    const result = await API.graphql({
      query: getResearcher,
      variables: {"id": selectedNode}
    });
    let researcher = result.data.getResearcher;
    console.log(researcher)
    setSelectedResearcher(researcher);
  }

  return (
    <div className="Researcher-Graph">
      <Grid container spacing={0} alignItems="stretch" direction="row">
        <Grid item xs={2}>
          {/** Shows information on selected node and edge*/}
          <Card>
            <CardContent>
              {selectedNode && !selectedEdge && (
                <>
                  <Typography gutterBottom variant="h5" component="div">
                    {selectedResearcher.firstName + " " + selectedResearcher.lastName}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {selectedResearcher.faculty}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {"Department: " + selectedResearcher.department}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {"Email: " + selectedResearcher.email}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {"Rank: " + selectedResearcher.rank}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {"Scopus Id: " + selectedResearcher.id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Click on connected node to see information about how they
                    are connected
                  </Typography>
                </>
              )}
              {selectedEdge && (
                <>
                  <Typography gutterBottom variant="h5" component="div">
                    {selectedEdge}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Add more information about selected edge
                  </Typography>
                </>
              )}
              {!selectedNode && (
                <Typography variant="body2" color="text.secondary">
                  Click on a node to view more information about the researcher
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={10}>
          <Container maxWidth={false}>
            {" "}
            {/* sets the width of the graph -scales to the size of the page */}
            <Card id="researcher-graph-card">
              <SigmaContainer
                graph={graph}
                style={{ height: "75vh" }}
                settings={{
                  labelRenderedSizeThreshold: 10, //the size at which the the nodes label show up
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
