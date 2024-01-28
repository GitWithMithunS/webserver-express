//middlerware(three type -> built in middleware , custom middleware , 3rd-party middleware)
const express = require('express')
const app = express()    // instance of express
const path = require('path')
const cors = require('cors')
const PORT = process.env.port || 3300       //process.env.port this if the port is saved in a environment variable
const { logger } = require('./middleware/logevent')
const errorhandler = require('./middleware/errorhandler')

console.log(__dirname)



//custom middleware
app.use(logger)
// //custom middleware  (another way to do)
// const logevents = require('./middleware/logevent')
// app.use((req,res,next) =>{
//     logevents(`${req.method} \t${req.header.origin}\t ${req.url}` , 'reqlog.txt')    
//     console.log(`${req.method} \t ${req.path}`)
//     next()
// })

//3rd-party middleware     //cors-> cross origin resource sharing
//app.use(cors())  // enable all cors requests
const whitelist = ['https://www.yoursite.com', 'https://www.google.com', 'http://127.0.0.1:5500', 'http://localhost:3500'] //the site were u may run the code. (however u would want to remove 'http://127.0.0.1:5500','http://localhost:3500' after the development is completed.)
const corsOption = {    //read the documentations to get more idea of how this works
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin ) {   //if the domain is in the whitelist(evaluate if The origin is found in the whitelist or The origin is falsy)
            callback(null, true)           //If the origin is in the whitelist, the callback is called with null (no error) and true to indicate that the request is allowed.
        } else {                            //If the origin is not in the whitelist, the callback is called with an error to indicate that the request is not allowed.
            callback(new Error('not allowed by the CORS'))
        }
    },
    optionsSuccessStatus: 200
}          //CORS is a security feature implemented by web browsers that restricts web pages from making requests to a different domain than the one that served the web page.
app.use(cors(corsOption))    //enables cors request only to the whitelist domains  

//built-in middlerware to handel url encoded data . use() method is used for middleware in express
//Specifically, this middleware is used to parse incoming requests with application/x-www-form-urlencoded data.
app.use(express.urlencoded({ extended: false }))  //For example, with extended: false, a URL-encoded string like 'name=John&age=30' would be parsed as { name: 'John', age: '30' }.

//built-in middleware for json       //note:-built in middleware dont need any next() method as used in the custom middlewares
app.use(express.json()) //The express.json() middleware in Express.js is used to parse incoming JSON payloads in HTTP requests. //check in chhatgpt once or previous project mydiary to know it usecase.

//built-in middleware for serving static files
app.use(express.static(path.join(__dirname, '/public'))) //express.static is a middleware provided by Express to serve static files such as images, CSS, JavaScript, etc.
//app.use(express.static(...)) mounts the static file-serving middleware to handle requests for static files from the 'public' directory.


app.get('^/$|/index(.html)?', (req, res) => {    // '|' => represents logical or (leaving gaps inbetween with not work and may cause errors)
    res.sendFile(path.join(__dirname, 'views', 'index.html'))     // '()?' => anything inside the parantesis will be optional .   so therefore,  (.html)?  => represents .html extension is not complulsory(is optional)
})

app.get('^/$|new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'))
})

///redirecting
app.get('^/$|new-page(.html)?', (req, res) => {
    // res.redirect('/new-page.html')  //302 is by default sent by express (but 301 staus code is correct for redirect)
    res.status(301).redirect('/new-page.html')
})

//route handler (multiple functions can be chained together)
app.get('/hello(.html)?', (req, res, next) => {
    console.log('attempt to load hello.html');
    next()
}, (req, res) => {
    console.log('attempt successfull')
    res.send('hello world!!!')
})

//more of chaining route handlers (other methods for chaining functions together)
const one = (req, res, next) => {  //this route handers are similer to middleware
    console.log('one')
    next()
}
const two = (req, res, next) => {
    console.log('two')
    next()
}
const three = (req, res) => {
    console.log('three')
    res.send('finished')
}
app.get('/chain(.html)?', [one, two, three])

//not proper
// app.get('/:param',(req,res) => {        //app.get('/:param', ...) defines a route with a parameter (:param). The parameter represents the part of the URL path that you want to capture.
//     console.log(req.params.param)      //req.params.param extracts the value of the param parameter from the URL.
//     res.sendFile(path.join(__dirname,`${req.params.param}`))
// })

// default url (it should be kept in last always.if it is kept in first the expres will evaluate this first and hence resolve the get request from this itslef althe time. (as /* means any url))
app.get('/*', (req, res) => {     // '*' => represents all
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))  //custom status(404) is given as express wouldh set it to ststus(200) as it can actually fin the file 404.html in the folders which hence is not an error according to the express.
})
//a better version of the above
app.all('*', (req, res) => {     //  app.all method is a special routing method that is used to specify a callback function that will be called for any HTTP method (GET, POST, PUT, DELETE, etc.) on a specified route. It allows you to define a common handler for a particular route, regardless of the HTTP method used in the request.
    res.status(404)
    if(req.accepted('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))  
    } else if(req.accepted('json')) {
        res.json({error:"404 Not Found"})  
    }else  {
        res.type('txt').send("404 Not Found")  
    }
})

// //custom middleware to handle error
// app.use(function (err,req,res,next) {      //anoynmous function
//     console.log(err.stack)
//     res.status(500).send(err.message)
// })
//another way to do the above is 
app.use(errorhandler)

app.listen(PORT, () => console.log('server is running on port', PORT))