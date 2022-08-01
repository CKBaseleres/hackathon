import React, {useEffect, useState} from "react";
import { useMsal } from "@azure/msal-react";
import { Table, Container, Button, Modal } from "react-bootstrap";
import { Document } from "react-pdf"
import { Navigate, Link } from "react-router-dom";

import { loginRequest, graphConfig } from "../../authConfig";
import { callMsGraph } from "../../graph";

import "./Applications.styles.css"

// import Modal from '../../components/Modal/Modal.component'
import AttachmentModal from "../../components/Attachment/Attachement.component";

const Applications = (props) => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);
    // const [show, setShow] = useState(false);
    // const [showAttachment, setShowAttachment] = useState(false);
    

    
    function RequestProfileData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then((response) => {
            callMsGraph(response.accessToken)
                .then(response => {
                    console.log('RESPONSE: ', response)
                    setGraphData(response)
                });
        });
    }
    
    useEffect(()=> {
        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then((response) => {
            callMsGraph(response.accessToken, graphConfig.graphMessagesEndpoint)
                .then(messageData => {
                    setGraphData(messageData)
                });
        });
    },[])
    
    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);
    // const handleShowAttachment = () => setShowAttachment(true);
    // const handleCloseAttachment = () => setShowAttachment(false);
    return(
        <div className="applications">
            {/* <Button onClick={RequestProfileData}>Request Data</Button> */}
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                    <th>Title</th>
                    <th>Name</th>
                    {/* <th>Attachments</th> */}
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    { graphData && graphData.value.map(data => {
                        return(
                            <tr>
                                <td>{data.subject}</td>
                                <td>{data.sender.emailAddress.name}</td>
                                {/* <td>
                                    <Button variant="primary" onClick={handleShowAttachment}>
                                    Attachment
                                    </Button>
                                    <AttachmentModal show={showAttachment} onHide={handleCloseAttachment} animation="false" id={data.id}/> 
                                </td> */}
                                <td>
                                    <Button variant="light">
                                        <Link to={data.id}>View</Link>
                                    </Button>
                                {/* <Button variant="primary" onClick={handleShow}>
                                    Launch demo modal
                                </Button>
                                <Modal show={show} onHide={handleClose} animation='false'>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Modal title</Modal.Title>
                                    </Modal.Header>

                                    <Modal.Body>
                                        <p>Modal body text goes here.</p>
                                    </Modal.Body>

                                    <Modal.Footer>
                                        <Button variant="secondary">Close</Button>
                                        <Button variant="primary">Save changes</Button>
                                    </Modal.Footer>
                                </Modal> */}
                                </td>
                            </tr>
                        )
                    })}
                    {/* <tr>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    </tr>
                    <tr>
                    <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    </tr>
                    <tr>
                    <td>3</td>
                    <td colSpan={2}>Larry the Bird</td>
                    <td>@twitter</td>
                    </tr> */}
                </tbody>
            </Table>
        </div>
    )
}

export default Applications;