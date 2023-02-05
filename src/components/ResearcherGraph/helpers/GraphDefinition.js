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
      {key:'A', attributes: {label: "A",size:10,color:"blue"}},
      {key:'B', attributes:{label: "B",size:10,color:"green"}},
      {key:'C', attributes:{label: "C", size:7,color:"red"}},
      {key:'D', attributes:{label: "D",size:15,color:"purple"}},
    ],
    edges:[
      {key:'AB',source:'A',target:'B',undirected:true,attributes:{ size:2, color: "black"}},
      {key:'CD',source:'C',target:'D',undirected:true, attributes:{ size:3, color: "black"}},
      {key:'BD',source:'B',target:'D',undirected:true,attributes:{ size:2, color: "black"}},
      {key:'AD',source:'A',target:'D',undirected:true,attributes:{ size:5, color: "black"}}
    ]
  }
  return jsonGraph;
}
export default GraphDefinition;
