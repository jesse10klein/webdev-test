
const fs = require('fs');

let adjMatrix = [];
let loaded = false;

/*
  For this problem, I'm going to assume that the number of inputs
  are relatively small, this way we can use an adjacency matrix
  to represent the directional graph
*/

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function parseFile(fileName) {

  fs.readFile(`./${fileName}`, 'utf8', (err, data) => {
    if (err) console.log(err);

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
}

//Takes a list of stops [A, B, C, D] etc and checks if there's a 
//route between them checks length, if not prints "NO SUCH ROUTE"
function getRouteLength(stopList) {
  
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


//Finds the routes between the first and last stop with routes
//having a max length of maxLength. If restricted, we want paths
//that are only of maxLength
function findRoutes(firstStop, lastStop, maxLength, restricted=false) {
  //Queue, push to back, pop from front
  //Since we want to track the limits, create object with iteration
  let queue = [];
  queue.push({node: firstStop, iteration: 1});
  let count = 0;

  while (queue.length > 0) {
    const {node, iteration} = queue.shift();
    if (iteration > maxLength) return count;
    if (node == lastStop) {
      if (!restricted || (iteration == maxLength)) {
        count += 1
      }
    }
    const neighbours = getNeighbors(node);
    for (let i = 0; i < neighbours.length; i++) {
      queue.push({node: neighbours[i], iteration: iteration + 1})
    }
  }
}


//Finds the shortest length route between two stops
function findShortestRoute(firstStop, lastStop) {
  //Here we just use simple bfs
}


//Finds all routes under a certain distance between a and b
function findPathsUnder(firstStop, lastStop, maxDistance) {

}

function getNeighbors(letter) {
  neighbours = [];
  for (let i = 0; i < adjMatrix.length; i++) {
    if (adjMatrix[letter.charCodeAt(0) - 65][i] != -1) {
      neighbours.push(String.fromCharCode(i + 65));
    }
  }
  return neighbours;
}

//Here we need to find all paths 
function performBFS(start, end, limit) {

}



parseFile('test.txt');

async function runCode() {
  while (!loaded) {
    await sleep(500);
  }

  console.log("Loaded");
  console.log(adjMatrix);

  // console.log("TEST 1:");
  // console.log(getRouteLength(['A', 'B', 'C']));
  // console.log("TEST 2:");
  // console.log(getRouteLength(['A', 'D']));
  // console.log("TEST 3:");
  // console.log(getRouteLength(['A', 'D', 'C']));
  // console.log("TEST 4:");
  // console.log(getRouteLength(['A', 'E', 'B', 'C', 'D']));
  // console.log("TEST 5:");
  // console.log(getRouteLength(['A', 'E', 'D']));
  console.log("TEST 6:");
  console.log(findRoutes('C', 'C', 3));
  console.log("TEST 7:");
  console.log(findRoutes('A', 'C', 5, true));

}

runCode();

