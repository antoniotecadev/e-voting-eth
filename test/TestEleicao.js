var Eleicao = artifacts.require("./Eleicao.sol");

contract("Eleicao", function(contas) {
  var instanciarEleicao;

  it("Inicializar com quatro candidatos", function() {
    return Eleicao.deployed().then(function(instancia) {
      return instancia.numeroCandidatos();
    }).then(function(numero) {
      assert.equal(numero, 4);
    });
  });

  it("Inicializar os canditatos com os seus valores correto", function() {
    return Eleicao.deployed().then(function(instancia) {
        instanciarEleicao = instancia;
      return instanciarEleicao.candidatos(1);
    }).then(function(candidato) {
      assert.equal(candidato[0], 1, "contains the correct id");
      assert.equal(candidato[1], "Antonio", "contains the correct name");
      assert.equal(candidato[2], 0, "contains the correct votes count");
      return instanciarEleicao.candidatos(2);
    }).then(function(candidato) {
      assert.equal(candidato[0], 2, "contains the correct id");
      assert.equal(candidato[1], "Jose", "contains the correct name");
      assert.equal(candidato[2], 0, "contains the correct votes count");
    });
  });
});