import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/esm/Dropdown";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Col, Row } from "react-bootstrap";
import Logo from '../assets/logo/vector/default-monochrome.svg'
/**
 * Renders a drop down button with child buttons for logging in with a popup or redirect
 */
export const SignInButton = () => {
    const { instance } = useMsal();

    const handleLogin = (loginType) => {
        if (loginType === "popup") {
            instance.loginPopup(loginRequest).catch(e => {
                console.log(e);
            });
        } else if (loginType === "redirect") {
            instance.loginRedirect(loginRequest).catch(e => {
                console.log(e);
            });
        }
    }
    return (
        // <div class="bsk-container">
        //     <button class="bsk-btn bsk-btn-default">
        //     <object type="image/svg+xml" data="https://s3-eu-west-1.amazonaws.com/cdn-testing.web.bas.ac.uk/scratch/bas-style-kit/ms-pictogram/ms-pictogram.svg" class="x-icon"></object> 
        //     Sign in with Microsoft</button>
        // </div>
        // <DropdownButton variant="secondary" className="ml-auto" drop="left" title="Sign In">
        //     <Dropdown.Item as="button" onClick={() => handleLogin("popup")}>Sign in using Popup</Dropdown.Item>
        //     <Dropdown.Item as="button" onClick={() => handleLogin("redirect")}>Sign in using Redirect</Dropdown.Item>
        // </DropdownButton>
        <Container>
            <Row>
                <Col>
                    <div className="col-container">
                        <div className="right-container">
                            <object type="image/svg+xml" data={Logo}></object>
                            <h3>Recruitment Assistance and Interview Delegation</h3>
                            <Button variant="outline-dark" className="vertical-center" onClick={() => handleLogin("popup")}><object type="image/svg+xml" data="https://s3-eu-west-1.amazonaws.com/cdn-testing.web.bas.ac.uk/scratch/bas-style-kit/ms-pictogram/ms-pictogram.svg" style={{transform: "translateY(3px)", marginRight: "5px"}} ></object> 
                            {/* <span style={{marginLeft: "10px"}}>Sign in with Microsoft</span> */}
                            Sign In With Microsoft
                            </Button>
                        </div>
                    </div>
                    
                </Col>
            </Row>
            {/* <div className="signin-container">
                
            </div> */}
        </Container>
    )
}