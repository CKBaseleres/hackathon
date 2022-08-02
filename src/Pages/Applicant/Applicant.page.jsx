import React, {useState, useEffect, useCallback} from 'react';
import { useMsal } from '@azure/msal-react';
import { useLocation, useResolvedPath } from 'react-router';
import { Container, Row, Col } from 'react-bootstrap'

import { graphConfig, loginRequest } from '../../authConfig'
import { callMsGraph } from '../../graph'

const Applicant = () => {
    const location = useLocation().pathname.split('/')[useLocation().pathname.split('/').length - 1]

    const { instance, accounts } = useMsal()
    const [ userData, setUserData ] = useState(null)
    const [ attachmentData, setAttachmentData ] = useState(null)
    const [ userInstance, setUserInstance ] = useState(null)
    

    // const fetchUser = useCallback(async () => {
    //     const user = await instance.acquireTokenSilent({
    //         ...loginRequest,
    //         account: accounts[0]
    //     })
    //     setUserInstance(user)
    // })

    useEffect(() => {
        const fetchUserData = async() => {
            
            // fetchUser()
            //     .catch(err => console.log('FETCH USER INSTANCE ERROR: ', err))

            const userData = await callMsGraph(user.accessToken, graphConfig.graphMessagesEndpoint + `/${location}`)
            setUserData(userData)
        }

        fetchUserData()
            .catch(error => console.log('FETCH USER DATA ERROR: ', error))
    },[])

    useEffect(() => {
        const fetchAttachmentData = async() => {
            const user = await instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0]
            })
            // fetchUser()
            //     .catch(err => console.log('FETCH USER INSTANCE ERROR: ', err))

            const attachmentData = await callMsGraph(user.accessToken, graphConfig.graphMessagesEndpoint + `/${location}/attachments`)
            setAttachmentData(attachmentData.value[0].contentBytes || "")
        }

        fetchAttachmentData()
            .catch(error => console.log('FETCH ATTACHMENT DATA ERROR: ', error))
    },[userData, fetchUser])
    
    return(
        <Container>
            <Row>
                <Col></Col>
                <Col>World</Col>
            </Row>
            <Row>
                <Col>Email</Col>
                <Col>World</Col>
            </Row>
            <Row>
                <Col>Attachment</Col>
                <Col>World</Col>
            </Row>
            <Row>
                <Col>Set Meeting</Col>
                <Col>World</Col>
            </Row>
        </Container>
    )
}

export default Applicant