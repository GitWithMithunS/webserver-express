const express = require('express')
const router = express.Router()    //it wont be app.get anymore.... it is  router.get
const path = require('path')



router.get('^/$|/index(.html)?', (req, res) => {  
    res.sendFile(path.join(__dirname,'..', 'views', 'index.html'))     
})

router.get('^/$|new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..','views', 'new-page.html'))
})

//redirecting
router.get('^/$|new-page(.html)?', (req, res) => {
    // res.redirect('/new-page.html')  //302 is by default sent by express (but 301 staus code is correct for redirect)
    res.status(301).redirect('/new-page.html')
})

module.exports = router