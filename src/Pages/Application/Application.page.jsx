import React, {useState, useEffect, useCallback} from 'react';
import { useMsal } from '@azure/msal-react';
import { useLocation, useResolvedPath } from 'react-router';
import { Container, Row, Col, Button, Form, FormControl, Card } from 'react-bootstrap'
import DatePicker from 'react-date-picker'
import HeaderComponent from '../../components/Header/Header.component';

import { graphConfig, loginRequest } from '../../authConfig'
import { callMsGraph } from '../../graph'

import service_positions_json from '../../application_positions.json';
console.log("🚀 ~ file: Applicant.page.jsx ~ line 11 ~ service_positions_json", service_positions_json)

import './Application.styles.css'
import { apiEndpoints } from '../../apiConfig';
import { DateRangeOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import useDownloadFile from '../../hooks/useDownloadFile';
import useDesignation from '../../hooks/useDesignation';

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
    const [downloadFile] = useDownloadFile();
    const [getServiceLines] = useDesignation();
    const [availablePositions, setAvailablePositions] = useState([]);

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
            attachmentData,
            status: 'For Initial Assessment'
        })
    },[userData, attachmentData])

    const handleChange = (e) => {
        setFormValue(prev => ({...prev, [e.target.name]: e.target.value }))
        if (getServiceLines().filter(service => service.name === e.target.value).length > 0) {
            setAvailablePositions(getServiceLines().filter(service => service.name === e.target.value)[0].availablePositions) 
        }
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

    const handleOpenAttachment= () => {
        downloadFile(attachmentData);
    }

    return(
        // <Container>
        <Card className='mt-2 ml-2'>
            <Card.Header className='px-5 py-4'><h4 className='font-weight-bold mb-0'>Candidate Profile</h4></Card.Header>
            <Card.Body className='px-5'>
                <Form>
                    <Row>
                        <Col sm={4}>
                            <h5>Candidate Information</h5>
                            <p className="text-muted">
                                Information from the candidate retrieved from email. Click 'View Attachment' to see attached CV or Resume of applicant.
                            </p>
                        </Col>
                        <Col sm={8}>
                            <Row>
                                <Col>
                                    <Form.Group className='mb-3 form-group' sm controlId='formName'>
                                        <Form.Label>Name:</Form.Label>
                                        <Form.Control defaultValue={userData && userData.sender.emailAddress.name} disabled></Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className='mb-3 form-group' controlId='formEmail'>
                                        <Form.Label>Email Address:</Form.Label>
                                        <Form.Control defaultValue={userData && userData.sender.emailAddress.address} type='email' disabled></Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className='mb-3 form-group' controlId='content' style={{flexBasis: "100%"}}>
                                <Form.Label>E-mail Content Preview:</Form.Label>
                                <FormControl as="textarea" rows={10} defaultValue={userData && userData.bodyPreview} disabled></FormControl>
                            </Form.Group>
                            <Button className='mb-3' style={{flexBasis: "100%"}} onClick={handleOpenAttachment} disabled={!attachmentData}>View Attachment
                            </Button>
                        </Col>
                    </Row>
                    <hr className='my-5'/>
                    <Row>
                        <Col sm={4}>
                            <h5>Designation</h5>
                            <p className="text-muted">
                                Information about the position or role that the applicant (find out other term for applicant) is best for.
                            </p>
                        </Col>
                        <Col sm={8}>
                            <Row>
                                <Col>
                                    <Form.Group className='mb-3 form-group' controlId='serviceLine'>
                                        <Form.Label>Service Line:</Form.Label>
                                        <Form.Control as="select" aria-label="Default select example" name='serviceLine' onChange={handleChange}>
                                            <option></option>
                                            {getServiceLines().map((data,i) => {
                                                return(<option key={i} value={data.name}>{data.name}</option>) 
                                            })}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className='mb-3 form-group' controlId='position'>
                                        <Form.Label>Position: </Form.Label>
                                        <Form.Control as="select" aria-label="Default select example" name='position' onChange={handleChange}>
                                            <option></option>
                                            {availablePositions.map((data,i) => {
                                                return(<option key={i} value={data}>{data}</option>) 
                                            })}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <hr className='my-5'/>
                    <Row>
                        <Col sm={4}>
                            <h5>Set Meeting</h5>
                            <p className="text-muted">
                                Set a meeting with the candidate for screening or interview purposes.
                           </p>
                        </Col>
                        <Col sm={8}>
                            <Row>
                                <Col sm={2}>
                                    <Form.Group>
                                        <Form.Label>Date:</Form.Label>
                                        <div>
                                            <DatePicker onChange={setValue} name='meetingDate' value={value} />
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className='ml-3'>
                                        <Form.Label style={{marginRight: "20px"}}>Time:</Form.Label>
                                        <Form.Control as="select" name='meetingStartTime' onChange={handleMeetingTimeChange} style={{maxWidth: "160px", maxHeight: "100px"}} >
                                            <option value={null}>Set Start Time:</option>
                                            {availableTimes && availableTimes.map((data,i) => {
                                                return(<option key={i} value={data.value}>{data.display}</option>)
                                            })}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                        <div>
                            <Button disabled={disabledMeetingButton} onClick={buildEvent}>Set Meeting</Button>
                        </div>
                        </Col>
                    </Row>
                    {/* <div className="meeting">
                        <h3>Set Meeting</h3>
                    </div> */}

                </Form>
            </Card.Body>
            <Card.Footer className='text-right'>
                <Button variant="warning" onClick={handleSave} disabled={disabledSaveButton}>Archive</Button>
                <Button className="ml-3" onClick={handleSave} disabled={disabledSaveButton}>Save</Button>
            </Card.Footer>
        </Card>
        // </Container>
    )
}

export default Application
