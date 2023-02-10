import React from "react";
import "@react-sigma/core/lib/react-sigma.min.css";
import { SigmaContainer, ControlsContainer, ZoomControl,FullScreenControl} from "@react-sigma/core";
import { Container,Card } from '@mui/material';
import "./ResearcherGraph.css"
import GraphDefinition from "./helpers/GraphDefinition";
import {GraphEvents, GetSigma} from "./helpers/GraphEvents";
import "../Searchbar/searchbar.css"

const ResearcherGraph = () => {

const graph = GraphDefinition();
  
  
  return (
    <div className="Researcher-Graph"> 
    <Container maxWidth="md"> {/* sets the width of the graph -scales to the size of the page */}
      <Card id="researcher-graph-card">
        <SigmaContainer
          graph={graph}
          style={{ height: "82vh", width: "100vh"}}
          settings={{
            labelRenderedSizeThreshold:10,//the size at which the the nodes label show up
          }}>
          <GraphEvents/>
          <ControlsContainer position={"bottom-right"}>
            <ZoomControl />
            <FullScreenControl />
          </ControlsContainer>
        </SigmaContainer>
      </Card>
    </Container>
    </div>
  );
};

export default ResearcherGraph;
