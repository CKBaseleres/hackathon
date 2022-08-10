import React, {useState, useEffect, useCallback} from 'react';
import { useMsal } from '@azure/msal-react';
import { useLocation, useResolvedPath } from 'react-router';
import { Container, Row, Col, Button, Form, FormLabel, FormControl } from 'react-bootstrap'
import DatePicker from 'react-date-picker'

import { graphConfig, loginRequest } from '../../authConfig'
import { callMsGraph } from '../../graph'

import './Applicant.styles.css'

const Applicant = () => {
    const location = useLocation().pathname.split('/')[useLocation().pathname.split('/').length - 1]

    const { instance, accounts } = useMsal()
    const [ userData, setUserData ] = useState(null)
    const [ attachmentData, setAttachmentData ] = useState(null)
    const [ userInstance, setUserInstance ] = useState(null)
    const [ availableMeetingTime, setAvailableMeetingTime] = useState(null)
    const [ value, onChange ] = useState(new Date())
    const [ availableTimes, setAvailableTimes ] = useState(null)
    const [ availableEndTimes, setAvailableEndTimes ] = useState(null)
    const [ formValue, setFormValue ] = useState(null)

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
    // let availableTimes = []
    // const availableTimes = () => {
    //     const times = [];
    //     for (i=8;i=17;i++) {
    //         times.push(`i:00:00`)
    //     }
    //     return times;
    // }

    


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
        let times = []
        let endTimes = []
        for (let i=8;i<17;i++) {
            times.push(new Date(new Date(new Date(new Date().setHours(i)).setMinutes(0)).setSeconds(0)).toLocaleTimeString())
        }
        for (let i=9;i<18;i++) {
            endTimes.push(new Date(new Date(new Date(new Date().setHours(i)).setMinutes(0)).setSeconds(0)).toLocaleTimeString())
        }
        
        setAvailableTimes(times)
        setAvailableEndTimes(endTimes)

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

    useEffect(() => {
        setFormValue({
            name: userData && userData.sender.emailAddress.name,
            email: userData && userData.sender.emailAddress.address,
            bodyPreview: userData && userData.bodyPreview
        })
    },[attachmentData])
    
    const handleChange = (e) => {
        setFormValue(prev => ({...prev, [e.target.name]: e.target.value }))
    }

    return(
        <Container>
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
                    <Form.Control as="select" aria-label="Default select example" name='serviceLine' onChange={handleChange}>
                        {serviceLines.map((data,i) => {
                            return(<option key={i} value={data}>{data}</option>) 
                        })}
                    </Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='position'>
                    <Form.Label>Position: </Form.Label>
                    <Form.Control as="select" aria-label="Default select example" name='position' onChange={handleChange}>
                        {availablePositions.map((data,i) => {
                            return(<option key={i} value={data}>{data}</option>) 
                        })}
                    </Form.Control>
                </Form.Group>
                <Button>
                    <a href={`data:application/pdf;base64,${attachmentData}`} target='_blank' >See Attachment</a>
                </Button>
                <h3>Set Meeting</h3>
                <Form.Group className='mb-3' controlId='setTime'>
                    <Form.Label>Date: </Form.Label>
                    <DatePicker onChange={handleChange} name='meetingDate' value={value} />
                    <Form.Control as="select" name='meetingStartTime' onChange={handleChange}>
                        <option value={null}>Set Start Time:</option>
                        {availableTimes && availableTimes.map((data,i) => {
                            return(<option key={i} value={data}>{data}</option>)
                        })}
                    </Form.Control>
                    <Form.Control as="select" name='meetingEndTime' onChange={handleChange}>
                        <option values={null}>Set End Time:</option>
                        {availableEndTimes && availableTimes.map((data,i) => {
                            return(<option key={i} value={data}>{data}</option>)
                        })}
                    </Form.Control>
                </Form.Group>
                <Button type="submit">Save</Button>
            </Form>
        </Container>
    )
}

export default Applicant
