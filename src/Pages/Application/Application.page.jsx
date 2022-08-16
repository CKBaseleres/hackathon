import React, {useState, useEffect, useCallback} from 'react';
import { useMsal } from '@azure/msal-react';
import { useLocation, useResolvedPath } from 'react-router';
import { Container, Row, Col, Button, Form, FormControl } from 'react-bootstrap'
import DatePicker from 'react-date-picker'
import HeaderComponent from '../../components/Header/Header.component';

import { graphConfig, loginRequest } from '../../authConfig'
import { callMsGraph } from '../../graph'

import service_positions_json from '../../application_positions.json';
console.log("🚀 ~ file: Applicant.page.jsx ~ line 11 ~ service_positions_json", service_positions_json)

import './Application.styles.css'
import { apiEndpoints } from '../../apiConfig';
import { DateRangeOutlined } from '@mui/icons-material';

// const service_positions = JSON.parse(service_positions_json);
// console.log("🚀 ~ file: Applicant.page.jsx ~ line 15 ~ service_positions", service_positions)

const Application = () => {
    const location = useLocation().pathname.split('/')[useLocation().pathname.split('/').length - 1]

    const { instance, accounts } = useMsal()
    const [ userData, setUserData ] = useState(null)
    const [ attachmentData, setAttachmentData ] = useState(null)
    const [ userInstance, setUserInstance ] = useState(null)
    const [ availableMeetingTime, setAvailableMeetingTime] = useState(null)
    const [ value, setValue ] = useState(new Date())
    const [ availableTimes, setAvailableTimes ] = useState(null)
    const [ availableEndTimes, setAvailableEndTimes ] = useState(null)
    const [ formValue, setFormValue ] = useState(null)
    const [ disabledMeetingButton, setDisabledMeetingButton ] = useState(true);
    const [ disabledSaveButton, setDisabledSaveButton ] = useState(false)
    const [ isInitialMeetingSet, setIsInitialMeetingSet ] = useState(false)
    const [ meetingTime, setMeetingTime ] = useState(null)

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

    // console.log(service_positions_json.)

    useEffect(() => {
        const fetchUserData = async() => {
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
            times.push({ 
                value: i,
                display: new Date(new Date(new Date(new Date().setHours(i)).setMinutes(0)).setSeconds(0)).toLocaleTimeString()
            })
        }
        // for (let i=9;i<18;i++) {
        //     endTimes.push(new Date(new Date(new Date(new Date().setHours(i)).setMinutes(0)).setSeconds(0)).toLocaleTimeString())
        // }
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
            bodyPreview: userData && userData.bodyPreview,
            emailId: userData && userData.conversationId,
            isInitialMeetingSet,
            // meetingDate: value,
            attachmentData
        })
    },[userData, attachmentData])

    const handleChange = (e) => {
        setFormValue(prev => ({...prev, [e.target.name]: e.target.value }))
        console.log("🚀 ~ file: Applicant.page.jsx ~ line 114 ~ handleChange ~ setFormValue", formValue)
    }

    // TODO: IF has date and time call graph api to set meeting.
    const handleSave = () => {
        setFormValue(prev => ({...prev, status: 'Saved'}))
        fetch('https://hackathon-fnc.azurewebsites.net/api/save-applicant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(formValue),
        })
            .then(res => res.json())
            .then(data => {
                setDisabledSaveButton(true)
            })
            .catch(err => {
                console.log("🚀 ~ file: Applicant.page.jsx ~ line 125 ~ handleSave ~ err", err)
            })
    }

    useEffect(() => {
        console.log('FORMVALUE: ', formValue);
        if (formValue && formValue.meetingStartTime) {
            const { meetingDate, meetingStartTime } = formValue;
            console.log(new Date(new Date(meetingDate).setHours(meetingStartTime,0,0)).toISOString())
        }
    })

    const buildEvent = async () => {
        const SUBJECT = `INITIAL INTERVIEW: ${userData && userData.sender.emailAddress.name}`

        // TODO: BODY TO BE BUILD FOR CREATING EVENT
        const meetingBody = {
            subject: SUBJECT,
            start: {
                dateTime: new Date(new Date(value).setHours(parseInt(meetingTime),0,0)).toISOString().split('.')[0],
                timeZone: 'UTC'
            },
            end: {
                dateTime: new Date(new Date(value).setHours(parseInt(meetingTime) + 1,0,0)).toISOString().split('.')[0],
                timeZone: 'UTC'
            },
            attendees: [
                {
                    emailAddress: {
                        address: userData && userData.sender.emailAddress.address,
                        name: userData && userData.sender.emailAddress.name
                    },
                    type: 'required'
                }  
            ]
        }
        console.log("🚀 ~ file: Applicant.page.jsx ~ line 169 ~ buildEvent ~ meetingBody", meetingBody)

        const user = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        })
        
        const eventData = await callMsGraph(user.accessToken, graphConfig.graphEventEndpoint, JSON.stringify(meetingBody), "POST")
        console.log("🚀 ~ file: Applicant.page.jsx ~ line 176 ~ buildEvent ~ eventData", eventData)
        setDisabledMeetingButton(true)
        setIsInitialMeetingSet(true)
        setFormValue(prev => ({...prev, isInitialMeetingSet}))
    }

    const handleMeetingTimeChange = (e) => {
        setDisabledMeetingButton(false)
        setMeetingTime(e.target.value)
    }

    return(
        <Container>
            <Form className="form">
                <Form.Group className='mb-3 form-group' sm controlId='formName'>
                    <Form.Label>Applicant Name:</Form.Label>
                    <Form.Control defaultValue={userData && userData.sender.emailAddress.name} disabled></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3 form-group' controlId='formEmail'>
                    <Form.Label>Applicant Email Address:</Form.Label>
                    <Form.Control defaultValue={userData && userData.sender.emailAddress.address} type='email' disabled></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3 form-group' controlId='content' style={{flexBasis: "100%"}}>
                    <Form.Label>Application Content Preview</Form.Label>
                    <FormControl as="textarea" rows={10} defaultValue={userData && userData.bodyPreview} disabled></FormControl>
                </Form.Group>
                <Button style={{flexBasis: "100%"}} disabled={!attachmentData}>
                    <a href={`data:application/pdf;base64,${attachmentData}`} target='_blank' title={`${userData && userData.sender.emailAddress.name} Attachment`} style={{color: "white"}}>See Attachment</a>
                </Button>
                <Form.Group className='mb-3 form-group' controlId='serviceLine'>
                    <Form.Label>Service Line:</Form.Label>
                    <Form.Control as="select" aria-label="Default select example" name='serviceLine' onChange={handleChange}>
                        {serviceLines.map((data,i) => {
                            return(<option key={i} value={data}>{data}</option>) 
                        })}
                    </Form.Control>
                </Form.Group>
                <Form.Group className='mb-3 form-group' controlId='position'>
                    <Form.Label>Position: </Form.Label>
                    <Form.Control as="select" aria-label="Default select example" name='position' onChange={handleChange}>
                        {availablePositions.map((data,i) => {
                            return(<option key={i} value={data}>{data}</option>) 
                        })}
                    </Form.Control>
                </Form.Group>
                
                <div className="meeting">
                    <h3>Set Meeting</h3>
                    <Form.Group className='mb-3 form-group meeting-form' controlId='setTime'>
                        {/* <Form.Label style={{marginRight: "20px"}}>Date</Form.Label> */}
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <DatePicker onChange={setValue} name='meetingDate' value={value} />
                            <Form.Control as="select" name='meetingStartTime' onChange={handleMeetingTimeChange} >
                                <option value={null}>Set Start Time:</option>
                                {availableTimes && availableTimes.map((data,i) => {
                                    return(<option key={i} value={data.value}>{data.display}</option>)
                                })}
                            </Form.Control>
                            <Button disabled={disabledMeetingButton} onClick={buildEvent}>Set Meeting</Button>
                            {/* <Form.Control as="select" name='meetingEndTime' onChange={handleChange} style={{flexBasis: "49%"}}>
                                <option values={null}>Set End Time:</option>
                                {availableEndTimes && availableTimes.map((data,i) => {
                                    return(<option key={i} value={data}>{data}</option>)
                                })}
                            </Form.Control> */}
                        </div>
                    </Form.Group>
                    <Button style={{width: "100%"}} onClick={handleSave} disabled={disabledSaveButton}>Save</Button>
                </div>
            </Form>
        </Container>
    )
}

export default Application