import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import ToggleButton from "react-bootstrap/ToggleButton";
import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import teca from "./teca.png";
import img1 from "./img1.jpg";
import img2 from "./img2.jpg";
import img3 from "./img3.jpg";
import img4 from "./img4.jpg";
import img5 from "./img5.jpg";
import img6 from "./img6.jpg";
import img7 from "./img7.jpg";
import img8 from "./img8.jpg";

export default function Urna(props) {
  return (
    <Container>
      <Card className="text-center mt-3 mb-3">
        <Card.Header><h3  className="text-primary"> <Badge pill bg="primary">BOLETIM DE VOTO</Badge></h3></Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>#</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <ListaCandidatos
                contract={props.contract}
                accounts={props.accounts}
              />
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer className="text-muted"></Card.Footer>
      </Card>
    </Container>
  );
}

const ListaCandidatos = (props) => {
  const [numeroCandidatos, setNumeroCandidatos] = useState(0);
  const [candidatos, setCandidatos] = useState([]);

  useEffect(async () => {
    const numero = await props.contract.methods.numeroCandidatos().call();
    // setNumeroCandidatos(numero);
    for (let i = 1; i <= numero; i++) {
      const candidato = await props.contract.methods.candidatos(i).call();
      setCandidatos((candidatos) => [...candidatos, candidato]);
    }
    ouvirEventos();
  }, []);

  const ouvirEventos = () => {
    props.contract.events.Votado({})
      .on('data', (event) => {
        alert("VOTO EFECTUADO ✔ \n Votou para: " + event.returnValues);
    })
    .on('error', async function(event){
      console.log(event.returnValues);
      alert('ERRO! Voto não efectuado');
    });
  }

  const enviarVoto = async (candidatoId, candidato) => {
    const conf = window.confirm(
      "VOTAR PARA: " + candidatoId + " - " + candidato
    );
    if (conf) {
      await props.contract.methods
        .votar(candidatoId)
        .send({ from: props.accounts[0] });
    }
  };

  var images = [], index = 0;
  images[0] = img2;
  images[1] = img1;
  images[2] = img3;
  images[3] = img4;
  images[4] = img5;
  images[5] = img6;
  images[6] = img7;
  images[7] = img8;
  // index = Math.floor(Math.random() * images.length);
  // document.write(images[index]);

  return (

    <>
      {candidatos.map((candidato, key) => {
        return (
          <tr key={candidato.id} className= 'table-ligth'>
            <td>
              <h1>{key + 1}</h1>
            </td>
            <td>
              <img src={images[key]} className="img-fluid" alt={images[7]}/>
            </td>
            <td className= 'table-info'>
              <h1>{candidato.nome}</h1>
            </td>
            <td>
              <ToggleButton
                id={candidato.id}
                type="checkbox"
                size="lg"
                variant="outline-success"
                value={candidato.id}
                onClick={(e) => enviarVoto(candidato.id, candidato.nome)}
              >
                VOTAR
              </ToggleButton>
            </td>
          </tr>
        );
      })}
    </>
  );
};
