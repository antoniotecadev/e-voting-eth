import Web3 from "web3";

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Aguarde a conclusão do carregamento para evitar condições de corrida com o tempo de injeção de web3.
    window.addEventListener("load", async () => {
    /*Verificar se estamos usando navegadores dapp
      modernos ou as versões mais recentes do MetaMask, 
      onde um ethereum provedor é injectado no window objeto*/
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Solicitar acesso as contas, se necessário
          await window.ethereum.enable();
          // Contas agora expostas
          resolve(web3);
        } catch (error) {
          reject(error);
          console.error("Acesso negado ao usuário à conta");
        }
      }
      // Legacy dapp browsers...
      // verificar se há uma web3 instância injectada
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        resolve(web3);
        console.log("Web3 injetado detectado.");
      }
      // Fallback para localhost; usar a porta do console dev por padrão ...
      else {
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:7545"
        );
        const web3 = new Web3(provider);
        console.log("Nenhuma instância web3 injetada, usando Web3 local.");
        resolve(web3);
      }
    });
  });

export default getWeb3;
