import React, {useEffect, useState} from "react";
import { useMsal } from "@azure/msal-react";
import { Table, Container, Button, Modal } from "react-bootstrap";
import { Document } from "react-pdf"
import { Navigate, Link } from "react-router-dom";

import { loginRequest, graphConfig } from "../../authConfig";
import { callMsGraph } from "../../graph";

import "./Applications.styles.css"

const Applications = (props) => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);
    
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

    return(
        <div className="applications">
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                    <th>Title</th>
                    <th>Name</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    { graphData && graphData.value.map((data, i) => {
                        return(
                            <tr key={i}>
                                <td>{data.subject}</td>
                                <td>{data.sender.emailAddress.name}</td>
                                <td>
                                    <Button variant="light">
                                        <Link to={data.id}>View</Link>
                                    </Button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div>
    )
}

export default Applications;