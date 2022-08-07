import React, {useState, useEffect, useCallback} from 'react';
import { useMsal } from '@azure/msal-react';
import { useLocation, useResolvedPath } from 'react-router';
import { Container, Row, Col, Button, Form, FormLabel, FormControl } from 'react-bootstrap'

import { graphConfig, loginRequest } from '../../authConfig'
import { callMsGraph } from '../../graph'

import './Applicant.styles.css'

const Applicant = () => {
    const location = useLocation().pathname.split('/')[useLocation().pathname.split('/').length - 1]

    const { instance, accounts } = useMsal()
    const [ userData, setUserData ] = useState(null)
    const [ attachmentData, setAttachmentData ] = useState(null)
    const [ userInstance, setUserInstance ] = useState(null)
    const serviceLines = [
        'Digital & Innovation',
        'Application Development & Support',
        'Finance Shared Services',
        'Master Data Management'
    ]

    const availablePositions = [
        'Analyst Programmer',
        'Sr. Analyst Programmer'
    ]

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
            const user = await instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0]
            })

            const userData = await callMsGraph(user.accessToken, graphConfig.graphMessagesEndpoint + `/${location}`)
            console.log("🚀 ~ file: Applicant.page.jsx ~ line 33 ~ fetchUserData ~ userData", userData)
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
            console.log("🚀 ~ file: Applicant.page.jsx ~ line 50 ~ fetchAttachmentData ~ attachmentData", attachmentData)
            setAttachmentData(attachmentData.value[0].contentBytes || "")
        }

        fetchAttachmentData()
            .catch(error => console.log('FETCH ATTACHMENT DATA ERROR: ', error))
    },[userData])
    
    return(
        <Container>
            {/* <Row>
                <Col>
                    <h1>{userData && userData.sender.emailAddress.name}</h1> 
                </Col>
                <Col>{userData && userData.sender.emailAddress.name}</Col>
            </Row>
            <Row>
                <Col>{userData && userData.sender.emailAddress.address}</Col>
                <Col>{userData && userData.sender.emailAddress.address}</Col>
            </Row>
            <Row>
                <Col>Attachment</Col>
                <Col>World</Col>
            </Row>
            <Row>
                <Col>Set Meeting</Col>
                <Col>
                    <Button>
                        Set Meeting
                    </Button>
                </Col>
            </Row> */}
            <Form>
                <Form.Group className='mb-3' controlId='formName'>
                    <Form.Label>Applicant Name:</Form.Label>
                    <Form.Control defaultValue={userData && userData.sender.emailAddress.name} disabled></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formEmail'>
                    <Form.Label>Applicant Email Address:</Form.Label>
                    <Form.Control defaultValue={userData && userData.sender.emailAddress.address} type='email' disabled></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='content'>
                    <Form.Label>Application Content Preview</Form.Label>
                    <FormControl as="textarea" rows={3} defaultValue={userData && userData.bodyPreview} disabled></FormControl>
                </Form.Group>
                <Form.Group className='mb-3' controlId='serviceLine'>
                    <Form.Label>Service Line:</Form.Label>
                    <Form.Control as="select" aria-label="Default select example">
                        {serviceLines.map((data,i) => {
                            return(<option key={i} value={data}>{data}</option>) 
                        })}
                        {/* <option>Digital and Innovation</option> */}
                    </Form.Control>
                    {/* <Form.Select>
                        <option>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </Form.Select> */}
                </Form.Group>
                <Form.Group className='mb-3' controlId='position'>
                    <Form.Label>Position: </Form.Label>
                    <Form.Control as="select" aria-label="Default select example">
                        {availablePositions.map((data,i) => {
                            return(<option key={i} value={data}>{data}</option>) 
                        })}
                        {/* <option>Digital and Innovation</option> */}
                    </Form.Control>
                </Form.Group>
            </Form>
        </Container>
    )
}

export default Applicant
