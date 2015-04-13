using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace WAADJwT_Client
{
    class Program
    {
        static void Main(string[] args)
        {

            string authority = "https://login.windows.net/tenant name or tenant id";
            string resourceUri = "/* WAAd Resource id you are authenticating to*/"; 
            string thisAppClientID = "/* WAAD client ID*/";
            string thisAppKey = "/* WAAD APPLICATION KEY */";
         
            string epAddress = "https://localhost:1337";


            for (var i = 1; i <= 1000; i++)
            {
                
                execute(authority,
                            resourceUri,
                            thisAppClientID,
                            thisAppKey,
                            epAddress).Wait();
                Task.Delay(2000).Wait();
            }



                Console.Read();

        }

        static async Task execute(
                                    string authority,
                                    string resourceUri,
                                    string thisAppClientID,
                                    string thisAppKey,
                                    string epAddress
                                )
        {
            using (var handler = new WebRequestHandler())
            {
                handler.ServerCertificateValidationCallback += (sender, x509cert, chain, policyerrs) => { return true; };


                using (var client = new HttpClient(handler))
                {

                    var authToken = await getAuthToken(authority, 
                                                       resourceUri, 
                                                       thisAppClientID, 
                                                       thisAppKey);


                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Add("Authorization", "Bearer " + authToken);
               //     client.DefaultRequestHeaders.Add("Authorization", "Bearer " + "BS HERE");
                    
                    var response = await client.GetAsync(new Uri(epAddress));

                    Console.WriteLine("ep: {0} - Response: {1}", epAddress, response.StatusCode);
                }

            }
        }

        static async Task<string> getAuthToken(string authority, 
                                               string resourceUri,
                                               string thisAppClientID,
                                               string thisAppKey)
        { 
            var authenticationContext = new AuthenticationContext(authority);
            var creds = new ClientCredential(thisAppClientID, thisAppKey);
            var result = await authenticationContext.AcquireTokenAsync(resourceUri,
                                           creds);

            if (result == null)
                throw new InvalidOperationException("Failed to obtain the JWT token");
            
            return result.AccessToken;

            
        }
    }
}
