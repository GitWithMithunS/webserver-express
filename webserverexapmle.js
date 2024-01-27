//start from here (in terminal type 'node server' to check this page out)
//this page is just for understand the http module and also switch statement
const http = require('http')
const path = require('path')
const fs = require('fs');
const fspromises = require('fs').promises;
const logevents = require('./logevent');
const EventEmitter = require('events');

class Emitter extends EventEmitter { };

const myemitter = new Emitter();

//define port
const PORT = process.env.port || 3500       //process.env.port this if the port is saved in a environment variable

//creating a web server
const server = http.createServer((req, res) => {
    console.log(req.url, req.method)    //req.url: This property represents the URL (Uniform Resource Locator) of the incoming HTTP request. It contains the path and query parameters of the request.
    //req.method: This property represents the HTTP method (or verb) used in the request, such as "GET," "POST," "PUT," "DELETE," etc.

    let paths;

    if (req.url == '/' || req.url == 'index.html') {
        res.statusCode = 200; //statuscode=200 means successfull indicates that the server has successfully processed the request and is returning the requested resource.
        res.setHeader('Content-Type', 'text/html');   //content type is set to html/text -->  This header informs the client (e.g., a web browser) how to interpret the content.
        paths = path.join(__dirname, 'views', 'index.html')
        fs.readFile(paths, 'utf8', (err, data) => {
            res.end(data)            //send the data
        })
    }

    //an other way to do it
    // switch (req.url) {
    //     case '/':
    //         res.statusCode = 200; //means successful
    //         res.setHeader('Content-Type', 'text/html');   //content type is set to html/text
    //         paths = path.join(__dirname, 'views', 'index.html')
    //         fs.readFile(paths, 'utf8', (err, data) => {
    //             res.end(data)            //send the data
    //         })
    //         break
    // }

})

//listening to the port
server.listen(PORT, () => console.log('server is running on port', PORT))