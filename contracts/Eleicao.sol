//SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;

contract Eleicao {

    address public recenseador;
    uint256 public numeroEleitores;
    uint256 public numeroCandidatos;

    mapping(string => bool) public bilhetes;
    mapping(address => Eleitor) public eleitor;
    mapping(uint256 => Candidato) public candidatos;
    mapping(uint256 => Eleitor) public listaEleitores;

    constructor() public {
        adicionarCandidato("Antonio");
        adicionarCandidato("Jose");
        adicionarCandidato("Buaio");
        adicionarCandidato("Teca");

        recenseador = msg.sender;
    }

    // Estrutura (Model)

    struct Candidato {
        uint256 id;
        string nome;
        uint256 numeroVoto;
    }

    struct Eleitor {
        uint256 id;
        string nome;
        string bi;
        bool voto;
        bool direito;
        bool registo;
        address endereco;
    }

    // Modificadores

    modifier recenseadorOwner(string memory mensagem) {
        require(msg.sender == recenseador, mensagem);
        _;
    }

    // Eventos

    event Registado(string nome, string bi, address endereco);
    event DireitoVoto(string nome, string bi);
    event Votado(string votou);

    

    // Funções

    function adicionarCandidato(string memory nome) private {
        numeroCandidatos++;
        candidatos[numeroCandidatos] = Candidato(numeroCandidatos, nome, 0);
    }

    function registarEleitor(
        string memory nome,
        string memory bi,
        address endereco
    ) public recenseadorOwner("Apenas o recenseador pode registar") {
        
        require(
            endereco != eleitor[endereco].endereco,
            "O endereco ja foi registado"
        );

        require(bilhetes[bi] == false, "O BI ja foi registado");

        numeroEleitores++;
        bilhetes[bi] = true;
        listaEleitores[numeroEleitores] = Eleitor(numeroEleitores, nome, bi, false, false, true, endereco);
        eleitor[endereco] = Eleitor(numeroEleitores, nome, bi, false, false, true, endereco);

        emit Registado(nome, bi, endereco);
    }

    function darDireitoDeVoto(address endereco, string memory bi, uint id)
        public
        recenseadorOwner("Apenas o recenseador pode dar direito de voto.")
    {
        require(
            bilhetes[bi] == true &&
                eleitor[endereco].registo == true &&
                keccak256(abi.encodePacked(bi)) ==
                keccak256(abi.encodePacked(eleitor[endereco].bi)),
            "Eleitor nao registado"
        );

        require(eleitor[endereco].voto == false, "O eleitor ja efectuo o voto.");

        require(
            eleitor[endereco].direito == false,
            "O eleitor ja lhe foi dado o direito de voto"
        );

        listaEleitores[id].direito = true;
        eleitor[endereco].direito = true;

        emit DireitoVoto(eleitor[endereco].nome, eleitor[endereco].bi);
    }

    function votar(uint256 candidatoId, uint256 eleitorId) public {
        Eleitor memory _eleitor = eleitor[msg.sender];

        require(
            msg.sender != recenseador,
            "Endereco invalido para votar."
        );

        require(
            _eleitor.direito == true,
            "O eleitor nao tem direito de voto."
        );

        require(_eleitor.voto == false, "O eleitor ja efectuo o voto.");

        require(
            candidatoId > 0 && candidatoId <= numeroCandidatos,
            "Erro no ID e no numero de candidatos."
        );

        listaEleitores[eleitorId].voto = true;
        eleitor[_eleitor.endereco].voto = true;

        candidatos[candidatoId].numeroVoto++;

        emit Votado(candidatos[candidatoId].nome);
    }
}
