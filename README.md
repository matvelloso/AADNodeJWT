# Azure Active Directory JWT token validation in Node.js


This sample demonstrates how to validate a JWT token issued by Azure Active Directory in Node.js. Using ADAL.js in order to authenticate the user, we make a call to an API in Node JS and then validate the token issuer, audience and expiration. We also show how to use express to selectively inject the authorization code so some APIs can be secure and others not. <br>

How to set this demo:

1-Create a web app in Azure Active Directory. <br>

2-Copy the client ID and the tenant ID information and use it on angularApp.js (the client code using ADAL.js)<br>

4-Use the same tenant ID information in the authority setting in config.js (the server code in Node that validates the token).<br>

5-Set an array of allowed audiences in the config.js. Typically this might be just the client ID of your app (the client ADAL.js being allowed to call the server Node.js) but potentially you could have other apps being allowed to call this service, hence we're using an array<BR>

6-Make sure the reply URI in your AAD application setting matches the URL of this web application

7-Run and log on with a valid user

