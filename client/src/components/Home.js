import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Card, Container, Table, Badge, ProgressBar} from 'react-bootstrap';

export default function Home(props) {

    return (
    <Container>
      <Card className="text-center mt-3 mb-3">
        <Card.Header><h3 className="text-primary"><Badge pill bg="primary">RESULTADOS EM TEMPO REAL</Badge></h3></Card.Header>
        <Card.Body>
          <Table bordered responsive hover>
            <tbody>
              <ListaCandidatos contract={props.contract}/>
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer className="text-muted"><h3>Votação Electrónica (Blockchain)</h3></Card.Footer>
      </Card>
    </Container>
    );
}

const ListaCandidatos = (props) => {
    const [candidatos, setCandidatos] = useState([]);
    const [numeroVotos, setNumeroVotos] = useState(0);
    const [numeroEleitores, setNumeroEleitores] = useState(0);

  
    useEffect(async () => {
      const numeroVotos = await props.contract.methods.numeroVotos().call();
      setNumeroVotos(numeroVotos);

      const numero = await props.contract.methods.numeroCandidatos().call();

      const numeroEleitores = await props.contract.methods.numeroEleitores().call();
      setNumeroEleitores(numeroEleitores);

      for (let i = 1; i <= numero; i++) {
        const candidato = await props.contract.methods.candidatos(i).call();
        setCandidatos((candidatos) => [...candidatos, candidato]);
      }
    }, []);
    return (
      <>
        <tr>
            <td>
                <Badge pill bg="warning"><h6>Eleitores ({numeroEleitores})</h6></Badge>{' '}
            </td>
            <td>
                <Badge pill bg="success"><h6>Votos efectuados  ({numeroVotos})</h6></Badge>{' '}
                <Badge pill bg="danger"><h6>Votos não efectuados ({Number(numeroEleitores) - Number(numeroVotos)})</h6></Badge>
            </td>
            <td></td>
        </tr>
        <tr class= 'table-primary'>
            <th>#</th>
            <th>CANDIDATOS</th>
            <th>VOTOS</th>
        </tr>
        {candidatos.map((candidato, key) => {

            const percEleitor = (Number(numeroEleitores) + Number(candidato.numeroVoto)) - Number(numeroEleitores);
            const percVotos = (Number(numeroVotos) + Number(candidato.numeroVoto)) - Number(numeroVotos);

          return (
            <tr key={candidato.id}>
              <td className= 'table-primary'>
                <h4>{key + 1}</h4>
              </td>
              <td>
                <h4>{candidato.nome}</h4>
                <ProgressBar animated now={percEleitor} label={`${percEleitor}%`}/>
                <ProgressBar variant="warning" animated now={percVotos} label={`${percVotos}%`}/>
              </td>
              <td>
                <h4>{candidato.numeroVoto}</h4>
              </td>
            </tr>
          );
        })}
      </>
    );
  };




