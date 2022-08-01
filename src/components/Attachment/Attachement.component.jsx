import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Document, Page } from "react-pdf";
import { useMsal } from "@azure/msal-react";
import { callMsGraph } from '../../graph'
import { loginRequest ,graphConfig } from '../../authConfig';


function AttachmentModal({ show, onHide, id }) {
    const { instance, accounts } = useMsal()
    const [ attachmentData, setAttachmentData ] = useState(null)
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    
    useEffect(() => {
        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then((response) => {
            callMsGraph(response.accessToken, graphConfig.graphMessagesEndpoint + `/${id}/attachments`)
                .then(response => {
                    if (response.value[0]) {
                        console.log('ATTACHMENT DATA: ', response.value[0].contentBytes)
                        setAttachmentData(response.value[0].contentBytes)
                    }
                })
        })
    },[])
    
  return (
    <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Attachment</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            { attachmentData !== null ? 
                <Document file={attachmentData} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={pageNumber} />
                </Document>
                : ""
            }
            {/* <Document file={attachmentData} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} />
            </Document> */}
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary">Close</Button>
            <Button variant="primary">Save changes</Button>
        </Modal.Footer>
    </Modal>
  );
}

export default AttachmentModal;