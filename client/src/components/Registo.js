import React, { useState, useEffect} from "react";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Registo(props) {

    const forceUpdate = useForceUpdate();

    return (
        <>
            {props.alertRegisto && <AlertRegisto forceUpdate = {forceUpdate} fecharAlert = {props.fecharAlert} alertSuccess = {props.alertSuccess} nome = {props.nome} bi = {props.bi} endereco = {props.endereco} />}
            <FormularioRegisto contract = {props.contract} accounts = {props.accounts} registar = {props.registar}/>
            <ListaEleitor contract = {props.contract} accounts = {props.accounts} alertSuccess = {props.alertSuccess}/>
        </>
    )
};

function useForceUpdate(){
    const [value, setValue] = useState(false); 
    return () => setValue(!value);
}


function FormularioRegisto(props) {

    const [bi, setBi] = useState(null);
    const [nome, setNome] = useState(null);
    const [nomeCandidato, setNomeCandidato] = useState(null);
    const [endereco, setEndereco] = useState(null);

    useEffect( async () => {
        ouvirEventos();
    },[]);

    const ouvirEventos = () => {
        props.contract.events.RegistadoCandidato({})
        .on('data', (event) => {
            alert("CANDIDATO REGISTADO ✔ \n" + event.returnValues[0]);
            window.location.reload();
        })
        .on('error', async function(event){
        console.log(event.returnValues);
        alert('ERRO! CANDIDATO NÃO NÃO REGISTADO');
        });
    }

    const registarCandidato = async (nome) => {
        const conf = window.confirm("REGISTAR O CANDIDATO: " + nome);
        if(conf){
            await props.contract.methods.registarCandidato(nome).send({from: props.accounts[0]});
        }
    }

    return (
    <Container className="mt-5">
    <hr/>
    <h3 className="text-center">Registo de candidatos</h3>
    <Form onSubmit ={(event) => {event.preventDefault();   registarCandidato(nomeCandidato);}}>
        <Row className="justify-content-center">
            <Form.Group className="mb-3" as={Col} xs={12} md={6}>
                <Form.Label>Candidato</Form.Label>
                <Form.Control type="text" size="lg" value = { nomeCandidato } onChange={(e) => {e.preventDefault(); setNomeCandidato(e.target.value);}} required placeholder="Nome do candidato" />
            </Form.Group>
        </Row>
        <Row className="justify-content-center">
            <Col xs={12} md={6} className="d-grid" >
                <Button variant="primary" size="lg" type="submit">
                    Registar candidato
                </Button>
            </Col>
        </Row>
    </Form>
    <ListaCandidatos contract = {props.contract}/>
    <hr/>
    <h3 className="text-center">Registo de eleitores</h3>
    <Form onSubmit ={(event) => {event.preventDefault();  props.registar(nome , bi, endereco);}}>
        <Row className="mb-2 g-3 justify-content-center">
            <Form.Group as={Col} xs={12} md={6}>
                <Form.Label>Nome do eleitor</Form.Label>
                <Form.Control type="text" size="lg" value = { nome } onChange={(e) => {e.preventDefault(); setNome(e.target.value);}} required placeholder="Nome completo"/>
            </Form.Group>

            <Form.Group as={Col} xs={12} md={6} controlId="formBi">
                <Form.Label>Bilhete de identidade</Form.Label>
                <Form.Control type="text" size="lg" value = { bi } onChange={(e) => {e.preventDefault(); setBi(e.target.value);}} required  maxLength = "14" placeholder="Número do bilhete de identidade" />
            </Form.Group>
        </Row>

        <Row className="justify-content-center">
            <Form.Group className="mb-3" as={Col} xs={12} md={12}>
                <Form.Label>Endereço</Form.Label>
                <Form.Control type="text" size="lg" value = { endereco } onChange={(e) => {e.preventDefault(); setEndereco(e.target.value);}} required maxLength = "42" placeholder="Endereço ethereum" />
            </Form.Group>
        </Row>
        <Row className="justify-content-center">
            <Col xs={12} md={6} className="d-grid" >
                <Button variant="primary" size="lg" type="submit">
                    Registar
                </Button>
            </Col>
        </Row>
    </Form>
    </Container>
    );
}




const ListaEleitor = (props) => {

const [numeroEleitor, setNumeroEleitor] = useState(0);
const [eleitores, setEleitores] = useState([]);

useEffect( async () => {
    const numero = await props.contract.methods.numeroEleitores().call();
    setNumeroEleitor(numero);
    for (let i = 1; i <= numero; i++) {
        const eleitor = await props.contract.methods.listaEleitores(i).call();
        setEleitores(eleitores => [...eleitores, eleitor]);
    }
    ouvirEventos();
},[]);

const direitoVoto = async (nome, endereco, bi, id) => {
    const conf = window.confirm("Dar o direito ao voto ?" + "\n" + nome + "\n" + bi +"\n"+ endereco);
    if(conf){
        await props.contract.methods.darDireitoDeVoto(endereco, bi, id).send({from: props.accounts[0]});
    }
}

const ouvirEventos = () => {
    props.contract.events.DireitoVoto({})
      .on('data', (event) => {
        alert("Foi dado o direito ao voto: " + event.returnValues[0] +" - "+event.returnValues[1]);
    })
    .on('error', async function(event){
      console.log(event.returnValues);
      alert('ERRO! Registo não efectuado');
    });
  }

const cursor = {
    cursor: 'pointer',
};

eleitores.reverse();

return (
<Container>
<hr/>
    <Table responsive bordered hover className= "border-primary caption-top">
    <caption>Lista de eleitores - ({numeroEleitor})</caption>
    <thead>
        <tr class= 'table-dark'>
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
                    <tr key={eleitor.id} style = {cursor}>
                        <td class= 'table-dark'>{key + 1}</td>
                        <td class= 'table-dark'>{eleitor.id}</td>
                        <td class= 'table-info'>{eleitor.nome}</td>
                        <td class= 'table-info'>{eleitor.bi}</td>
                        <td class= {eleitor.direito ? 'table-success':'table-danger'} >{eleitor.direito ? 'SIM':'NÃO'} {!eleitor.direito && <Button variant = "success" type="submit" size = "sm" onClick={(event) => {event.preventDefault(); direitoVoto(eleitor.nome, eleitor.endereco, eleitor.bi, eleitor.id)}}>Dar o direito</Button>}</td>
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


const ListaCandidatos = (props) => {

const [numeroCandidatos, setNumeroCandidatos] = useState(0);
const [candidatos, setCandidatos] = useState([]);

useEffect( async () => {
    const numero = await props.contract.methods.numeroCandidatos().call();
    setNumeroCandidatos(numero);
    for (let i = 1; i <= numero; i++) {
        const candidato = await props.contract.methods.candidatos(i).call();
        setCandidatos(candidatos => [...candidatos, candidato]);
    }
},[]);

const cursor = {
    cursor: 'pointer',
};

candidatos.reverse();

return (
<Container>
    <Table responsive bordered hover className= "border-primary caption-top">
    <caption>Lista de candidatos - ({numeroCandidatos})</caption>
    <thead>
        <tr class= 'table-dark'>
            <th>#</th>
            <th>ID</th>
            <th>Nome completo</th>
            <th>Números de votos</th>
        </tr>
    </thead>
            <tbody>
            {candidatos.map((candidato, key) => {
                return(
                    <tr key={candidato.id} style = {cursor}>
                        <td class= 'table-dark'>{key + 1}</td>
                        <td class= 'table-dark'>{candidato.id}</td>
                        <td class= 'table-info'>{candidato.nome}</td>
                        <td class= 'table-info'>{candidato.numeroVoto}</td>
                    </tr>
                )
            })}
        </tbody>
    </Table>
</Container>
    );
}

const AlertRegisto = (props) => {
    return (
        <Alert variant= {props.alertSuccess ? "success" : "danger"} onClose = {() => {props.fecharAlert()}} dismissible>
            <Alert.Heading>{props.alertSuccess ? "Registo efectuado com sucesso." : "Registo não efectuado"}</Alert.Heading>
            <p>
                {props.nome + " / " + props.bi + " / " + props.endereco}
            </p>
        </Alert>
    );
  }

  