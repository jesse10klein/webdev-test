
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

//Parses a data file
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

//Creates an adjacency matrix to represent the graph based on the parsed file
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

//Takes a list of stops [A, B, C, D] etc and checks if there's a route between them. checks length, if not prints "NO SUCH ROUTE"
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


//Finds the routes between the first and last stop with routes having a max length of maxLength. If restricted, we want paths that are only of maxLength
function findRoutes(firstStop, lastStop, maxLength, restricted=false) {

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

//Gets the cost of moving from one stop to another
function getCost(firstStop, secondStop) {
  const firstIndex = firstStop.charCodeAt(0) - 65;
  const secondIndex = secondStop.charCodeAt(0) - 65;
  return adjMatrix[firstIndex][secondIndex];
}

//Checks if all costs in the queue are above a certain cost (to prove we have the lowest cost path)
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

//Given a node, gets the connected to the initial node
function getNeighbors(letter) {
  neighbours = [];
  for (let i = 0; i < adjMatrix.length; i++) {
    if (adjMatrix[letter.charCodeAt(0) - 65][i] != -1) {
      neighbours.push(String.fromCharCode(i + 65));
    }
  }
  return neighbours;
}


const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

//Starts the application, user gives input to run queries and load data
async function runCLI() {

  const validResponses = ['l', 'q', 'x'];

  while (true) {
    
    let asking = true; 

    const selectionString = `
    Healthcare Logic Graph Traversal CLI
    (l) -> Load data from a text file
    (q) -> Perform queries from text file
    (x) -> Exit the CLI
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
        await loadFile();
        await (sleep(1500));
      };
      if (response == 'q') {
        if (adjMatrix.length == 0) {
          console.log("\n    You need to add data first!");
          continue;
        }
        await performTestQueries();
        await (sleep(4000));
      }
    }
  
  }

}

//Loads a file the user gives, then runs the queries outlined in that file
async function performTestQueries() {
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

  parseQueryFile(response);

}

//Loads a data file with the name given by the user
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

//Loads a query file, separates the queries and runs each one
async function parseQueryFile(fileName) {

  await fs.readFile(`./${fileName}`, 'utf8', (err, data) => {
    if (err) {
      console.log("    ERROR: File could not be loaded");
    }

    //Get a list similar to the inputs, then create matrix
    const lines = data.split('\r\n');

    const acceptableQueryTypes = ['Direct', 'TripsMax', 'TripsExact', 'ShortestLength', 'AllPathsBelow'];
    for (let i = 0; i < lines.length; i++) {
      const lineParts = lines[i].split(' ');
      if (!acceptableQueryTypes.includes(lineParts[0])) {
        console.log("    ERROR: Incorrect Query File Format");
        return;
      }
      runQuery(lineParts[0], lineParts.slice(1));
    }
  })
}

//Runs a given query
function runQuery(type, params) {
  
  if (type == 'Direct') {
    console.log(`    Testing direct path from ${params[0]} to ${params[params.length - 1]}`);
    console.log('    Answer: ' + getRouteLength(params));
  }

  if (type == 'TripsMax') {
    console.log(`    Testing trips max from ${params[0]} to ${params[1]} with max stops ${params[2]}`);
    console.log('    Answer: ' + findRoutes(params[0], params[1], params[2]));
  }

  if (type == 'TripsExact') {
    console.log(`    Testing trips exact from ${params[0]} to ${params[1]} with exact stops ${params[2]}`);
    console.log('    Answer: ' + findRoutes(params[0], params[1], parseInt(params[2])+1, true));
  }

  if (type == 'ShortestLength') {
    console.log(`    Testing for the shortest path between ${params[0]} and ${params[1]}`);
    console.log('    Answer: ' + findLowestCost(params[0], params[1]));
  }

  if (type == 'AllPathsBelow') {
    console.log(`    Finding all paths below ${params[2]} cost between ${params[0]} and ${params[1]}`);
    console.log('    Answer: ' + findPathsUnder(params[0], params[1], params[2]));
  }
  console.log('\n');
  return;
}

runCLI();