import Graph from "graphology";
import {random } from 'graphology-layout';
import forceAtlas2 from 'graphology-layout-forceatlas2';
// used graphology: https://graphology.github.io/
const GraphDefinition= () =>{
   
    const graph = Graph.from(getGraphFromNeptune());
  
    random.assign(graph); //assigns each node a random x,y value between [0,1]
    forceAtlas2.assign(graph, {iterations: 100}); //assigns nodes x,y values with force directed

    return graph;
}

const getGraphFromNeptune= ()=>{
  //This function is temporary to fake getting data from Neptune
  const jsonGraph = {
    attributes:{},
    nodes:[
      {key:'A', attributes: {label: "A",size:10}},
      {key:'B', attributes:{label: "B",size:10}},
      {key:'C', attributes:{label: "C", size:7}},
      {key:'D', attributes:{label: "D",size:15}},
    ],
    edges:[
      {key:'AB',source:'A',target:'B',undirected:true},
      {key:'CD',source:'C',target:'D',undirected:true},
      {key:'BD',source:'B',target:'D',undirected:true},
      {key:'AD',source:'A',target:'D',undirected:true}
    ]
  }
  return jsonGraph;
}
export default GraphDefinition;
