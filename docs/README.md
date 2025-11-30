# Projeto – Portal de Gerenciamento de Recursos UCENS

## Integrantes do Grupo
- Matheus de Araújo Emídio – Email: mathujo566@gmail.com
- Ian Matheus Moura – Email: ianmatheusmoura@outlook.com
- Gabriel Sales Dorea – Email: salesdoreagabriel@gmail.com
- Jade Nogueira Silva – Email: jade.silva@fatec.sp.gov.br



# Visão Geral do Projeto

> O "Portal de Gerenciamento de Recursos UCENS" é uma plataforma digital desenvolvida para modernizar e centralizar a gestão administrativa da associação, substituindo processos manuais (papel) e sistemas legados ineficientes. O sistema visa facilitar o controle de recursos institucionais — como associados, eventos, turmas e finanças — e a comunicação externa. Seus principais usuários são os funcionários da secretaria (administradores) e a comunidade interessada (visitantes).

**Objetivo principal:**  
- Desenvolver um Sistema Web de gerenciamento de recursos institucionais para a UCENS, visando facilitar o processo de organização e gestão da entidade ao substituir métodos manuais ou pouco estruturados (como agendas de papel e planilhas dispersas) por uma plataforma centralizada e intuitiva.

**Tecnologias utilizadas:**
- Linguagens: **C#**: Utilizada no desenvolvimento do Backend; **TypeScript/JavaScript**: Utilizada no Frontend através do framework Angular.
- Frameworks: **Angular**: Framework utilizado para o desenvolvimento da interface (Frontend); **ASP.NET Core**: Framework utilizado para a construção da API REST (Backend); **Entity Framework Core**: ORM utilizado para mapeamento e acesso aos dados.
- Banco de dados: **PostgreSQL**: Banco de dados relacional utilizado para armazenamento das informações.
- Serviços em nuvem: **Vercel**: Plataforma de hospedagem para o Frontend; **Render**: Plataforma utilizada para hospedar a API (Backend) em contêiner Docker; **Neon**: Plataforma de banco de dados PostgreSQL em nuvem (Serverless); **ImageKit**: Serviço para armazenamento e otimização de imagens.
- Ferramentas de apoio (Postman, Docker, etc.): **Docker**: Utilizado para containerização da aplicação, garantindo consistência entre ambientes; **ViaCep**: API externa para consulta automática de endereços via CEP; **SMTP**: Protocolo utilizado para o serviço de envio de e-mails; **Swagger (Swashbuckle)**: Utilizado para documentação e testes da API, conforme configurado no arquivo Program.cs; **GitHub**: Plataforma utilizada para o repositório de código fonte e versionamento do projeto.


# Arquitetura da Solução

- **API / Backend**: Construída em ASP.NET Core seguindo a Clean Architecture (Domain, Application, Infrastructure, API).
- **Frontend**: Single Page Application (SPA) desenvolvida em Angular.
- **Banco de dados**: PostgreSQL (Neon) acessado via Entity Framework Core.
- **Módulos auxiliares**: Integração com ImageKit para uploads, Parser CNAB 400 (Sicredi) para boletos.


# Como Executar o Projeto

## 1. Pré-requisitos
- .NET SDK 8.0
- Node.js (v18+ recomendado para Angular)
- Docker (opcional)
- Banco de dados PostgreSQL configurado (local ou nuvem).

## 2. Instalação
```bash
# Clonar o repositório
git clone https://github.com/MatheusAraujo121/Projeto_UCENS.git
cd Projeto_UCENS
```

## 3. Configuração
Configure a string de conexão no appsettings.json. O projeto suporta SQLite para desenvolvimento local ou PostgreSQL para produção.
para utilizar SQLite:
```bash
"ConnectionStrings": {
  "DefaultConnection": "Data Source=Nippon.db"
}
```
para utilizar PostgreeSQL(Produção):
```bash
"ConnectionStrings": {
  "DefaultConnection": "Host=seu_host;Port=5432;Database=seu_db;Username=seu_user;Password=sua_senha;"
}
```
Alternativamente, crie um arquivo .env se estiver usando Docker Compose.

## 4. Executando
- Backend:
```bash
# 1. Navegue até a pasta do backend
cd backend-ucens

# 2. Restaure as dependências do .NET
dotnet restore Nippon.sln

# 3. Navegue até o projeto de API e execute
cd src/Api
dotnet run
```
O backend estará rodando em http://localhost:5000 (ou porta similar).
- Frontend:
```bash
# 1. Em outro terminal, navegue até a pasta do frontend
cd frontend-ucens

# 2. Instale as dependências (Use legacy-peer-deps para compatibilidade)
npm install --legacy-peer-deps

# 3. Execute o projeto
ng serve -o
```
O site abrirá automaticamente em http://localhost:4200.

## 🧪 Testes
* Frameworks utilizados: Jasmine/Karma (Frontend) e Swagger UI (Backend).
* Como rodar testes (Frontend):
```Bash
npm test
```
* Testes de API: Com o backend rodando, acesse a documentação Swagger em http://localhost:5000 (ou uma porta similar)/swagger.

# Deploy / Publicação

* **URL da aplicação (Frontend):** https://projeto-ucens.vercel.app
* **URL da API:** Hospedada no Render (configurada internamente na aplicação).
* **Credenciais de teste:**
* Email: testuser@gmail.com
* Senha: Projeto_Uc3n$
* **CI/CD:**
    * `backend-build.yml`: Acionado em pushes na branch `develop` (Backend).
    * `frontend-build.yml`: Acionado em pushes na branch `develop` (Frontend).

## Licença
* Projeto acadêmico sem licença específica.

## Contato do Grupo
* Caso tenha dúvidas, entre em contato através dos e-mails listados na seção de integrantes.
