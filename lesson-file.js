//THIS IS THE WAY INDEX.JS SHOULD LOOK LIKE AND IT IS A LESSON FROM INDEX.JS BEFORE MOVING EVERYTHING TO THIS LESSON-FILE.JS

import http from "http";
import { generateLovePercent } from "./features.js";


//import fs from "fs";  //FOR HTML FILE
//import gfName from "./features.js";    //THIS CAN BE USED TO IMPORT A SINGLE FILE OR A SPECIFIC FILE
//import * as myObj from "./features.js"  //THIS CAN BE USED TO IMPORT ALL THE FILES IN A DOCUMENT

//console.log(generateLovePercent());   //OR CONSOLE.LOG(myObj.(DOT)a specific file you want)

/*const home = fs.readFile("./index.html", ()=> { //READING HTML FILE
    console.log("file Read");
});*/


const server = http.createServer((req, res) => {

    console.log(req.method);


    if(req.url === "/about") {
      res.end(`<h1>Love is ${generateLovePercent()}</h1>`);
    } else if(req.url === "/") {
      res.end("home");
    }
    /* else if(req.url === "/") {
        fs.readFile("./index.html", (err, home) => {              //TO READ HTML FILES
            res.end(home);
        });*/
      else if(req.url === "/contact") {
      res.end("<h1>Contact Page</h1>");
    }
      else {
      res.end("<h1>Page Not Found</h1>");
    }
})

server.listen(5000,() => {
    console.log("Server is working");
});