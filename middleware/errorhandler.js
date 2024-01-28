const {logevents} = require('./logevent')

const errorhandler = (err,req,res,next) => {
    logevents(`${err.name}:${err.message}` , 'errlog.txt')
        console.log(err.stack)
        res.status(500).send(err.message)
}

module.exports = errorhandler