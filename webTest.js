
const fs = require('fs');

function parseFile(fileName) {

  fs.readFile(`./${fileName}`, 'utf8', (err, data) => {
    if (err) return console.log(err);
    console.log(data);
  })

}

parseFile('test.txt');

//Takes a list of stops [A, B, C, D] etc and checks if there's a 
//route between them checks length, if not prints "NO SUCH ROUTE"
function getRouteLength(stopList) {
  
}


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