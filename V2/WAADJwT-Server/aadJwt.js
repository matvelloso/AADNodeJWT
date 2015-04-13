// based on https://github.com/matvelloso/AADNodeJWT

(
function () {
    
    var jwt = require('jwt-simple');
    var request = require("request");
    
    // GLOBAL CONST 
    const _CACHE_FOR_SEC = 3600; // cache for an hour


    function aadJwt(config) {
        
        if (!(this instanceof aadJwt)) {
            return new aadJwt(config);
        }
        
        // defaults 
        config.cachForSec = config.cachSec | _CACHE_FOR_SEC;
        
        this._cach = null; 
        this.config =  config; 
    }
    
    aadJwt.prototype._convertCertificate = function (cert) {
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
    
    aadJwt.prototype._getSigningKeys = function(forceCacheRefresh)
    {
        var self = this;
        var arCerts = [];
        
        var promise = new Promise(function (resolve, reject) {
            
            
          

            try {
                if (!self.config._cach)
                    self.config._cach = {};
                
                var now = new Date();

                if (forceCacheRefresh|| 
                    !self.config._cach.when ||  
                    Math.abs((now - self.config._cach.when) / 1000) > self.config.cachForSec) {
                    // cache miss or forced to refresh cache
                    request(self.config.authority + '/.well-known/openid-configuration', function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var result = JSON.parse(body);
                            
                            request(result.jwks_uri, function (errorKey, responseKey, bodyKey) {
                                var resultKeys = JSON.parse(bodyKey);
                                resultKeys.keys.forEach(function (key) {
                                    key.x5c.forEach(function (keyItem) {
                                        arCerts.push(self._convertCertificate (keyItem));
                                    });
                                });
                                
                                self.config._cach = {
                                    when : (new Date()),
                                    certs : arCerts,
                                    metadata : result
                                };
                                resolve(self.config._cach);
                            });
                        }
                    });
                }
                else {
                    resolve(self.config._cach);
                }
            
            }            
            catch (err) { 
                reject(err);
            }

        });

        return promise;
    }
    
    aadJwt.prototype.validateRequest = function (req, callback, forceCacheRefresh) { 
        var token = req.headers.authorization.substring(7, req.headers.authorization.length); // strip 'Bearer XXX'
        this.validatetoken(token, callback, forceCacheRefresh);               
    }
    
    


    aadJwt.prototype.validatetoken = function (token, callback, forceCacheRefresh) {
        var self = this;
        var bValid = false;
        forceCacheRefresh = forceCacheRefresh | false;
        try {
            self._getSigningKeys(forceCacheRefresh).then(
                function (cache) {
                    cache.certs.forEach(
                        function (cert) {
                            var decoded = jwt.decode(token, cert, 'RS256');
                            if (cache.metadata.issuer == decoded.iss &&
                            self.config.audience.indexOf(decoded.aud) >= 0 &&
                            new Date().getTime() / 1000 < decoded.exp) {
                                bValid = true;
                            }
                        });
                    callback(bValid);
                }, function (err) {
                    console.log(err); 
                    callback(bValid);
                });
        }
        catch (err) { 
            console.log(err); 
            callback(false);
        }
    }    
    module.exports = aadJwt;
}
)();
