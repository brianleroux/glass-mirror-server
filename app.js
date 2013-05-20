var readline      = require('readline')
var rl            = readline.createInterface({input: process.stdin,output: process.stdout})
var util          = require('util')
var googleapis    = require('googleapis')
var OAuth2Client  = googleapis.OAuth2Client
var credentials   = require('./api-key-and-secret')
var oauth2Client  = new OAuth2Client(credentials.key, credentials.secret, credentials.url)

var scope = ['https://www.googleapis.com/auth/userinfo.profile'                                                                        
            ,'https://www.googleapis.com/auth/userinfo.email'                                                                          
            ,'https://www.googleapis.com/auth/glass.timeline'                                                                          
            ,'https://www.googleapis.com/auth/glass.location'                                                                          
            ].join(' ')  


function getAccessToken(oauth2Client, callback) {
    var url = oauth2Client.generateAuthUrl({access_type:'offline', scope:scope})
    console.log('Visit the url: ', url);
    rl.question('Enter the code here:', function(code) {
        // request access token
        oauth2Client.getToken(code, function(err, tokens) {
            // set tokens to the client
            // console.log(tokens)
            oauth2Client.credentials = tokens;
            callback && callback();
        })
    })
}


/* TODO
    attachments: [Object],
    delete: [Function],
    get: [Function],
    insert: [Function],
    list: [Function],
    patch: [Function],
    update: [Function]
 */
googleapis.discover('mirror', 'v1').execute(function(err, client) {
    getAccessToken(oauth2Client, function() {
        client.mirror.timeline.list().withAuthClient(oauth2Client).execute(function(err, c) {
            console.log(util.inspect(c.items.length))
        })
    })
})
