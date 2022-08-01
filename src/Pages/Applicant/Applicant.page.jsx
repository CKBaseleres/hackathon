import React, {useState, useEffect} from 'react';
import { useMsal } from '@azure/msal-react';
import { useLocation } from 'react-router';
import { Container, Row, Col } from 'react-bootstrap'

import { graphConfig, loginRequest } from '../../authConfig'
import { callMsGraph } from '../../graph'

const Applicant = () => {
    const { instance, accounts } = useMsal()
    const [ userData, setUserData ] = useState(null)
    const [ attachmentData, setAttachmentData ] = useState(null)
    let location = useLocation();
    location = location.pathname.split('/')[location.pathname.split('/').length - 1]

    useEffect(() => {
        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then(response => {
            callMsGraph(response.accessToken, graphConfig.graphMessagesEndpoint)
                .then(data => {
                    setUserData(data)
                })
        })
    },[])
    
    useEffect(() => {
        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then(response => {
            callMsGraph(response.accessToken, graphConfig.graphMessagesEndpoint + `/${location}/attachments`)
                .then(response => {
                    setAttachmentData(response.value[0].contentBytes || "")
                    console.log(response)
                })
        })
    },[userData])
    
    return(
        <Container>
            <Row>
                <Col>Hello</Col>
                <Col>World</Col>
            </Row>
        </Container>
    )
}

export default Applicant