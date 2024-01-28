//start from here (basics of express.js)
const express = require('express')
const app = express()    // instance of express
const path = require('path')
const PORT = process.env.port || 3300       //process.env.port this if the port is saved in a environment variable


// app.get('/', (req,res) => {
//     res.send('hello world!')
//     console.log('hello world')
// })
// app.get('^/$', (req,res) => {     // '^'=> begin with '$'=>end with so ^/$ => represents begin wiht a slash and end with a slash
//     res.send('hello world!')      //Regex" stands for "Regular Expression. It is a powerful tool used for pattern matching and searching within strings. Regular expressions provide a concise and flexible way to describe, identify, and manipulate text based on patterns.
//     console.log('hello world')
// })

// app.get('/',(req,res) => {
//     res.sendFile('./views/index.html',{root:__dirname}) 
// })
//another way to do the same is 
app.get('^/$|/index(.html)?',(req,res) => {    // '|' => represents logical or (leaving gaps inbetween with not work and may cause errors)
    res.sendFile(path.join(__dirname,'views','index.html'))     // '()?' => anything inside the parantesis will be optional .   so therefore,  (.html)?  => represents .html extension is not complulsory(is optional)
})

app.get('^/$|new-page(.html)?', (req,res) => {
    res.sendFile(path.join(__dirname,'views','new-page.html'))
})

///redirecting
app.get('^/$|new-page(.html)?', (req,res) => {
    // res.redirect('/new-page.html')  //302 is by default sent by express (but 301 staus code is correct for redirect)
    res.status(301).redirect('/new-page.html')
})
 
//route handler (multiple functions can be chained together)
app.get('/hello(.html)?' , (req,res,next) => {
    console.log('attempt to load hello.html');
    next()
},(req,res) => {
    console.log('attempt successfull')
    res.send('hello world!!!')
})
 
//more of chaining route handlers (other methods for chaining functions together)
const one = (req,res,next) => {  //this route handers are similer to middleware
    console.log('one')
    next()
}
const two = (req,res,next) => {
    console.log('two')
    next()
}
const three = (req,res) => {
    console.log('three')
    res.send('finished')
}
app.get('/chain(.html)?' ,[one,two,three])   


//default url (it should be kept in last always.if it is kept in first the expres will evaluate this first and hence resolve the get request from this itslef althe time. (as /* means any url))
app.get('/*', (req,res) => {     // '*' => represents all
    res.status(404).sendFile(path.join(__dirname,'views','404.html'))  //custom status(404) is given as express wouldh set it to ststus(200) as it can actually fin the file 404.html in the folders which hence is not an error according to the express.
})



app.listen(PORT, () => console.log('server is running on port', PORT)) // if ur are using only node the statement would have been(if the name of createdserver is server by http method) server.listen(PORT, () => console.log('server is running on port', PORT)










//regex  (Regular expressions can include ordinary characters (e.g., letters, numbers) that match themselves)
//   . (dot) matches any single character except a newline.
//   * (asterisk) matches zero or more occurrences of the preceding character or group.
//   + (plus) matches one or more occurrences of the preceding character or group.
//   ? (question mark) matches zero or one occurrence of the preceding character or group.
//   ^ (caret) asserts the start of a line.
//   $ (dollar sign) asserts the end of a line.
//   Character Classes: A set of characters enclosed in square brackets [ ] represents a character class. For example, [aeiou] matches any vowel.
//   Quantifiers: Indicate the number of occurrences. For example:
//   {n} matches exactly n occurrences.
//   {n,} matches n or more occurrences.
//   {n,m} matches between n and m occurrences.
//   Groups and Capturing: Parentheses () are used to group expressions, and they also capture the matched text for later use.