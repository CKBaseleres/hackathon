/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import Navbar from "react-bootstrap/Navbar";

import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";

/**
 * Renders the navbar component with a sign-in or sign-out button depending on whether or not a user is authenticated
 * @param props 
 */
export const PageLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();

    return (
        <>
            <Navbar bg="primary" variant="dark" style={{justifyContent:"space-between", padding: "0.5rem 1.5rem", position:"sticky", top:"0", zIndex:"1"}}>
                <a className="navbar-brand" href="/">R.A.I.D.</a>
                { isAuthenticated ? <SignOutButton /> : "" }
            </Navbar>
            {props.children}
        </>
    );
};
