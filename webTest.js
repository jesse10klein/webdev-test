
const fs = require('fs');

let adjMatrix = [];
let loaded = false;

/*
  For this problem, I'm going to assume that the number of inputs
  are relatively small, this way we can use an adjacency matrix
  to represent the directional graph
*/


function parseFile(fileName) {

  fs.readFile(`./${fileName}`, 'utf8', (err, data) => {
    if (err) return console.log(err);

    //Get a list similar to the inputs, then create matrix
    const parts = data.split('\r\n');

    //We also need to get the distinct count to know how big to
    //make the matrix
    let unique = [];
    for (let i = 0; i < parts.length; i++) {
      if (!unique.includes(parts[i].charAt(0))) {
        unique.push(parts[i].charAt(0));
      }
    }

    createAdjacencyMatrix(parts, unique.length);
  })

}

function createAdjacencyMatrix(parts, distinctCount) {
  console.log("ET")
  //Start off by making a matrix n*n initialised to -1
  for (let i = 0; i < distinctCount; i++) {
    adjMatrix.push([]);
    for (let j = 0; j < distinctCount; j++) {
      adjMatrix[i].push(-1);
    }
  }
  
  //Now add the info from the text file to the matrix
  for (let i = 0; i < parts.length; i++) {
    const routeInfo = parts[i].split('');
    const stopAIndex = routeInfo[0].charCodeAt(0) - 65;
    const stopBIndex = routeInfo[1].charCodeAt(0) - 65;
    const distance = parseInt(routeInfo[2]);
    adjMatrix[stopAIndex][stopBIndex] = distance;
  }
  loaded = true;
  console.log("Loaded :)")
}

//Takes a list of stops [A, B, C, D] etc and checks if there's a 
//route between them checks length, if not prints "NO SUCH ROUTE"
function getRouteLength(stopList) {
  
  console.log("HERE");
  console.log(adjMatrix);

  let totalDistance = 0;

  for (let i = 1; i < stopList.length; i++) {
    const stopAIndex = stopList[i-1].charCodeAt(0) - 65;
    const stopBIndex = stopList[i].charCodeAt(0) - 65;
    const distance = adjMatrix[stopAIndex][stopBIndex];
    if (distance == -1) {
      console.log("NO SUCH ROUTE");
      return;
    }
    totalDistance += distance;
  }
  return totalDistance;
}

parseFile('test.txt');


//Finds the routes between the first and last stop with routes
//having a max length of maxLength. If restricted, we want paths
//that are only of maxLength
function findRoutes(firstStop, lastStop, maxLength, restricted) {

}


//Finds the shortest length route between two stops
function findShortestRoute(firstStop, lastStop) {

}


//Finds all routes under a certain distance between a and b
function findPathsUnder(firstStop, lastStop, maxDistance) {

}