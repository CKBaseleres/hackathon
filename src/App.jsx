import React, { useState } from "react";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import {Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MicrosoftLogin from "react-microsoft-login";

import { PageLayout } from "./components/PageLayout";
import { ProfileData } from "./components/ProfileData";
import { MicrosoftSignInButton } from "./components/MicrosoftSignInButton";
import Sidebar from "./components/Sidebar/Sidebar.component"
import { SignInButton } from "./components/SignInButton";

import Inbox from "./Pages/Inbox/Inbox";
import Application from "./Pages/Application/Application.page";
import Applicants from "./Pages/Applicants/Applicants.page";
import Applicant from "./Pages/Applicant/Applicant.page";
import Home from "./Pages/Home/Home.page"

import { loginRequest } from "./authConfig";
import { callMsGraph } from "./graph";

import "./styles/App.css";
import Archive from "./Pages/Archive/Archive.page";
import RequestForRecruitement from "./Pages/RequestForRecruitement/RequestForRecruitement";

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */
const ProfileContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestProfileData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then((response) => {
            callMsGraph(response.accessToken).then(response => setGraphData(response));
        });
    }

    return (
        <>
            <h5 className="card-title">Welcome {accounts[0].name}</h5>
            {graphData ? 
                <ProfileData graphData={graphData} />
                :
                <Button variant="secondary" onClick={RequestProfileData}>Request Profile Information</Button>
            }
        </>
    );
};


/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
const MainContent = (props) => {   
    return (
        <div className="App">
            <AuthenticatedTemplate>
                {/* <ProfileContent /> */}
                <Container fluid>
                    <Router>
                    <Row className="flex-xl-nowrap">
                        <Col as={ Sidebar } xs={ 12 } md={ 3 } lg={ 2 } />
                        <Col xs={ 12 } md={ 9 } lg={ 10 }>
                                <Routes>
                                    <Route path="/" element={<Home/>}/>
                                    <Route path="/inbox" element={<Inbox/>}/>
                                    <Route path="/inbox/:id" element={<Application />}/>
                                    <Route path="/applicants" element={<Applicants />}/>
                                    <Route path="/applicants/:id" element={<Applicant />}/>
                                    <Route path="/archive" element={<Archive />}/>
                                    <Route path="/archive/:id" element={<Applicant />}/>
                                    <Route path="/archive/:id" element={<Applicant />}/>
                                    <Route path="/request-recruitement" element={<RequestForRecruitement />}/>
                                </Routes>    
                        </Col>
                    </Row>
                    </Router>
                </Container>
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                {/* <h5 className="card-title">Please sign-in to see your profile information.</h5> */}
                <SignInButton />
            </UnauthenticatedTemplate>
        </div>
    );
};

export default function App() {
    return (
        <PageLayout>
            <MainContent />
        </PageLayout>
        // <MainContent />
        
    );
}
