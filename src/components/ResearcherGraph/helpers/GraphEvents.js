import { useEffect, useState } from "react";
import { useSigma, useRegisterEvents } from "@react-sigma/core";

const NODE_FADE_COLOR = "#bbb";
const EDGE_FADE_COLOR = "#eee";

const GraphEvents = () => {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const registerEvents = useRegisterEvents();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [firstClickedNode, setFirstClickedNode] = useState(null);
  const [secondClickedNode, setSecondClickedNode] = useState(null);
  const [edgeSelectionMode, setEdgeSelectionMode] = useState(false);
  const [clickedNode, setClickedNode] = useState(null);
 
  // use effect used to register the events
  useEffect(() => {
    console.log("event mounts")
    registerEvents(getGraphEvents());
  }, [registerEvents]);

  // when node is hovers it highlights its neighboring nodes and edges
  useEffect(() => {
    if(!edgeSelectionMode){ // if edgeSelectionMode is on ignore highlighting
    if (hoveredNode) {
      //node is hovered
      const hoveredColor = sigma.getNodeDisplayData(hoveredNode).color; //gets the color of the current hovered node

      //non-neighboring edges change to NODE_FADE_COLOR
      sigma.setSetting("nodeReducer", (node, data) => {
        return node === hoveredNode || graph.areNeighbors(node, hoveredNode)
          ? { ...data }
          : { ...data, label: "", color: NODE_FADE_COLOR };
      });

      //sets the neighboring edges to hovered color and thickens them and sets non-neighboring edges to EDGE_FADE_COLOR
      sigma.setSetting(
        "edgeReducer",
        (edge, data) =>
          graph.hasExtremity(edge, hoveredNode)
            ? { ...data, size: data.size * 2 } // to add hovering color: color: hoveredColor
            : { ...data, color: EDGE_FADE_COLOR } // add "hidden: true" to hide edges
      );
    
    } else {//node is un-hovered (value is null)
        sigma.setSetting("nodeReducer", null);
        sigma.setSetting("edgeReducer", null);
    }
  }
  }, [hoveredNode]); //runs when hoveredNode value changes

  //for clicking on nodes or on canvas
  useEffect(() => {
    if(clickedNode){  
      if(!edgeSelectionMode){ // we need to set first node 
        setEdgeSelectionMode(true);
        setFirstClickedNode(clickedNode);
      }
      else {
        if(graph.areNeighbors(clickedNode, firstClickedNode)){ //can be a second selection node
          setSecondClickedNode(clickedNode);
      
        } else { //cancel selection mode (clicked on node that is not a adjacent node)
          setEdgeSelectionMode(false);
          setFirstClickedNode(null);
          setSecondClickedNode(null);
          sigma.setSetting("nodeReducer", null);
          sigma.setSetting("edgeReducer", null);
        }
      }
    } else{ //cancel selection mode (clicked on canvas)
      setEdgeSelectionMode(false);
      setFirstClickedNode(null);
      setSecondClickedNode(null);
      sigma.setSetting("nodeReducer", null);
      sigma.setSetting("edgeReducer", null);
    }

  }, [clickedNode]);

  //for edge highlighting when an edge is selected
  useEffect(() => {
   if(secondClickedNode){
    const hoveredColor = sigma.getNodeDisplayData(firstClickedNode).color; //gets the color of the current hovered node

        //set all the nodes to NODE_FADE_COLOR except clicked Nodes
        sigma.setSetting("nodeReducer", (node, data) => {
          return node === firstClickedNode || node === secondClickedNode
            ? { ...data }
            : { ...data, label: "", color: NODE_FADE_COLOR };
        });
      //sets all edges to EDGE_FADE_COLOR except selected edge
      sigma.setSetting(
        "edgeReducer",
        (edge, data) =>
          graph.edge(firstClickedNode, secondClickedNode)===edge
            ? { ...data, size: data.size * 2 } //// to add hovering color: color: hoveredColor
            : { ...data, color: EDGE_FADE_COLOR } // add "hidden: true" to hide edges
      );
   }
  }, [secondClickedNode]);

  const getGraphEvents = () => {
    const events = {
      doubleClickNode: ({ node }) => {
        window.open(`http://localhost:3000/${node}`); //when a node is double clicked it opens a /new window based on the node they clicked
      },
      enterNode: ({ node }) => {
          setHoveredNode(node);
      },
      leaveNode: () => {
        setHoveredNode(null);
      },
      clickNode: ({ node }) => {
          setClickedNode(node)
      },
      clickStage: () =>{ //clicking anywhere on the canvas
        setClickedNode(null);
      }
    };
    return events;
  };

  return null;
};

export default GraphEvents;
