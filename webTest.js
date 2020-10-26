
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

async function parseFile(fileName) {

  await fs.readFile(`./${fileName}`, 'utf8', (err, data) => {
    if (err) {
      console.log("    ERROR: File could not be loaded");
    }

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
    console.log("    File loaded successfully");
  })

}

function createAdjacencyMatrix(parts, distinctCount) {
  adjMatrix = [];

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
    if (distance == -1) return "NO SUCH ROUTE";
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
  return count;
}

function getCost(firstStop, secondStop) {
  const firstIndex = firstStop.charCodeAt(0) - 65;
  const secondIndex = secondStop.charCodeAt(0) - 65;
  return adjMatrix[firstIndex][secondIndex];
}

function checkCosts(queue, curLowest) {
  if (queue.length == 0) return true;
  for (let i = 0; i < queue.length; i++) {
    if (queue[i].cost <= curLowest) return true;
  }
  return false;
}

//Finds the shortest length route between two stops
function findLowestCost(firstStop, lastStop) {
  //Need to use BFS, but also take into account the weights
  //Simply, just keep going until all weights in the queue are above the lowest found
  let queue = [];
  queue.push({node: firstStop, cost: 0});
  let currentLowest = 0;

  while (queue.length > 0) {
    const {node, cost} = queue.shift();
    

    if (node == lastStop && (cost < currentLowest || currentLowest == 0)) {
      currentLowest = cost;
    }

    //Exit condition
    if (currentLowest != 0 && !checkCosts(queue, currentLowest)) return currentLowest;

    const neighbours = getNeighbors(node);
    for (let i = 0; i < neighbours.length; i++) {
      queue.push({
        node: neighbours[i], 
        cost: cost + getCost(node, neighbours[i])
      })
    }

  }
  return currentLowest;
}

//Finds all routes under a certain distance between a and b
function findPathsUnder(firstStop, lastStop, maxDistance) {
  
  let count = 0;
  let queue = [];
  queue.push({node: firstStop, cost: 0});

  while (queue.length > 0) {
    const {node, cost} = queue.shift();

    if (!cost == 0 && node == lastStop && cost < maxDistance) {
      count++;
    }

    //Exit condition
    if (!checkCosts(queue, maxDistance)) return count;

    const neighbours = getNeighbors(node);
    for (let i = 0; i < neighbours.length; i++) {
      queue.push({
        node: neighbours[i], 
        cost: cost + getCost(node, neighbours[i])
      })
    }

    //Clean list
    queue = queue.filter((elem) => elem.cost <= maxDistance);

  }
  return count;
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

async function runCode() {
  while (!loaded) {
    await sleep(500);
  }

  console.log("Loaded");
  console.log(adjMatrix);

  console.log("TEST 1:");
  console.log(getRouteLength(['A', 'B', 'C']));
  console.log("TEST 2:");
  console.log(getRouteLength(['A', 'D']));
  console.log("TEST 3:");
  console.log(getRouteLength(['A', 'D', 'C']));
  console.log("TEST 4:");
  console.log(getRouteLength(['A', 'E', 'B', 'C', 'D']));
  console.log("TEST 5:");
  console.log(getRouteLength(['A', 'E', 'D']));
  console.log("TEST 6:");
  console.log(findRoutes('C', 'C', 3));
  console.log("TEST 7:");
  console.log(findRoutes('A', 'C', 5, true));
  console.log("TEST 8:");
  console.log(findLowestCost('A', 'C'));
  console.log("TEST 9:");
  console.log(findLowestCost('B', 'B'));
  console.log("TEST 10:");
  console.log(findPathsUnder('C', 'C', 30));

}

//runCode();


const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

async function runCLI() {

  const validResponses = ['l', 'q', 'x'];

  while (true) {
    
    let asking = true; 

    const selectionString = `
    Healthcare Logic Graph Traversal CLI\n
    (l) -> Load data from a text file\n
    (q) -> Run a query on the data\n
    (x) -> Exit the CLI\n
    Choose an option: `;
  
    response = '';
  
    readline.question(selectionString, option => {
      response = option;
      asking = false;
    });
  
    
    while(asking) {
      await sleep(500);
    }

    if (!validResponses.includes(response)) {
      console.log(`\n\n    ${response} is an invalid command, please try again.`);
    } else {
      if (response == 'x') {
        console.log("    EXITING APPLICATION\n");
        readline.close();
        break;
      }
      if (response == 'l') {
        await loadFile()
        await (sleep(1500));
      };
      if (response == 'q') console.log("Preparing query");
    }
  
  }

}

async function performQuery() {
  
}

async function loadFile() {

  let asking = true; 

  const selectionString = `\n    Enter the filename: `;

  response = '';

  readline.question(selectionString, option => {
    response = option;
    asking = false;
  });

  while(asking) {
    await sleep(500);
  }

  parseFile(response);

}

runCLI();

