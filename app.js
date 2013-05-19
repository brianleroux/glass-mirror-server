var app = require('./lib/configuration')
,   auth = require('./lib/authenticated')

app.get('/', function(req, res){
    res.render('index', { user: req.user })
})

app.get('/account', auth, function(req, res){
    res.render('account', { user: req.user })
})

app.post('/message', auth, function(req, res) {
    glass.timeline(req.params.message, function(err, data) {
        res.redirect('/')
    })
})

app.get('/login', function(req, res){
    res.render('login', { user: req.user })
})

app.listen(3000)
