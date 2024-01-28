const {format} = require('date-fns')     
const {v4:uuid} = require('uuid')      
const fs = require('fs');             
const fspromises = require('fs').promises;
const path= require('path')

console.log('hi event emitter')      
const logevents = async (message ,logname) => {       
    const datetime  = `${format(new Date() , 'yyyyMMdd /t HH:mm:ss')}` 
    const logitem = `${datetime} \t ${uuid()} \t ${message} \n`         
    console.log(logitem)
    try {
        if(!fs.existsSync(__dirname,'logs')){       
            await fspromises.mkdir(path.join(__dirname,'..','logs'))
        }
        await fspromises.appendFile(path.join(__dirname,'..','logs',logname),logitem); 
    } catch (error) {
        console.log(error)
    }
}

const logger = async(req,res,next) => {
    logevents(`${req.method} \t${req.header.origin}\t ${req.url}` , 'reqlog.txt')    //req.method -> type of request(get,put,post,delete,etc)   req.header.origin -> were the request is being made(ex- www.google.com,if it is on localhost it comes as undfined)
    console.log(`${req.method} \t ${req.path}`)
    next()
}

module.exports = {logger , logevents }