import React, {useEffect} from "react";
import "@react-sigma/core/lib/react-sigma.min.css";
import { SigmaContainer, useRegisterEvents, ControlsContainer, ZoomControl,FullScreenControl} from "@react-sigma/core";
import { Container,Card } from '@mui/material';
import "./ResearcherGraph.css"
import GraphDefinition from "./helpers/GraphDefinition";
import getGraphEvents from "./helpers/GraphEvents";
const ResearcherGraph = () => {

  const GraphEvents = () => {
    const registerEvents = useRegisterEvents();
    useEffect(() => {
      registerEvents(getGraphEvents())
    }, [registerEvents]);

    return null;
  };

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
