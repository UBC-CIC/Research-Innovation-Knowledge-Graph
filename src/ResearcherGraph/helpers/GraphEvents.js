const getGraphEvents = () => {
    const events = {
        doubleClickNode: (event) => {
          //console.log(event.node) //for debugging: returns the node id 
          window.open(`http://localhost:3000/${event.node}`) //when a node is double clicked it opens a /new window based on the node they clicked
        }
      }
      return events
  };

  export default getGraphEvents;