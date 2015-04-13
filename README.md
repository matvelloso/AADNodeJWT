# Azure Active Directory JWT token validation in Node.js

## V2 ##

the new version is now enabled on the JWT Token Validation component. 

each instance of aadJwt will have it is own cache bound to a single AAD authority.

you can extract token as 

     var token = request.headers.authorization.substring(7, request.headers.authorization.length);

then call token validate token 

      aadJwt.validatetoken(token, function (bValid) {/* magic here*/});
    
or you can pass the entire request object 

      aadJwt.validateRequest(reqObject, function (bValid) {/* magic here*/});

in both cases you can force a cache refresh 

	  var bCacheRefresh = true;
      aadJwt.validateRequest(reqObject, function (bValid) {/* magic here*/}, bCacheRefresh);



## V1 ##


This sample demonstrates how to validate a JWT token issued by Azure Active Directory in Node.js. Using ADAL.js in order to authenticate the user, we make a call to an API in Node JS and then validate the token issuer, audience and expiration. We also show how to use express to selectively inject the authorization code so some APIs can be secure and others not. <br>

How to set this demo:

1-Create a web app in Azure Active Directory. <br>

2-Copy the client ID and the tenant ID information and use it on angularApp.js (the client code using ADAL.js)<br>

4-Use the same tenant ID information in the authority setting in config.js (the server code in Node that validates the token).<br>

5-Set an array of allowed audiences in the config.js. Typically this might be just the client ID of your app (the client ADAL.js being allowed to call the server Node.js) but potentially you could have other apps being allowed to call this service, hence we're using an array<BR>

6-Make sure the reply URI in your AAD application setting matches the URL of this web application

7-Run and log on with a valid user


Some notes:

-There is no caching of any kind implemented yet. Ideally we should be able to cache some of the calls to the metadata endpoints so we don't have to call the authority endpoint for every single request. This is something you definitely want to do in production<br>
-All error handling falls into a 401 unauthorized response. We are not doing anything fancy in terms of dealing with particular scenarios where endpoints are down or the payload isn't what we expect<br>
-api.js demonstrates the use of two different routers, one that injects the authorization checks and other that doesn't. That way you can have apis that are security enforced and others that don't do any security checks<br>
-convertCertificate function makes sure the cert has the right format (/n every 64 chars and the begin and end cert marks). Without this the certificate functions will fail reading the cert.