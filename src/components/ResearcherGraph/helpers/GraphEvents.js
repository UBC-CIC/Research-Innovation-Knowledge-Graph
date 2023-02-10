import { useEffect, useState } from "react";
import { useSigma, useRegisterEvents } from "@react-sigma/core";

const NODE_FADE_COLOR = "#bbb";
const EDGE_FADE_COLOR = "#eee";
var sigma;

const GraphEvents = ({firstClickedNode,setFirstClickedNode, selectedEdge, setSelectedEdge}) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const registerEvents = useRegisterEvents();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [secondClickedNode, setSecondClickedNode] = useState(null);
  const [edgeSelectionMode, setEdgeSelectionMode] = useState(false);
  const [clickedNode, setClickedNode] = useState(null);
 
  // use effect used to register the events
  useEffect(() => {
    console.log("event mounts")
    registerEvents(getGraphEvents());
  }, [registerEvents]);

  //when firstClickNode changes it starts or cancels edgeSelectionMode
  useEffect(() => {
    if(firstClickedNode){
      setEdgeSelectionMode(true);
      setSecondClickedNode(null);
      if(hoveredNode!=firstClickedNode){ 
        //if the firstClickNode arrives through parameter we need to highlight.
        //if we clicked it though the canvas it is already highlighted 
        highlightAdjacentNodes(firstClickedNode);
      }
    }else{
      setEdgeSelectionMode(null);
      setSecondClickedNode(null);
      setSelectedEdge(null)
      removeHighlight();
    }
    setClickedNode(null)
  }, [firstClickedNode]);


  const highlightAdjacentNodes= (coreNode) => {
    const hoveredColor = sigma.getNodeDisplayData(coreNode).color; //gets the color of the current hovered node

    //non-neighboring edges change to NODE_FADE_COLOR
    sigma.setSetting("nodeReducer", (node, data) => {
      return node === coreNode || graph.areNeighbors(node, coreNode)
        ? { ...data }
        : { ...data, label: "", color: NODE_FADE_COLOR };
    });

    //sets the neighboring edges to hovered color and thickens them and sets non-neighboring edges to EDGE_FADE_COLOR
    sigma.setSetting(
      "edgeReducer",
      (edge, data) =>
        graph.hasExtremity(edge, coreNode)
          ? { ...data, size: data.size * 2 } // to add hovering color: color: hoveredColor
          : { ...data, color: EDGE_FADE_COLOR } // add "hidden: true" to hide edges
    );
  
  }

  //removes any highlighting (nodes or edges) on the canvas
  const removeHighlight = () =>{
    sigma.setSetting("nodeReducer", null);
    sigma.setSetting("edgeReducer", null);
  }

  // when node is hovers it highlights its neighboring nodes and edges
  useEffect(() => {
    if(!edgeSelectionMode){ // if edgeSelectionMode is on ignore highlighting
      if (hoveredNode) { //node is hovered
        highlightAdjacentNodes(hoveredNode);
      
      } else {//node is un-hovered (value is null)
        removeHighlight();
      }
  }
  }, [hoveredNode]); //runs when hoveredNode value changes

  
  //used to figure out if the clickedNode is the first node or second node
  useEffect(() => {
    if(clickedNode){
      if(!edgeSelectionMode){ // we need to set first node 
        setFirstClickedNode(clickedNode);
      }
      else {
        if(graph.areNeighbors(clickedNode, firstClickedNode)){ //can be a second selection node
          setSecondClickedNode(clickedNode);
      
        } else { //cancel selection mode (clicked on node that is not a adjacent node)
          setFirstClickedNode(null);

        }
      }
    } 

  }, [clickedNode]);

  //for edge highlighting when an edge is selected
  useEffect(() => {
   if(secondClickedNode){
    const highlightEdge = graph.edge(firstClickedNode, secondClickedNode)
    setSelectedEdge(highlightEdge);
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
          highlightEdge===edge
            ? { ...data, size: data.size * 2 } //// to add hovering color: color: hoveredColor
            : { ...data, color: EDGE_FADE_COLOR } // add "hidden: true" to hide edges
      );
    setClickedNode(null)
   }
  }, [secondClickedNode]);

  const getGraphEvents = () => {
    const events = {
      /*
      doubleClickNode: ({ node }) => {
        window.open(`http://localhost:3000/${node}`); //when a node is double clicked it opens a /new window based on the node they clicked
      },
      */
      clickNode: ({ node }) => {
        let camera = sigma.getCamera();
        let zoom_ratio = 0.5;
        let zoom_factor = camera.ratio/zoom_ratio
        camera.animate(sigma.getNodeDisplayData(node), {duration: 500})
        //camera.animatedZoom({duration: 50, factor: zoom_factor});
        //camera.x = sigma.getNodeDisplayData(node).x;
        //camera.y = sigma.getNodeDisplayData(node).y;
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
        setFirstClickedNode(null);
      }
    };
    return events;
  };

  return null;
};

const GetSigma = () => {
  return sigma;
}

export {GraphEvents, GetSigma};
