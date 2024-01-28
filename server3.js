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

//3rd-party middleware     
const whitelist = ['https://www.yoursite.com', 'https://www.google.com', 'http://127.0.0.1:5500', 'http://localhost:3500'] //the site were u may run the code. (however u would want to remove 'http://127.0.0.1:5500','http://localhost:3500' after the development is completed.)
const corsOption = {    
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin ) {   //if the domain is in the whitelist(evaluate if The origin is found in the whitelist or The origin is falsy)
            callback(null, true)           
        } else {                           
            callback(new Error('not allowed by the CORS'))
        }
    },
    optionsSuccessStatus: 200
}         
app.use(cors(corsOption))    



app.use(express.urlencoded({ extended: false }))  

//built-in middleware for json       //note:-built in middleware dont need any next() method as used in the custom middlewares
app.use(express.json()) 

//built-in middleware for serving static files
app.use('/',express.static(path.join(__dirname, '/public'))) //express.static is a middleware provided by Express to serve static files such as images, CSS, JavaScript, etc.
app.use('/subdir',express.static(path.join(__dirname, '/public')))  //static file for subdir also
//app.use(express.static(...)) mounts the static file-serving middleware to handle requests for static files from the 'public' directory.

app.use('^/$',require('./routes/root'))
app.use('/subdir', require('./routes/subdir'))
app.use('/employee', require('./routes/api/employee'))




app.all('*', (req, res) => {     //  app.all method is a special routing method that is used to specify a callback function that will be called for any HTTP method (GET, POST, PUT, DELETE, etc.) on a specified route. It allows you to define a common handler for a particular route, regardless of the HTTP method used in the request.
    res.status(404)
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))  
    } else if(req.accepts('json')) {
        res.json({error:"404 Not Found"})  
    }else  {
        res.type('txt').send("404 Not Found")  
    }
})

//custom middleware for error handling
app.use(errorhandler)

app.listen(PORT, () => console.log('server is running on port', PORT)) 