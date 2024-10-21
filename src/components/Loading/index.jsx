import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

const Loading = () => {
    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <div className="mt-3">Carregando...</div>
            </div>
        </Container>
    );
};

export default Loading;
