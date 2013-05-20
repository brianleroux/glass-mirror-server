var express     = require('express')
,   passport    = require('passport')
,   util        = require('util')
,   app         = express()
,   strategy    = require('passport-google-oauth').OAuth2Strategy
,   credentials = require('./../api-key-and-secret')


var scopes = ['https://www.googleapis.com/auth/userinfo.profile'
             ,'https://www.googleapis.com/auth/userinfo.email'
             ,'https://www.googleapis.com/auth/glass.timeline'
             ,'https://www.googleapis.com/auth/glass.location'
             ]

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done){done(null, user)})
passport.deserializeUser(function(obj, done){done(null, obj);})


// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new strategy(credentials, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {

        // To keep the example simple, the user's Google profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Google account with a user record in your database,
        // and return that user instead.
        console.log("\n\n\n\n")
        console.log(profile)
        console.log("\n\n\n\n")

        return done(null, profile)
    })
}))

// Configure the app and sets up default auth route
//   Start out with basic passport and express defaults and then
//   add the minimum routes to get going.
app.configure(function() {
    app.set('views', __dirname + '/../views')
    app.set('view engine', 'ejs')
    app.use(express.logger())
    app.use(express.cookieParser())
    app.use(express.bodyParser())
    app.use(express.methodOverride())
    app.use(express.session({ secret: 'keyboard cat' }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(app.router)
    app.use(express.static(__dirname + '/public'))
})

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /oauth2callback
app.get('/auth/google', passport.authenticate('google', {scope:scopes}), function(req, res) {
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
})

// Use passport.authenticate() as route middleware to authenticate the
// request.  If authentication fails, the user will be redirected back to the
// login page.  Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
app.get('/oauth2callback', passport.authenticate('google',{failureRedirect:'/'}), function(req, res) {

    var request = require('request')
    ,   credentials = require('./../api-key-and-secret')
   
    var params = {
        code:req.param('code'),
        client_id:credentials.clientID,
        client_secret:credentials.clientSecret,
        redirect_uri:credentials.callbackURL,
        scope:'',
        grant_type:'authorization_code'
    }

   
    console.log("\n\nHGEY YO GUYS\n\n") 
    console.log(params)
    
    request.post('https://accounts.google.com/o/oauth2/token', {form:params}, function(err, data, str) {
        // console.log(err) 
        console.log(data) 
        console.log(str) 
        console.log("\n\n\n\n") 

        req.session.token = req.param('code')
        res.redirect('/account')
    })

})

app.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/')
})

module.exports = app
