import React, {useEffect, useState} from "react";
import { useMsal } from "@azure/msal-react";
import { Table, Container, Button, Modal } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";

import { loginRequest, graphConfig } from "../../authConfig";
import { callMsGraph } from "../../graph";

import "./Inbox.styles.css"
import Header from "../../components/Header/Header.component";
import { apiEndpoints } from "../../apiConfig";

const Inbox = (props) => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);
    
    useEffect(async ()=> {
        const token = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        })

        const graphData = await callMsGraph(token.accessToken, graphConfig.graphMessagesEndpoint)
        // setGraphData(graphData)
        const { value: graphItems } = graphData;

        let savedApplicants = await fetch(apiEndpoints.getApplicants, {
            method: "GET",
        })
        savedApplicants = await savedApplicants.json();
        const { data } = savedApplicants;

        if (data) {
            // Remove Already Saved Emails
            data.forEach((item, index, array) => {
                const sameItem = graphItems.findIndex(graphItem => graphItem.conversationId === item.emailId)
                graphItems.splice(sameItem, 1)
            })
            console.log("🚀 ~ file: Inbox.jsx ~ line 37 ~ graphItems.forEach ~ graphItems", graphItems)
        }
        setGraphData(graphItems)
        
        // console.log("🚀 ~ file: Applicant.page.jsx ~ line 65 ~ fetchUserData ~ savedApplicants", savedApplicants)
    },[])

    return(
        <div className="applications">
            <Header title="Inbox" />
            <Table striped bordered hover size="md">
                <thead>
                    <tr>
                    <th>Subject</th>
                    <th>Name</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    { graphData && graphData.map((data, i) => {
                        return(
                            <tr key={i}>
                                <td>{data.subject}</td>
                                <td>{data.sender.emailAddress.name}</td>
                                <td>
                                    {/* <Button variant="light">
                                        <Link to={data.id}>View</Link>
                                    </Button> */}
                                    <Link to={data.id}><Button variant="light">
                                        View
                                    </Button></Link>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div>
    )
}

export default Inbox;