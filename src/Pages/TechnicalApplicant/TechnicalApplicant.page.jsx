import React, { useState, useEffect } from 'react'
import { apiEndpoints } from '../../apiConfig'
import { Container, Row, Col, Button, Form, FormControl } from 'react-bootstrap'
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

const TechnicalApplicant = () => {
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

    const handleChange = () => {

    }

    const handleMeetingTimeChange = () => {

    }

    const buildEvent = () => {

    }

    const handleSave = () => {
        
    }

    return(
        <Container>
            <Form className="form">
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
                        {serviceLines.map((data,i) => {
                            return(<option key={i} value={data}>{data}</option>) 
                        })}
                    </Form.Control>
                </Form.Group>
                <Form.Group className='mb-3 form-group' controlId='position'>
                    <Form.Label>Position: </Form.Label>
                    <Form.Control as="select" aria-label="Default select example" name='position' defaultValue={applicantData && applicantData.position} onChange={handleChange}>
                        {availablePositions.map((data,i) => {
                            return(<option key={i} value={data}>{data}</option>) 
                        })}
                    </Form.Control>
                </Form.Group>
                <Form.Group className='mb-3 form-group' controlId='status'>
                    <Form.Label>Status: </Form.Label>
                    <Form.Control as="select" aria-label="Default select example" name='position' defaultValue={applicantData && applicantData.position} onChange={handleChange}>
                        {status.map((data,i) => {
                            return(<option key={i} value={data}>{data}</option>) 
                        })}
                    </Form.Control>
                </Form.Group>
                
                {  applicantData && !applicantData.isInitialMeetingSet && 
                    <div className="meeting">
                        <h3>Set Meeting</h3>
                        <Form.Group className='mb-3 form-group meeting-form' controlId='setTime'>
                            {/* <Form.Label style={{marginRight: "20px"}}>Date</Form.Label> */}
                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                <Form.Control as="select" name="interviewer" onChange={handleMeetingChange}>
                                    <option value=""></option>
                                    <option value="jeffrey.alca@essilor.com">Jeffrey Alca</option>
                                    <option value="ernesto.paquibol@ext.essilor.com">Ernesto Paquibol</option>
                                </Form.Control>
                                <DatePicker onChange={setValue} name='meetingDate' value={value} />
                                <Form.Control as="select" name='meetingStartTime' onChange={handleMeetingTimeChange} >
                                    <option value={null}>Set Start Time:</option>
                                    {availableTimes && availableTimes.map((data,i) => {
                                        return(<option key={i} value={data.value}>{data.display}</option>)
                                    })}
                                </Form.Control>
                                <Form.Control as="select" name="interviewer" onChange={handleMeetingChange}>
                                    <option value=""></option>
                                    <option value="jeffrey.alca@essilor.com">Jeffrey Alca</option>
                                    <option value="ernesto.paquibol@ext.essilor.com">Ernesto Paquibol</option>
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
                    </div>
                }
                <Form.Group className='mb-3 form-group' controlId='content' style={{flexBasis: "100%"}}>
                    <Form.Label>Initial Assessment</Form.Label>
                    <Form.Control as="textarea" rows={10} name="initialAssessment" onChange={handleChange} defaultValue="Add Initial Assessment Saved as Default Value"></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3 form-group' controlId='content' style={{flexBasis: "100%"}}>
                    <Form.Label>Technical Assessment</Form.Label>
                    <Form.Control as="textarea" rows={10} name="initialAssessment" onChange={handleChange}></Form.Control>
                </Form.Group>
                <Button style={{width: "100%"}} onClick={handleSave} disabled={disabledSaveButton}>Save</Button>
            </Form>
            
        </Container>
    )
}

export default TechnicalApplicant;