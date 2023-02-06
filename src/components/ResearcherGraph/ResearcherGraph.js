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
const ResearcherGraph = () => {
  const [graph, setGraph] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);

  //can use setSelectNode to set the node selected during search

  useEffect(() => {
    setGraph(GraphDefinition());
  }, []);

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
                    {selectedNode}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Add more information about selected researcher
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
