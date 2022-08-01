import React, { useState } from "react";
import MicrosoftLogin from "react-microsoft-login";

const CLIENT_ID = "481e3f84-c2db-4bcb-b38b-3459276cdcb8";

    export const MicrosoftSignInButton = (props) => {
    const { msalInstance, onMsalInstanceChange } = useState();
        
    const authHandler = (err, data, msal) => {
        console.log(err, data, msal);
        onMsalInstanceChange(msal)
    };
    
    return (
        <MicrosoftLogin clientId={CLIENT_ID} authCallback={authHandler} redirectUri="http://localhost:3000/callback"/>
    );
};