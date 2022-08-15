import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Modal, Form } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";

import { apiEndpoints } from '../../apiConfig';
import Header from '../../components/Header/Header.component';

const TechnicalApplicants = () => {
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

    const [ applicantData, setApplicantData ] = useState(null);
    const [ defaultApplicantData ,setDefaultApplicantData ] = useState(null);
    const [ filterValue, setFilterValue ] = useState({})

    useEffect(() => {
        // TODO: Filter that is for status is for technical assessment
        fetch(apiEndpoints.getApplicants+'status=For Technical Assessment', {
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
        <div className="applications">
            <Header title="Applicants" />
            <div className="filter">
                <Form className='form'>
                    <Form.Group className='mb-3 form-group' controlId='serviceLine'>
                        <Form.Label>Service Line:</Form.Label>
                        <Form.Control as="select" aria-label="Default select example" name='serviceLine' onChange={handleFilterChange}>
                            <option value={null} placeholder="Filter by Service Lines"></option>
                            {serviceLines.map((data,i) => {
                                return(<option key={i} value={data}>{data}</option>) 
                            })}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='mb-3 form-group' controlId='position'>
                        <Form.Label>Position: </Form.Label>
                        <Form.Control as="select" aria-label="Default select example" name='position' onChange={handleFilterChange}>
                            <option value={null} placeholder="Filter by Position"></option>
                            {availablePositions.map((data,i) => {
                                return(<option key={i} value={data}>{data}</option>) 
                            })}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </div>
            <Table striped bordered hover size="lg">
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    { applicantData && applicantData.map((data, i) => {
                        return(
                            <tr key={i}>
                                <td>{data.name}</td>
                                <td>{data.serviceLine} - {data.position}</td>
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

export default TechnicalApplicants;