/**
 * Process CSV File with valid rows of polygons.
 * 
 * After processing CSV, it classify the set of 
 * polygons into four mutually exclusive subsets
 * i.e. triangles, rectangles, squares and others.
 * 
 * Then it will check if the union of all four 
 * subsets should be the original set of polygons. 
 *  
 * @param File 
 */
var processCSVFile = function( inputFile )  { 
    let csv = require('csvtojson');       
    let polygonsArray = [];
    let polygons = [];
    let polygonSubset = [];

    csv({noheader:true})
    .fromFile(inputFile)
    .on('csv', (polygon) => { 
        polygonsArray.push(polygon)
    })
    .on('done', ()=>{
        polygonSubset = findPolygonTypeRefactor(polygonsArray);
        let checkUnionOfSubsetMathces = validateSubset(polygonsArray, polygonSubset);

        console.log("Polygons ------- \n");
        console.log(polygonsArray);
        console.log("\nSubsets ------- \n");
        console.log(polygonSubset);
        console.log("\n");
        console.log("Does Union of Subsets Equals Polygon?(T/F) : " + checkUnionOfSubsetMathces );
    });

}

/**
 * Create a polygon subset from a single multidimensional array i.e. [[]]
 * 
 * @param String    line A single row of CSV file
 * 
 * @return Object   {triangels:[[]], squares:[[]], rectangles:[[]], others:[[]]}
 */
function findPolygonTypeRefactor( csvRows ) {
    let triangles = [];
    let squares = [];
    let rectangles = [];
    let others = [];

    csvRows.forEach(function(line) {
      line.sort(); 

      if ( line.length === 3 ) {
        
        triangles.push(line);

      } else if (line.length === 4) {
          
          if ( line[0] === line[3] ) {
             squares.push(line);

          } else if (
             ( line[0] === line[1] ) && ( line[2] === line[3] ) 
          ) {
              rectangles.push(line);
          
          } else {
              others.push(line);
          }
      } else {
          others.push(line);
      }
    });
     
    return { 'triangles': triangles, 'squares': squares, 'rectangles': rectangles, 'others': others };     
}

/**
 * Checks if the union of the subset of polygons, are same or not  
 * 
 * @param String[][] polygonsArray 
 * @param String [][] ret 
 * 
 * @return Bool
 */
function validateSubset( polygonsArray, polygonSubset ) {
    
    let subsetsUnionString = polygonSubset.triangles.concat(
      polygonSubset.squares.concat(
          polygonSubset.rectangles.concat(polygonSubset.others)
        )).join(',').split(',').sort().join(',');
  
    let polygonsString = polygonsArray.join(',').split(',').sort().join(',');

    if ( subsetsUnionString === polygonsString ) return true;

  return false;
}


module.exports.main = processCSVFile;