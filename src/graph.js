import { graphConfig } from "./authConfig";

/**
 * Attaches a given access token to a MS Graph API call. Returns information about the user
 * @param accessToken 
 */
export async function callMsGraph(accessToken, endpoint, body=null, method="GET") {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);
    if (method=="POST") headers.append("Content-Type","application/json")
    
    const options = {
        method: method,
        headers: headers,
        body
    };

    return fetch(endpoint, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}
