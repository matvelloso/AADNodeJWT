# Azure Active Directory JWT token validation in Node.js


This sample demonstrates how to validate a JWT token issued by Azure Active Directory in Node.js. Using ADAL.js in order to authenticate the user, we make a call to an API in Node JS and then validate the token issuer, audience and expiration. We also show how to use express to selectively inject the authorization code so some APIs can be secure and others not. <br>

How to set this demo:

1-Create a web app in Azure Active Directory. <br>

2-Copy the client ID and use it both on angularApp.js (the client code using ADAL.js) as well as the config.js (the server code in Node that validates the token).<br>

3-Set the tenant ID on both files (usually it is in the format of "yourcompanyname.onmicrosoft.com". This information also comes from the tenant you created in Azure Active Directory)

4-Run and log on with a valid user

