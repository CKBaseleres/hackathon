import { Chip, styled } from "@mui/material";
import { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import useDesignation from "../../hooks/useDesignation";

const KeywordsContainer = styled('div')(() => ({
    display: 'flex',
    gap: '10px',
}))

const RequestForRecruitement = () => {
    const [getServiceLines] = useDesignation();
    const [availablePositions, setAvailablePositions] = useState([]);
    const [disabledSaveButton, setDisableSaveButton] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [keywords, setKeywords] = useState([]);

    const handleChangeServiceLine = (e) => {
        setAvailablePositions(getServiceLines().filter(service => service.name === e.target.value)[0].availablePositions);
    }
    const handleSave = () => {
        setDisableSaveButton(prev => !prev);
    }
    const handleKeyup = (e) => {
        if (e.code === 'Enter') {
            setKeywords(prev => [...prev, keyword]);
            setKeyword('');
        }
    }

    const handleDelete = (key) => {
        const words = [...keywords];
        words.splice(keywords.indexOf(key), 1);
        setKeywords(words)
    }

    const handleKeywordChange = (e) => {
        setKeyword(e.target.value);
    }

    return (
        <Card className='mt-2 ml-2'>
            <Card.Header className='px-5 py-4'><h4 className='font-weight-bold mb-0'>Request for Recruitement</h4></Card.Header>
            <Card.Body className='px-5'>
                <Form>
                    <Row>
                        <Col sm={4}>
                            <h5>Position Information</h5>
                            <p className="text-muted">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mollis, mauris in finibus auctor, turpis.
                            </p>
                        </Col>
                        <Col sm={8}>
                            <Row>
                                <Col>
                                    <Form.Group className='mb-3 form-group' sm controlId='formName'>
                                        <Form.Label>Name:</Form.Label>
                                        <Form.Control></Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
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
                                        <Form.Control as="select" aria-label="Default select example" name='serviceLine' onChange={handleChangeServiceLine}>
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
                                        <Form.Control as="select" aria-label="Default select example" name='position'>
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
                            <h5>Position Keywords</h5>
                            <p className="text-muted">
                                These keywords will be used to filter all of the emails sent to HR. Make sure the keywords are related to the name of the position you are looking for
                            </p>
                        </Col>
                        <Col sm={8}>
                            <Row>
                                <Col>
                                    <Form.Group className='mb-3 form-group' sm controlId='formName'>
                                        <Form.Label>Keyword (enter to add keyword):</Form.Label>
                                        <Form.Control onKeyUp={handleKeyup} value={keyword} onChange={handleKeywordChange}></Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <KeywordsContainer>
                                        {keywords && keywords.map(key => (<Chip label={key} onDelete={() => handleDelete(key)}/>))}
                                    </KeywordsContainer>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {/* 
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
                } */}
                <hr className='my-5' />
                {/* <Row>
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
                </Row> */}
                    {/* <div className="meeting">
                        <h3>Set Meeting</h3>
                    </div> */}

                </Form>
            </Card.Body>
            <Card.Footer className='text-right'>
                <Button className="ml-3" onClick={handleSave} disabled={disabledSaveButton}>Save</Button>
            </Card.Footer>
        </Card>
    )
}

export default RequestForRecruitement;