const express = require('express')
const router = express.Router()      //express.Router() creates an instance of a router, which is a modular, mini-application within an Express application.
const data = {}
data.employee = require('../../data/employee.json')

router.route('/')        //all the requests
    .get((req, res) => {      //getting or fetching all employee
        res.json(data.employee)
    })
    .post((req, res) => {       //adding new employee
        res.json({
            'firstname': req.body.firstname,
            "lasstname": req.body.lastname
        })
    })
    .put((req, res) => {      ///updating
        res.json({
            'firstname': req.body.firstname,
            "lasstname": req.body.lastname
        })
    })
    .delete((req,res) => {
        res.json({"id":req.body.id})
    })

router.route('/:id')   //The colon (:) indicates that id is a route parameter, and it can be accessed as req.params.id in the route handler.
.get((req,res) => {
    res.json({'id':req.params.id}) 
})

module.exports = router


// express.Router() is used to create modular routers within your application, while express() is used to create the main application instance. 
// Routers are often used to organize code, handle routes for specific sections, and promote code modularity in larger applications. 
// The main application instance is responsible for configuring global settings, middleware, and handling routes that apply to the entire application.