import { useEffect, useState } from "react";
import { useSigma, useRegisterEvents } from "@react-sigma/core";

const NODE_FADE_COLOR = "#bbb";
const EDGE_FADE_COLOR = "#eee";
var sigma;

const GraphEvents = () => {
  sigma = useSigma();
  const graph = sigma.getGraph();
  const registerEvents = useRegisterEvents();
  const [hoveredNode, setHoveredNode] = useState(null);

  // use effect used to register the events
  useEffect(() => {
    registerEvents(getGraphEvents());
  }, [registerEvents]);

  // when node is hovers it highlights its neighboring nodes and edges
  useEffect(() => {
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
            ? { ...data, color: hoveredColor, size: data.size * 2 }
            : { ...data, color: EDGE_FADE_COLOR } // add "hidden: true" to hide edges
      );
    } else {
      //node is un-hovered (value is null)
      sigma.setSetting("nodeReducer", null);
      sigma.setSetting("edgeReducer", null);
    }
  }, [hoveredNode]); //runs when hoveredNode value changes

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
    };
    return events;
  };

  return null;
};

const GetSigma = () => {
  return sigma;
}

export {GraphEvents, GetSigma};
