import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Modal } from "react-bootstrap";

import { apiEndpoints } from '../../apiConfig';
import Header from '../../components/Header/Header.component';

const Applicants = () => {
    
    const [ applicantData, setApplicantData ] = useState(null);

    useEffect(() => {
        fetch(apiEndpoints.getApplicants, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(apiData => {
                console.log("🚀 ~ file: Applicants.page.jsx ~ line 16 ~ useEffect ~ apiData", apiData)
                const { data } = apiData;
                setApplicantData(data)
            })
    },[])

    return(
        <div className="applications">
            <Header title="Applicants" />
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
                                    {/* <Link to={data.id}><Button variant="light">
                                        View
                                    </Button></Link> */}
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