<p align="center">
<img src="docs/logo-nippon.png" alt="Logo Nippon" width="200"/>
</p>

<h1 align="center">
Projeto Integrador UCENS - Nippon Sorocaba
</h1>

<p align="center">
Um sistema de gerenciamento completo para a associação Nippon de Sorocaba, desenvolvido como Projeto Integrador para a UCENS.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular">
  <img src="https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt=".NET">
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions">
  <img src="https://img.shields.io/badge/Status-Em_Desenvolvimento-blue?style=for-the-badge" alt="Status">
</p>

---

## 🚀 Como o Sistema Funciona

Este projeto é um sistema de gerenciamento (ERP) focado nas necessidades da **UCENS (União Cultural e Esportiva Nipo-Brasileira de Sorocaba)**. Ele é dividido em duas partes principais:

* **Frontend (`frontend-ucens`):** Um portal web interativo construído em Angular. É por aqui que os associados, visitantes e administradores interagem com o sistema.
* **Backend (`backend-ucens`):** Uma API RESTful robusta construída em .NET 8. Ela cuida de toda a lógica de negócios, segurança e comunicação com o banco de dados.

### ✨ Funcionalidades Principais

* **Gerenciamento de Associados:** Cadastro, edição, visualização e gerenciamento de associados e seus dependentes.
* **Gestão Financeira:** Controle de despesas, geração de boletos (com integração) e relatórios financeiros.
* **Administração de Atividades:** Cadastro de turmas, atividades culturais (ex: Taiko, Nihongo Gakko) e esportivas (ex: Judô, Beisebol).
* **Gestão de Eventos:** Criação e divulgação de eventos da associação (ex: Undokai, Festivais).
* **Controle de Acesso:** Sistema de login e permissões de usuário (Admin vs. Usuário Comum).
* **Portal Institucional:** Páginas de contato, história, diretoria e estatuto.

---

## Nomes dos integrantes:
- Matheus de Araujo Emidio
- Gabriel Sales dorea
- Ian Matheus Moura
- Jade Nogueira Silva

---

## 🔧 Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias:

| Categoria | Tecnologia |
| :--- | :--- |
| **Frontend** | Angular, TypeScript, SCSS |
| **Backend** | .NET 8, C#, API RESTful |
| **Banco de Dados** | Entity Framework Core, SQLite (para desenvolvimento) |
| **DevOps** | GitHub Actions (CI/CD), Docker |
| **Serviços Externos** | ImageKit (para upload de imagens) |

---

## 💻 Como Rodar Localmente

Para rodar este projeto em sua máquina local, siga os passos abaixo.

### Pré-requisitos
* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/en/) (v20.x recomendado)
* [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)

### 1. Clonar o Repositório

```bash
git clone https://github.com/MatheusAraujo121/Projeto_UCENS.git
cd Projeto_UCENS
```
### 2. Rodar o Backend (.NET)
Abra um novo terminal.

```Bash
# 1. Navegue até a pasta do backend
cd backend-ucens

# 2. Restaure as dependências do .NET
dotnet restore Nippon.sln

# 3. Navegue até o projeto de API
cd src/Api

# 4. Rode o projeto
dotnet run
```
✨ O backend estará rodando em http://localhost:5000 (ou uma porta similar).

### 3. Rodar o Frontend (Angular)
Abra outro terminal.

```Bash
# 1. Navegue até a pasta do frontend
cd frontend-ucens

# 2. Instale as dependências do Node.js
# (Usamos --legacy-peer-deps por conta de dependências do Angular)
npm install --legacy-peer-deps

# 3. Sirva o projeto
ng serve -o
```
✨ O Angular irá compilar e abrirá automaticamente o site no seu navegador em http://localhost:4200.

## 🔄 DevOps: Integração Contínua (CI)
Este projeto utiliza GitHub Actions para automatizar o processo de build.

Existem dois pipelines configurados em .github/workflows/:

* backend-build.yml: É acionado em todo push para a branch develop que afete a pasta backend-ucens/. Ele restaura e compila o projeto .NET.

* frontend-build.yml: É acionado em todo push para a develop que afete a pasta frontend-ucens/. Ele instala as dependências (npm install) e compila o projeto Angular (npm run build).

Isso garante que o código na branch develop esteja sempre funcional.

# 👨‍💻 Equipe de Desenvolvimento
* Matheus de Araujo Emidio

* Gabriel Sales dorea

* Ian Matheus Moura

* Jade Nogueira Silva
