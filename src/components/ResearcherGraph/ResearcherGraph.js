import React, { useState, useEffect } from "react";
import "@react-sigma/core/lib/react-sigma.min.css";
import {
  SigmaContainer,
  ControlsContainer,
  ZoomControl,
  FullScreenControl,
} from "@react-sigma/core";
import { Container,Box, Card, Grid, IconButton, Accordion,AccordionSummary,AccordionDetails, CardContent,ToggleButton,ToggleButtonGroup, Typography} from "@mui/material";
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
import { GetSigma } from "./helpers/GraphEvents";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'
import {FacultyFiltersDialog,COLOR_OBJECT} from "../FacultyFiltersDialog";

import {
  getResearcher,
  getSharedPublications,
  getSimilarResearchers,
} from "../../graphql/queries";

Amplify.configure(awsmobile);
Auth.configure(awsmobile);

const ResearcherGraph = (props) => {
  const [graph, setGraph] = useState(null);
  // const [selectedNode, setSelectedNode] = useState(null);
  // const [selectedEdge, setSelectedEdge] = useState(null);

  const [selectedResearcher, setSelectedResearcher] = useState(null);
  const [similarResearchers, setSimilarResearchers] = useState(null);

  const [edgeResearcherOne, setEdgeResearcherOne] = useState(null);
  const [edgeResearcherTwo, setEdgeResearcherTwo] = useState(null);
  const [sharedPublications, setSharedPublications] = useState([]);

  const [selectedDepth, setSelectedDepth] = useState(null);

  const [detailsExpanded, setDetailsExpanded]= useState(true)
  const [graphState, setGraphState ] = useState("loading")
  const [tempGraph, setTempGraph ] = useState(null)
  
  useEffect(() => {
    if(props.researcherNodes ===null || props.graphEdges === null){
      setGraphState("loading");
    }
    //if there are no nodes found, no graph is not displayed
    else if(!props.researcherNodes.length){
      setGraphState("empty");
    } 
    else{
      switch(props.graphProgress){
        case 20:
          const jsonGraph = {
            attributes:{},
            nodes: props.researcherNodes,
            edges: props.graphEdges,
          }
    
          const graph = Graph.from(jsonGraph)
          graph.forEachNode((key,attributes)=>{
            const numOfNeighbors = graph.neighbors(key).length
            const size = 3-20/(numOfNeighbors+9)
    
            if(size>0){
              graph.setNodeAttribute(key,'size',size)
            }
          })
          
          setTempGraph(graph)
          props.setGraphProgress(30)
        break;
        case(30):
          random.assign(tempGraph); //assigns each node a random x,y value between [0,1]
          props.setGraphProgress(40)
        break;
        case(40):
        forceAtlas2.assign(tempGraph, {iterations: 20});
        props.setGraphProgress(50)
        break;
        case(50):
        forceAtlas2.assign(tempGraph, {iterations: 20});
        props.setGraphProgress(60)
        break;
        case(60):
        forceAtlas2.assign(tempGraph, {iterations: 20});
        props.setGraphProgress(70)
        break;
        case(70):
        forceAtlas2.assign(tempGraph, {iterations: 20});
        props.setGraphProgress(80)
        break;
        case(80):
        forceAtlas2.assign(tempGraph, {iterations: 20});
        props.setGraphProgress(90)
        break;
        case(90):
        setGraph(tempGraph)
        setGraphState("finished");
        break;
      }   
    }
  }, [props.researcherNodes, props.graphEdges, props.graphProgress])

  //On change of the selected node get information on the researcher
  useEffect(() => {
    console.log("triggered")
    if(props.selectedNode) {
      console.log("here")
      getResearcherFunction(selectedResearcher);
      setSelectedDepth(1);
    } else{
      setSelectedResearcher(null);
      setSimilarResearchers(null);
    }
  }, [props.selectedNode])

  useEffect(() => {
    if(props.selectedEdge) {
      getEdgeInformation();
    }else{
      setEdgeResearcherOne(null);
      setEdgeResearcherTwo(null);
      setSharedPublications([]);
    }
  }, [props.selectedEdge])

  useEffect(() => {
    if(selectedDepth) {
      const [nodeIDs,firstEdgeIDs,secondEdgeIDs,thirdEdgeIDs] = getNeighborhood(props.selectedNode,selectedDepth);
      const sigma = GetSigma();
      sigma.setSetting("nodeReducer", (node, data) => {
        return nodeIDs.has(node)
          ? { ...data,zIndex:1 }
          : { ...data, label: "",zIndex: 0, hidden:true };
      });
      sigma.setSetting("edgeReducer", (edge, data) => {
        if(firstEdgeIDs.has(edge)){
          return { ...data, size: data.size, color: "#585858"}
        }
        else if(secondEdgeIDs.has(edge)){
          return { ...data, size: data.size, color: "#8A8A8A"}
        }
        else if(thirdEdgeIDs.has(edge)){
          return { ...data, size: data.size, color: "#BCBCBC"}
        }
        else{
          return { ...data, hidden: true };
        }
      });
    }
  }, [selectedDepth])

  const getNeighborhood = (centerNode, depth) => {
    let neighborhoodNodes = new Set([centerNode])
    let firstEdges = new Set([])
    let secondEdges = new Set([])
    let thirdEdges = new Set([])
    graph.forEachNeighbor(centerNode,(firstNeighbor,attributes)=>{
      neighborhoodNodes.add(firstNeighbor)
      firstEdges.add(graph.edge(centerNode,firstNeighbor))
      if(depth==1){
        return [neighborhoodNodes,firstEdges,secondEdges,thirdEdges];
      }
      graph.forEachNeighbor(firstNeighbor,(secondNeighbor,attributes)=>{
        neighborhoodNodes.add(secondNeighbor)
        secondEdges.add(graph.edge(firstNeighbor,secondNeighbor))
        if(depth==2){
          return [neighborhoodNodes,firstEdges,secondEdges,thirdEdges];
        }
        graph.forEachNeighbor(secondNeighbor,(thirdNeighbor,attributes)=>{
          neighborhoodNodes.add(thirdNeighbor)
          thirdEdges.add(graph.edge(secondNeighbor,thirdNeighbor))
            return [neighborhoodNodes,firstEdges,secondEdges,thirdEdges];
        })
      })
    })
    return [neighborhoodNodes,firstEdges,secondEdges,thirdEdges];
  }

  const getResearcherFunction = async () => {
    let result = await API.graphql({
      query: getResearcher,
      variables: {"id": props.selectedNode}
    });
    let researcher = result.data.getResearcher;
    setSelectedResearcher(researcher);

    result = await API.graphql({
      query: getSimilarResearchers,
      variables: {"researcher_id": researcher.id}
    });
    let similarResearchers = result.data.getSimilarResearchers;
    console.log(similarResearchers);
    setSimilarResearchers(similarResearchers);
  }

  const getEdgeInformation = async () => {
    let researchersIds = props.selectedEdge.split("&&");
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
    props.setCurrentlyAppliedKeywordFilter(props.keywordFilter)
    props.setCurrentlyAppliedFaculties(props.selectedFaculties);
    props.setOpenFacultyFiltersDialog(false);
  }

  const handleClose = () => {
    props.setOpenFacultyFiltersDialog(false);
    props.setSelectedFaculties(props.currentlyAppliedFaculties);
    props.setKeywordFilter(props.currentlyAppliedKeywordFilter);
  };

  const handleSelectedDepth = (event, newValue) =>{
    if (newValue !== null) {
      setSelectedDepth(newValue);
    }
  }

  const PotentialConnections = ()=>{
    const MAX_POTENTIAL_CONNECTIONS = 5;

    const ResearchersList = ()=>{
     
      const researchersCards = [];
      for(let i=0; i<Math.min(similarResearchers.length, MAX_POTENTIAL_CONNECTIONS); i++){
        const researcher = similarResearchers[i]
        researchersCards.push(
          <Card key={i}  id="researchers-list-card">
              <CardContent id="researchers-list-card-content">
                <Typography variant="body1" color="#002145">
                  <b>{researcher.firstName + " " + researcher.lastName}</b>
                </Typography>
                <Typography variant="body2" color="#404040">
                {researcher.faculty}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                 <b>Keywords shared ({researcher.sharedKeywords.length}):</b> {researcher.sharedKeywords.join(", ")}
                </Typography>
              </CardContent>
            </Card>
        )
      }
        return researchersCards;
    }
    return (
      <Accordion disableGutters id="accordion">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="body1">Potential Connections</Typography>
        </AccordionSummary>
        <AccordionDetails id="accordion-details">
          {similarResearchers ?
          <Card id="accordion-details-card">
            <CardContent id="potential-connections-card-content">
            {similarResearchers.length==0 ?
              <Typography variant="body2" color="text.secondary">No potential connections found.</Typography>
            :<>
              <Typography variant="caption" color="text.secondary">
                These researchers have not collaborated with {selectedResearcher.firstName + " " + selectedResearcher.lastName} but share similar research topics.
              </Typography>
              <ResearchersList/>
            </>
            }
            </CardContent>
          </Card>
          :(<center><CircularProgress color="inherit" /></center>)}
        </AccordionDetails>
      </Accordion>
     
    );
  }

  function CircularProgressWithLabel(props) { //from mui material-ui 
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress variant="determinate" {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <div className="Researcher-Graph">
      <Grid container spacing={0} direction="row">
        <Grid item xs={4} className="side-panel" id="sidePanel">
          <Accordion disableGutters id="accordion">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body1">Graph Legend</Typography>
            </AccordionSummary>
            <AccordionDetails id="accordion-details">
              <Card id="graph-legend">
                {props.selectedFaculties.length==0 ?
                  props.facultyOptions.map((faculty,index) => (
                    <Typography key={index} variant="body2"><IconButton disabled><FiberManualRecordIcon style={{ color: COLOR_OBJECT[faculty] }} /></IconButton>{faculty}</Typography>
                )): 
                  props.currentlyAppliedFaculties.map((faculty,index) => (
                    <Typography key={index} variant="body2"><IconButton disabled><FiberManualRecordIcon style={{ color: COLOR_OBJECT[faculty] }} /></IconButton>{faculty}</Typography>
                ))}
              </Card>
            </AccordionDetails>
          </Accordion>
          {props.selectedNode && !props.selectedEdge && (
              <PotentialConnections/>
          )}
          {/** Shows information on selected node and edge*/}
          <Accordion disableGutters expanded={detailsExpanded} onChange={()=>setDetailsExpanded(!detailsExpanded)} id="accordion">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body1">Graph Details</Typography>
            </AccordionSummary>
            <AccordionDetails id="accordion-details">
              <Card id="accordion-details-card">
                <CardContent>
                  {props.selectedNode && !props.selectedEdge && (
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
                      <Typography variant="subtitle2" color="#002145">
                        <b>Change Levels of Connection</b>
                      </Typography>
                      <ToggleButtonGroup 
                          value={selectedDepth}
                          exclusive
                          onChange={handleSelectedDepth}
                          size="small"
                      >
                        <ToggleButton value={1}>
                          1<sup>st</sup>
                        </ToggleButton>
                        <ToggleButton value={2}>
                          2<sup>nd</sup>
                        </ToggleButton>
                        <ToggleButton value={3}>
                          3<sup>rd</sup>
                        </ToggleButton>
                      </ToggleButtonGroup>
                      <br/>
                      <br/>
                      <Typography variant="caption" color="text.secondary">
                        Click on connected node to see information about how they
                        are connected
                      </Typography>
                    </>
                    ) : (<center><CircularProgress color="inherit" /></center>)
                  )}
                  {props.selectedEdge && (
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
                        <b>Shared Publications ({sharedPublications.length})</b> 
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {publications}
                      </Typography>
                    </>
                    ) : (<center><CircularProgress color="inherit" /></center>)
                  )}
                  {!props.selectedNode && (
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
                keywordFilter={props.keywordFilter}
                setKeywordFilter={props.setKeywordFilter}
              />
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={8} id='graph'>
          <Container maxWidth={false}>
            {/* sets the width of the graph -scales to the size of the page */}
            { graphState === "finished" ? (
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
                  firstClickedNode={props.selectedNode}
                  setFirstClickedNode={props.setSelectedNode}
                  selectedEdge={props.selectedEdge}
                  setSelectedEdge={props.setSelectedEdge}
                />
                <ControlsContainer position={"bottom-right"}>
                  <ZoomControl />
                  <FullScreenControl />
                </ControlsContainer>
              </SigmaContainer>
            </Card>
            ) : (graphState==="loading"? ( <center>
                  <CircularProgressWithLabel value={props.graphProgress} />
                  <Typography gutterBottom variant="h5" color="#002145" margin="0px" component="div">
                        <b>Graph loading in progress...</b> 
                      </Typography>
                      <Typography gutterBottom variant="h6" color="#002145" margin="0px" component="div">
                        This might take a moment
                      </Typography>
                </center>
              ):
              <center>
                  <Typography gutterBottom variant="h5" color="#002145" margin="0px" component="div">
                        <b>No results found</b> 
                      </Typography>
                  <Typography gutterBottom variant="h6" color="#002145" margin="0px" component="div">
                    Change the graph's filters to view more data.
                  </Typography>
                </center>
               )}
          </Container>
        </Grid>
      </Grid>
    </div>
  );
};

export default ResearcherGraph;
