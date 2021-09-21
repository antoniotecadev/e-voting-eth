import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import TruffleContract from "@truffle/contract";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Obter o provedor de rede e a instância web3.
      const web3 = await getWeb3();

      // Usar web3 para obter as contas do usuário.
      const accounts = await web3.eth.getAccounts();

      // Obter a instância do contrato.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // const instance = TruffleContract(SimpleStorageContract);
      // instance.setProvider(web3);

      // Defina web3, contas e contrato para o estado e, em seguida, prossiga com um
      // exemplo de interação com os métodos do contrato.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Capture quaisquer erros de qualquer uma das operações acima.
      alert(
        `Falha ao carregar web3, contas ou contrato. Verifique o console para obter detalhes.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Armazena um determinado valor, 5 por padrão.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Obter o valor do contrato para provar que funcionou.
    const response = await contract.methods.get().call();

    // Atualize o estado com o resultado.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
