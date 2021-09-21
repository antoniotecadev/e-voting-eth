//SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;

contract Eleicao {

    constructor() public {
        adicionarCandidato("Antonio");
        adicionarCandidato("Jose");
        adicionarCandidato("Buaio");
        adicionarCandidato("Teca");
    }

    struct Candidatos {
        uint id;
        string nome;
        uint numeroVoto;
    }

    mapping(uint => Candidatos) public candidatos;

    uint public numeroCandidatos;

    function adicionarCandidato(string memory nome) private {
        numeroCandidatos++;
        candidatos[numeroCandidatos] = Candidatos(numeroCandidatos, nome, 0);
    }
}
