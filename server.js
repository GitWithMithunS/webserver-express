const http = require('http')
const path = require('path')
const fs = require('fs');
const fspromises = require('fs').promises;
const logevents = require('./logevent');
const EventEmitter = require('events');

class Emitter extends EventEmitter { };

const myemitter = new Emitter();
myemitter.on('log',(msg,filename) => logevents(msg,filename))

//define port
const PORT = process.env.port || 3500       //process.env.port this if the port is saved in a environment variable

//servering the file 
// const serverfile = async (filepath, contentType, response) => {
//     try {
//         const data = await fspromises.readFile(filepath, 'utf8');
//         response.writeHead(200, { 'Content-Type': contentType });
//         response.end(data);
//     } catch (error) {
//         console.log(error)
//         response.ststusCode = 500;
//         response.end();
//     }
// }
const serverfile = async (filepath, contentType, response) => {
    try {
        const rawdata = await fspromises.readFile(
            filepath,                                        //The includes method returns a boolean value true or false
            !contentType.includes('image') ? 'utf8' : ''   //If the content type does not include 'image', use the character encoding 'utf8'; otherwise, use an empty string as the character encoding.(if this is not done the image will not appear as it doesnt support utf8)
        );
        const data = contentType === 'aplication/josn'
            ? JSON.parse(rawdata) : rawdata
        response.writeHead(
            filepath.includes('404.html') ? 404 : 200,
            { 'Content-Type': contentType }
        );
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
        // console.log(JSON.parse(rawdata))    //check this in the terminal to know the difference between JSON.parse  , JSON.stringify
        // console.log(rawdata)
        // console.log(JSON.stringify(data))
    } catch (error) {
        console.log(error)
        myemitter.emit('log', `${error.name}\t${error.message}` , 'errlog.txt')
        response.ststusCode = 500;
        response.end();
    }
}

const server = http.createServer((req, res) => {
    console.log(req.url, req.method)
    myemitter.emit('log', `${req.url}\t${req.method}` , 'reqlog.txt')

    const extension = path.extname(req.url);

    let contentType;

    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
            break;
    }

    let filepath =
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'   //slice(-1)represents the last charcter of te url (-ve = reverse order) 
                ? path.join(__dirname, 'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, req.url)

    //makes the .html extension not required in the browser
    if (!extension && req.url.slice(-1) !== '/') filepath += '.html'

    //check if the file exists in thhat particular filepath
    const fileexists = fs.existsSync(filepath);

    //handle the file for both conditions (exits and not exists)
    if (fileexists) {
        //serve the file
        serverfile(filepath, contentType, res)
    } else {
        //it may be a 404 (err)
        //or it may be a 301 (redirect)
        console.log(path.parse(filepath))
        switch (path.parse(filepath).base) {   //path.parse(filepath).base this gives the file name (for more undersatnding check out the terminal for "console.log(path.parse(filepath))" this statement )
            case 'old-page.html':
                res.writeHead(301, { 'Location': '/new-page.html' })    //res.writeHead is a method in Node.js's HTTP module used to write the response header. It takes two parameters: the HTTP status code and an object representing the response headers.        The status code 301 indicates that the requested resource has permanently moved to a new location. The Location header provides the URL to which the client should be redirected. In this case, it is set to '/new-page.html'.
                res.end();              //res.end() is used to end the response without providing a response body. This is often used in conjunction with a redirection status code (e.g., 301 or 302) when the primary purpose is to instruct the client to follow the redirection.
                break;
            case 'www-page.html':
                res.writeHead(301, { 'Location': '/' })
                res.end();
                break;
            default:
                serverfile(path.join(__dirname, 'views', '404.html'), contentType, res)
            //server a 404 response (saying no file present asa per the request)
        }
    }
})

server.listen(PORT, () => console.log('server is running on port', PORT))