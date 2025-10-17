# 🗳️ E-Voting: Sistema de Votação Electrónica utilizando Blockchain

### 📚 Trabalho de Fim de Curso — Instituto Superior Politécnico Metropolitano de Angola (IMETRO)

Este repositório apresenta o **E-Voting**, um sistema de votação electrónica descentralizado que utiliza a **tecnologia Blockchain Ethereum** para garantir **segurança, transparência, anonimato e integridade** no processo eleitoral.

O projecto foi desenvolvido como **trabalho de fim de curso** para obtenção do grau de **Licenciatura em Engenharia Informática** no **Instituto Superior Politécnico Metropolitano de Angola (IMETRO)**, sob orientação do Prof. Dimonekene Ditutala.

---

## 📖 Descrição

O **E-Voting** tem como objectivo modernizar o processo de votação, eliminando falhas do método tradicional e reduzindo riscos de fraude, através do uso de **contratos inteligentes (Smart Contracts)** na blockchain **Ethereum**.

Com esta abordagem, cada voto é registado e validado numa rede descentralizada e imutável, assegurando que:

- Nenhum voto válido possa ser alterado ou eliminado  
- Nenhum voto inválido seja contado  
- O anonimato do eleitor seja preservado  
- O processo seja totalmente auditável e transparente  

---

## ⚙️ Funcionalidades Principais

- 🧾 Registo de eleitores e candidatos  
- ✅ Atribuição de direito de voto  
- 🗳️ Emissão de voto via endereço Ethereum  
- 🔍 Verificação do estado do eleitor (registado, votou, tem direito de voto)  
- 📊 Contagem automática e em tempo real dos votos  
- 🌐 Interface Web interativa e responsiva  

---

## 🧠 Tecnologias Utilizadas

| Categoria | Ferramenta / Tecnologia |
|------------|--------------------------|
| **Frontend** | React.js + Bootstrap |
| **Blockchain** | Ethereum |
| **Contratos Inteligentes** | Solidity |
| **Interação com Blockchain** | Web3.js |
| **Carteira Digital** | MetaMask |
| **Ambiente de Teste** | Ganache + Truffle |
| **Editor** | Visual Studio Code |
| **Runtime JavaScript** | Node.js + NPM |

---

## 🧩 Arquitectura do Sistema

O sistema é composto por três camadas principais:

1. **Interface Web (Frontend)** — Desenvolvida em React.js para permitir uma experiência de uso moderna e responsiva.  
2. **Smart Contracts (Backend)** — Implementados em Solidity para gerir o registo, votação e contagem de votos na blockchain.  
3. **Blockchain Ethereum** — Armazena todas as informações de forma descentralizada, garantindo imutabilidade e segurança.  

---

## 🧪 Requisitos Funcionais

- O recenseador pode registar eleitores e candidatos  
- Apenas eleitores registados e autorizados podem votar  
- Cada eleitor pode votar uma única vez  
- Os resultados são contabilizados automaticamente em tempo real  

---

## 🚀 Como Executar o Projecto

### 1️⃣ Pré-requisitos

- Node.js e NPM instalados  
- Ganache (para simulação da blockchain local)  
- MetaMask configurado no navegador  
- Truffle instalado globalmente  

### 2️⃣ Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/e-voting.git
cd e-voting
```

## 🔒 Segurança e Privacidade

A privacidade do voto é garantida através de assinaturas digitais e chaves públicas/privadas, impossibilitando a identificação do eleitor.
A transparência e integridade são asseguradas pela própria natureza descentralizada da blockchain Ethereum.

## 🧭 Trabalhos Futuros

Migração para a rede Ethereum Mainnet

Integração com o sistema IPFS para armazenamento distribuído de dados complementares

Suporte a autenticação biométrica e votação móvel

Implementação de dashboards administrativos e de auditoria

## 👨‍🎓 Autor

António José Buaio Teca

Licenciado em Engenharia Informática

**Instituto Superior Politécnico Metropolitano de Angola (IMETRO)**

📍 Luanda — Angola
