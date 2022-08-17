import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Modal, Form, Badge,Row, Col, } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";

import { apiEndpoints } from '../../apiConfig';
import Header from '../../components/Header/Header.component';

const Applicants = () => {
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

    const [ applicantData, setApplicantData ] = useState(null);
    const [ defaultApplicantData ,setDefaultApplicantData ] = useState(null);
    const [ filterValue, setFilterValue ] = useState({})

    useEffect(() => {
        fetch(apiEndpoints.getApplicants, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(apiData => {
                console.log("🚀 ~ file: Applicants.page.jsx ~ line 16 ~ useEffect ~ apiData", apiData)
                const { data } = apiData;
                setApplicantData(data)
                setDefaultApplicantData(data)
            })
    },[])

    const handleFilterChange = (e) => {
        console.log('TEST', e)
        if (e.target.value) {
            const newFilterData = [];
            defaultApplicantData.map(data => {
                if(data[e.target.name] === e.target.value) {
                    newFilterData.push(data)
                }
            })
            setApplicantData(newFilterData)
        } else {
            console.log('HERE ELSE')
            setApplicantData(defaultApplicantData)
        }
    }

    return(
        <div className="applications px-5"> 
            <Header title="Applicants" />
            <div className="filter">
                <Form className='form'>
                    <Row>
                        <Col>
                            <Form.Group className='mb-3 form-group' controlId='serviceLine'>
                                <Form.Label>Service Line:</Form.Label>
                                <Form.Control as="select" aria-label="Default select example" name='serviceLine' onChange={handleFilterChange}>
                                    <option value={null} placeholder="Filter by Service Lines"></option>
                                    {serviceLines.map((data,i) => {
                                        return(<option key={i} value={data}>{data}</option>) 
                                    })}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                        <Form.Group className='mb-3 form-group' controlId='position'>
                            <Form.Label>Position: </Form.Label>
                            <Form.Control as="select" aria-label="Default select example" name='position' onChange={handleFilterChange}>
                                <option value={null} placeholder="Filter by Position"></option>
                                {availablePositions.map((data,i) => {
                                    return(<option key={i} value={data}>{data}</option>) 
                                })}
                            </Form.Control>
                        </Form.Group>
                        </Col>
                        <Col>
                        <Form.Group className='mb-3 form-group' controlId='status'>
                            <Form.Label>Status: </Form.Label>
                            <Form.Control as="select" aria-label="Default select example" name='position' onChange={handleFilterChange}>
                                <option value={null} placeholder="Filter by Position"></option>
                                {status.map((data,i) => {
                                    return(<option key={i} value={data}>{data}</option>) 
                                })}
                            </Form.Control>
                        </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </div>
            <Table size="md">
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Applying for Position</th>
                    <th>Status</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    { applicantData && applicantData.map((data, i) => {
                        return(
                            <tr key={i}>
                                <td> 
                                    <div className="d-flex align-items-center">
                                        <div style={{height: '50px', width:'50px', border:"1px solid black", textAlign:"center"}} className="rounded-circle">
                                            <p className="mt-2 font-weight-bold" style={{fontSize: "1.25em"}}>{ data.name.split(' ')[0].split('')[0] + data.name.split(' ')[data.name.split(' ').length - 1].split('')[0]}</p>
                                        </div>
                                        <div className="ms-3 ml-2">
                                            <p className="font-weight-bold mb-1">{data.name}</p>
                                            <p className="text-muted mb-0">{data.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>{data.serviceLine} - {data.position}</td>
                                <td><span class="badge badge-pill badge-primary">{data.status}</span></td>
                                <td>
                                    <Link to={data._id}><Button variant="light">
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

export default Applicants;