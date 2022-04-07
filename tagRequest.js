const http = require('https');
const { parse } = require('node-html-parser');

//function to get a gif tag
module.exports = function(content) {
    /*
    let lines = content.split("\n");
    let probLinks = [];

    lines.forEach(line => {
      probLinks.push(line.split("https"));
    });

    probLinks = probLinks.filter(function (e) {
      return e != null;
    });


    let str = "";
    probLinks.forEach((l) => {
      l.forEach((l2) => {
        str += l2;
        str += " ";
      });
      str += "% ";
    });

    console.log(str);
    */

    //return a promise
    return new Promise((response, rej) => {
        //create a request
        http.get(content, (res) => {
          let chunks_of_data = [];
    
          res.on('data', (fragments) => {
            //Add the data to the array
            chunks_of_data.push(fragments);
          });
    
          res.on('end', () => {
            //convert the data to a string
            let response_body = Buffer.concat(chunks_of_data);
            
            //parse the html
            var root = parse(response_body.toString(), {
              blockTextElements: {
                comment: false,
                blockTextElements: false
              }
            });
            
            //get last meta tag with class "dynamic" and get it's attributes
            var meta = root.querySelector("meta[class='dynamic']");
            //get the attributes
            var attributes = meta.attributes;
            //Get content attribute
            var content = attributes.content;
            //split the content into an array of "tags"
            var tags = content.split(",");
    
            // promise resolved on success
            response(tags);
          });
    
          res.on('error', (error) => {
            // promise rejected on error
            rej(error);
          });
        })
      })
}