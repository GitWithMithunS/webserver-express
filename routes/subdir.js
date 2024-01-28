//routes  (its connected with server2.js)
const express = require('express')
const router = express.Router()    //it wont be app.get anymore.... it is  router.get
const path = require('path')


router.get('^/$|/index(.html)?', (req, res) => {   
    res.sendFile(path.join(__dirname,'..', 'views','subdir' ,'index.html'))     
})

router.get('/test(.html)?', (req, res) => {    
    res.sendFile(path.join(__dirname,'..', 'views','subdir' ,'test.html'))     
})

module.exports = router ;