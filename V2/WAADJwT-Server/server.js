var https = require('https');
var fs = require('fs');
var port = process.env.port || 1337;
var aadJwt = require('./aadJwt.js');


// load certificates 
var sslOptions = {
    key: fs.readFileSync('./certs/localhost.key.pem'),
    cert: fs.readFileSync('./certs/localhost.cert.pem')
};

var aadJwtOptions = {
    authority : 'https://login.windows.net/tenannt name or tenant id',
    audience : ['target audience here'] // or multiple
}

// or 
/*
    var aadJwtOptions = {
    authority : 'https://login.windows.net/tenannt name or tenant id',
    audience : ['target audience'],
    cachForSec : 2 * 3600 // cache for 2 hours
} 
*/
// each instance of aadJwt will have its own cache. 
var aadJwt = new aadJwt(aadJwtOptions);


var server = https.createServer(sslOptions , function (request, response) {
    
    var reqData = '';

    request.on('data', function (chunk) {
        
        reqData += chunk.toString();

    });
    
    request.on('end', function () {
        
        //extract token
        var token = request.headers.authorization.substring(7, request.headers.authorization.length);
        /* 
         also you can do
         aadJwt.validateRequest(requestobj, function(bValid) {/magic here/}); 
         or you can force cache refresh (for token and request) 
         aadJwt.validateRequest(requestobj, function(bValid) {/ magic here/}, true);
        
         WAAD rolls the signig keys every 6 weeks or incase of emergency. 
         as long as you are using < 6 weeks cache (assuming that your processes doesn't recycle in 6 weeks)
         then you should be fine.
         
         *** the below will hurt your performance for every unauthorized call a cache refresh will occure
         if you want a fool proof (work even if WAAD rolled the key then you do double call using promises )
         
         new Promise(function (resolve, reject) {
            try
             { 
                    aadJwt.validatetoken(token, function (bValid) {
                    if(!bValid)
                      {
                            aadJwt.validatetoken(token, function (bValid) {
                                resolve(bValid); 
                            }, true);
                      }
                    else{
                        resolve(true); 
                     }        
                 }); 
            }
            catch(err)
           {
                 reject(err); 
           }
          }).then(function(bValid) {
                    if(bValid) {
                        // do magic
                  }
                    else
                    {
                        // doNOT do magic
                  }
                 }), function(err) {/something wrong/});
         */ 
        


        aadJwt.validatetoken(token, function (bValid) {
            if (bValid) {
                response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
                console.log("new request: Authorized");
            } else {

                response.writeHead(401, "Unauthorized", { 'Content-Type': 'application/json' });
                console.log("new request: Unauthorized");
            
            }

            response.end();
        });
        
                
        
    });
}).listen(port);


console.log('Server Listening On: ' + port)