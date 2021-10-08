import React, { useState, useEffect} from "react";
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Estado(props){

    const [eleitores, setEleitores] = useState([]);
    const [endereco, setEndereco] = useState(null);

    const verificarEstadoEleitor = async (endereco) =>{
        if(!props.web3.utils.isHexStrict(endereco) || !props.web3.utils.isAddress(endereco)){
            alert("ENDEREÇO INVÁLIDO\n" + endereco + " ❌ ");
        } else {
            const eleitor = await props.contract.methods.eleitor(endereco).call();
            setEleitores([eleitor]);
        }
    }

    return (
        <Container className="mt-5">
        <hr/>
        <Form onSubmit ={(event) => {event.preventDefault();   verificarEstadoEleitor(endereco);}}>
            <Row className="justify-content-center">
                <Form.Group className="mb-3" as={Col} xs={12} md={6}>
                    <Form.Control type="text" size="lg" value = { endereco } onChange={(e) => {e.preventDefault(); setEndereco(e.target.value);}} required placeholder="Endereço ethereum" />
                </Form.Group>
            </Row>
            <Row className="justify-content-center">
                <Col xs={12} md={6} className="d-grid" >
                    <Button variant="primary" size="lg" type="submit">
                        Verificar estado
                    </Button>
                </Col>
            </Row>
        </Form>

            <Table responsive bordered hover className= "border-primary caption-top">
            <caption><h3>Estado do eleitor</h3></caption>
            <thead>
                <tr class= 'table-primary'>
                    <th>#</th>
                    <th>ID</th>
                    <th>Nome completo</th>
                    <th>Bilhete de identidade</th>
                    <th>Direito ao voto?</th>
                    <th>Voto efectuado?</th>
                    <th>Endereço ethereum</th>
                </tr>
            </thead>
                    <tbody>
                    {eleitores.map((eleitor, key) => {
                        return(
                            <tr key={eleitor.id}>
                                <td class= 'table-dark'>{key + 1}</td>
                                <td class= 'table-dark'>{eleitor.id}</td>
                                <td class= 'table-info'>{eleitor.nome}</td>
                                <td class= 'table-info'>{eleitor.bi}</td>
                                <td class= {eleitor.direito ? 'table-success':'table-danger'} >{eleitor.direito ? 'SIM':'NÃO'}</td>
                                <td class= {eleitor.voto ? 'table-success':'table-danger'} >{eleitor.voto ? 'SIM':'NÃO'}</td>
                                <td class= 'table-info'>{eleitor.endereco}</td>
                            </tr>
                        )
                    })}
                </tbody>
        </Table>

        </Container>
    );
}