let fs = require('fs');
let parse = require('csv-parse');
let async = require('async');

let polygons = [];
let triangles = [];
let squares = [];
let rectangles = [];
let others = [];
let allPolygons = [];

/**
 * Main function to parse CSV file,
 * create polygons subsets and 
 * finally check if the union
 * of the polygon equals subset
 * or not!
 */
let parser = parse ( 

  { delimiter: '\n' }, 

  function (err, data) {

    async.eachSeries(data,  
      
      function (line, callback) {

        polygons.push(line);
        
        findPolygonType(line).then( function(returnVal) {
          callback();
        }).catch( err => {
          console.log("Invalid Polygon With Values: " + line);
        });
      })
  });


/**
 * Create a subset from a single CSV row
 * 
 * @param String line A single row of CSV file
 * 
 * @return Promise
 */
function findPolygonType( line ) {
  return new Promise((resolve, reject) => {

    for (let i = 0; i < line.length; i++) {
      set = [];
      set = line[i].split(',');

      if ( set.length < 3 ) reject();

      if ( set.length === 3 ) {
        
        triangles.push(line);

      } else if (set.length === 4) {

          set.sort();
          
          if ( set[0] === set[3] ) {
             squares.push(line);

          } else if (
             ( set[0] === set[1] ) && ( set[2] === set[3] ) 
          ) {
              rectangles.push(line);
          
          } else {
              others.push(line);
          }
      } else {
          others.push(line);
      }
    }

    ret = { 'triangles': triangles, 'squares':squares, 'rectangles': rectangles, 'others': others };
    
    if ( validateSubset ( polygons, ret ) ) {
      resolve(ret);
    }

    reject(line);
    
  });
}

/**
 * Checks if the union of the subset of polygons, are same or not  
 * 
 * @param String[][] polygonsArray 
 * @param String [][] ret 
 * 
 * @return Bool
 */
function validateSubset( polygonsArray, ret ) {
  let subsetsUnionString = ret.triangles.concat(ret.squares.concat(ret.rectangles.concat(ret.others))).join(',').split(',').sort().join(',');
  let polygonsString = polygonsArray.join(',').split(',').sort().join(',');

  if ( subsetsUnionString === polygonsString ) return true;
  
  return false;
}

fs.createReadStream('./polygon.csv').pipe(parser);