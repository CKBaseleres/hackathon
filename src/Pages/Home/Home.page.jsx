import React from 'react'
import { Container, Col, Row, Card, Button } from 'react-bootstrap'
const Home = () => {
    return (
        <Container>
            <Row>
                <Col>
                    <Card style={{maxWidth: "300px"}}>
                        <Card.Body>Number of Items in Inbox: 8</Card.Body>
                        <Card.Footer>
                            <Button>View</Button>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col>
                <Card>
                        <Card.Body>Number of Items in Applicants: 2</Card.Body>
                        <Card.Footer>
                            <Button>View</Button>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col>
                <Card>
                        <Card.Body>Number of Items in Archived: 8</Card.Body>
                        <Card.Footer>
                            <Button>View</Button>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>

    )
}

export default Home;