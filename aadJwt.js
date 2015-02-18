var express = require('express');
var router = express.Router();
var path = require('path');
var jwt = require('jwt-simple');
var request = require("request");
var parseString = require('xml2js').parseString;
var config = require('./config');

var aadJwt = {}

aadJwt.convertCertificate = function (cert) {
    //Certificate must be in this specific format or else the function won't accept it
    var beginCert = "-----BEGIN CERTIFICATE-----";
    var endCert = "-----END CERTIFICATE-----";
    
    cert = cert.replace("\n", "");
    cert = cert.replace(beginCert, "");
    cert = cert.replace(endCert, "");
    
    var result = beginCert;
    while (cert.length > 0) {
        
        if (cert.length > 64) {
            result += "\n" + cert.substring(0, 64);
            cert = cert.substring(64, cert.length);
        }
        else {
            result += "\n" + cert;
            cert = "";
        }
    }
    
    if (result[result.length ] != "\n")
        result += "\n";
    result += endCert + "\n";
    return result;
}

aadJwt.validateRequest = function (req, res, callback) {
    
    try {
        var validated = false;
        
        //Collect the bearer token
        var token = req.headers.authorization.substring(7, req.headers.authorization.length);
        
        //Find the metadata for the tenant
        request(config.authority + '/.well-known/openid-configuration', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
                request(result.jwks_uri, function (errorKey, responseKey, bodyKey) {
                    var resultKeys = JSON.parse(bodyKey);
                    resultKeys.keys.forEach(function (key) {
                        key.x5c.forEach(function (keyItem) {
                            var secret = keyItem;
                            try {
                                //Attempt to decode
                                var decoded = jwt.decode(token, aadJwt.convertCertificate(secret));
                                
                                //If we can decode, check the issuer, audience and expiration
                                if (result.issuer == decoded.iss &&
                                    config.audience.indexOf(decoded.aud) >= 0 &&
                                    new Date().getTime() / 1000 < decoded.exp) {
                                    //All valid, we can proceed
                                    validated = true;
                                }
                            }
                            catch (ex) {
                                    
                            }
                        });
                    });
                    
                    
                    callback(validated);
                });

            
            }
        })
    }
    catch (e) {
        callback(false);
    }

}


module.exports = aadJwt;