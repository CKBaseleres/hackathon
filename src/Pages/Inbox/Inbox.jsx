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

        const graphData = await callMsGraph(token.accessToken, graphConfig.graphMessagesEndpoint + '?$filter=from/emailAddress/address ne ' + `'${accounts[0].username}'`)
        // setGraphData(graphData)
        const { value: graphItems } = graphData;
        console.log("🚀 ~ file: Inbox.jsx ~ line 26 ~ useEffect ~ graphItems", graphItems)
        
        let savedApplicants = await fetch(apiEndpoints.getApplicants, {
            method: "GET",
        })
        savedApplicants = await savedApplicants.json();
        const { data } = savedApplicants;
        console.log("🚀 ~ file: Inbox.jsx ~ line 33 ~ useEffect ~ data", data)
        
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
        <div className="applications px-5">
            <Header title="Inbox" />
            <Table size="md">
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Subject</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    { graphData && graphData.map((data, i) => {
                        return(
                            <tr key={i} className="align-middle">
                                <td> 
                                    <div className="d-flex align-items-center">
                                        <div style={{height: '50px', width:'50px', border:"1px solid black", textAlign:"center"}} className="rounded-circle">
                                            <p className="mt-2 font-weight-bold" style={{fontSize: "1.25em"}}>{data.sender.emailAddress.name.split(' ')[0].split('')[0] + data.sender.emailAddress.name.split(' ')[data.sender.emailAddress.name.split(' ').length - 1].split('')[0]}</p>
                                        </div>
                                        <div className="ms-3 ml-2">
                                            <p className="font-weight-bold mb-1">{data.sender.emailAddress.name}</p>
                                            <p className="text-muted mb-0">{data.sender.emailAddress.address}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>{data.subject}</td>
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