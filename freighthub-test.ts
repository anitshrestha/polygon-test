/// <reference path="node.d.ts" />
/// <reference path="a-type-definition-for-node-csv.d.ts" />

import fs = require('fs');
import parse = require('node-csv');

var parser = parse({delimiter: ','}, function(err, data) {
    console.log(data);
});

fs.createReadStream(__dirname+'/fs_read.csv').pipe(parser);