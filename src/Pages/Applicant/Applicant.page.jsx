import React, { useState, useEffect } from 'react'
import { apiEndpoints } from '../../apiConfig'
import { Container, Row, Col, Button, Form, FormControl, Card } from 'react-bootstrap'
import { useLocation, useResolvedPath } from 'react-router';
import DatePicker from 'react-date-picker'

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

const status = [
    'For Initial Assessment',
    'For Technical Assessment',
    'For Selection',
    'For Reference Check',
    'For Offer/Contract',
    'For Onboarding',
    'Onboarded'
]

const Applicant = () => {
    const location = useLocation().pathname.split('/')[useLocation().pathname.split('/').length - 1]

    const [ availableTimes, setAvailableTimes ] = useState(null)
    const [ applicantData, setApplicantData ] = useState(null)
    const [ value, setValue ] = useState(new Date())
    const [ disabledMeetingButton, setDisabledMeetingButton] = useState(true)
    const [ disabledSaveButton, setDisabledSaveButton ] = useState(false)

    useEffect(() => {

        let times = []
        let endTimes = []

        for (let i=8;i<17;i++) {
            times.push({ 
                value: i,
                display: new Date(new Date(new Date(new Date().setHours(i)).setMinutes(0)).setSeconds(0)).toLocaleTimeString()
            })
        }

        setAvailableTimes(times)

        fetch(apiEndpoints.getOneApplicant + location, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => {
                setApplicantData(data)
            })
    },[])

    const handleChange = (e) => {
        setFormValue(prev => ({...prev, [e.target.name]: e.target.value }))
        console.log("🚀 ~ file: Applicant.page.jsx ~ line 114 ~ handleChange ~ setFormValue", formValue)
    }

    const handleMeetingTimeChange = (e) => {
        setDisabledMeetingButton(false)
        setMeetingTime(e.target.value)
    }

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

    const handleSave = () => {
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
                                        <Form.Control defaultValue={applicantData && applicantData.name} disabled></Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className='mb-3 form-group' controlId='formEmail'>
                                        <Form.Label>Email Address:</Form.Label>
                                        <Form.Control defaultValue={applicantData && applicantData.email} type='email' disabled></Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className='mb-3 form-group' controlId='content' style={{flexBasis: "100%"}}>
                                <Form.Label>E-mail Content Preview:</Form.Label>
                                <FormControl as="textarea" rows={10} defaultValue={applicantData && applicantData.bodyPreview} disabled></FormControl>
                            </Form.Group>
                            <Button className='mb-3' style={{flexBasis: "100%"}} href={`data:application/pdf;base64,${applicantData && applicantData.attachmentData}`} target="_blank" disabled={applicantData && !applicantData.attachmentData}>View Attachment
                            </Button>
                        </Col>
                    </Row>
                    <hr className='my-5'/>
                    <Row>
                        <Col sm={4}>
                            <h5>Something Section</h5>
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
                                            {serviceLines.map((data,i) => {
                                                return(<option key={i} value={data}>{data}</option>) 
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
                    {  applicantData && !applicantData.isInitialMeetingSet && 
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
                }
                <hr className='my-5' />
                <Row>
                    <Col sm={4}>
                        <h5>Assessment</h5>
                            <p className="text-muted">
                                Enter assessment for the candidate.
                           </p>
                    </Col>
                    <Col sm={8}>
                        <Form.Group className='mb-3 form-group' controlId='content' style={{flexBasis: "100%"}}>
                            <Form.Label>Initial Assessment</Form.Label>
                            <Form.Control as="textarea" rows={10} name="initialAssessment" onChange={handleChange}></Form.Control>
                        </Form.Group>
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
            /* <Form className="form">
                <Form.Group className='mb-3 form-group' sm controlId='formName'>
                    <Form.Label>Applicant Name:</Form.Label>
                    <Form.Control defaultValue={applicantData && applicantData.name} disabled></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3 form-group' controlId='formEmail'>
                    <Form.Label>Applicant Email Address:</Form.Label>
                    <Form.Control defaultValue={applicantData && applicantData.email} type='email' disabled></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3 form-group' controlId='content' style={{flexBasis: "100%"}}>
                    <Form.Label>Application Content Preview</Form.Label>
                    <FormControl as="textarea" rows={10} defaultValue={applicantData && applicantData.bodyPreview} disabled></FormControl>
                </Form.Group>
                <Button style={{flexBasis: "100%"}} disabled={applicantData && !applicantData.attachmentData}>
                    <a href={`data:application/pdf;base64,${applicantData && applicantData.attachmentData}`} target='_blank' title={`${applicantData && applicantData.name} Attachment`} style={{color: "white"}}>See Attachment</a>
                </Button>
                <Form.Group className='mb-3 form-group' controlId='serviceLine'>
                    <Form.Label>Service Line:</Form.Label>
                    <Form.Control as="select" aria-label="Default select example" name='serviceLine' defaultValue={applicantData && applicantData.serviceLine} onChange={handleChange}>
                        <option></option>
                        {serviceLines.map((data,i) => {
                            return(<option key={i} value={data}>{data}</option>) 
                        })}
                    </Form.Control>
                </Form.Group>
                <Form.Group className='mb-3 form-group' controlId='position'>
                    <Form.Label>Position: </Form.Label>
                    <Form.Control as="select" aria-label="Default select example" name='position' defaultValue={applicantData && applicantData.position} onChange={handleChange}>
                        <option></option>
                        {availablePositions.map((data,i) => {
                            return(<option key={i} value={data}>{data}</option>) 
                        })}
                    </Form.Control>
                </Form.Group>
                <Form.Group className='mb-3 form-group' controlId='status'>
                    <Form.Label>Status: </Form.Label>
                    <Form.Control as="select" aria-label="Default select example" name='status' onChange={handleChange}>
                        <option></option>
                        {status.map((data,i) => {
                            return(<option key={i} value={data}>{data}</option>) 
                        })}
                    </Form.Control>
                </Form.Group>
                
                {  applicantData && !applicantData.isInitialMeetingSet && 
                    <div className="meeting">
                        <h3>Set Meeting</h3>
                        <Form.Group className='mb-3 form-group meeting-form' controlId='setTime'>
                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                <DatePicker onChange={setValue} name='meetingDate' value={value} />
                                <Form.Control as="select" name='meetingStartTime' onChange={handleMeetingTimeChange} >
                                    <option value={null}></option>
                                    {availableTimes && availableTimes.map((data,i) => {
                                        return(<option key={i} value={data.value}>{data.display}</option>)
                                    })}
                                </Form.Control>
                                <Button disabled={disabledMeetingButton} onClick={buildEvent}>Set Meeting</Button>

                            </div>
                        </Form.Group>
                    </div>
                }
                <Form.Group className='mb-3 form-group' controlId='content' style={{flexBasis: "100%"}}>
                    <Form.Label>Initial Assessment</Form.Label>
                    <Form.Control as="textarea" rows={10} name="initialAssessment" onChange={handleChange}></Form.Control>
                </Form.Group>
                <Button style={{width: "100%"}} onClick={handleSave} disabled={disabledSaveButton}>Save</Button>
            </Form>
            
        </Container> */
    )
}

export default Applicant;