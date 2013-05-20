var app = require('./lib/configuration')
,   auth = require('./lib/authenticated')
,   request = require('request')
,   https = require('https')
,   fs = require('fs')

app.get('/', function(req, res){
    res.render('index', { user: req.user })
})

app.get('/account', auth, function(req, res){
    var token = req.session.token
/*
GET /mirror/v1/timeline HTTP/1.1
    Host: www.googleapis.com
    Authorization: Bearer {auth token}
    var options = {
        uri:"https://www.googleapis.com/mirror/v1/timeline",
        headers:{"Authorization": "Bearer " + token}
    }
    
    request(options, function(err, data, str) {
        console.log("\n\n\n\n\n")
        console.log(data)
        console.log("\n\n\n\n\n")
        res.render('account', { user: req.user, data:str  })
    })
*/
        res.render('account', { user:req.user, data:req.session.token })
})

app.post('/message', auth, function(req, res) {
    glass.timeline(req.params.message, function(err, data) {
        res.redirect('/')
    })
})

app.get('/login', function(req, res){
    res.render('login', { user: req.user })
})



var privateKey = fs.readFileSync(__dirname + '/key.pem').toString();
var certificate = fs.readFileSync(__dirname + '/cert.pem').toString();
var options = { key:privateKey, cert:certificate }
// app.get('port')
https.createServer(options,app).listen(3000, function(){
      console.log("Express server listening on port " + app.get('port'));
})
