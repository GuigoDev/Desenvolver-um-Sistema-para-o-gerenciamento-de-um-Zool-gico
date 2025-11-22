# Desenvolver um Sistema para o Gerenciamento de um Zoológico

Este repositório contém um sistema completo para o gerenciamento de animais e seus respectivos cuidados (prontuários) em um zoológico. O projeto é dividido em um backend Web API desenvolvido em **ASP.NET Core** e um frontend interativo construído com **React** e **Vite**.

O objetivo principal é demonstrar habilidades em desenvolvimento Full-Stack, incluindo a modelagem de dados, a criação de endpoints de API e a construção de uma interface de usuário responsiva.

---

### 🌟 Funcionalidades Principais

O sistema permite realizar as seguintes operações:

* **Cadastro Completo de Animais (CRUD):** Registro de novos animais, visualização de detalhes, edição e exclusão de animais. Os dados incluem Nome, Espécie, Habitat, País de Origem e Data de Nascimento.
* **Listagem e Filtros:** Visualização de todos os animais cadastrados com opções de filtro por Nome, País de Origem, Espécie e Data de Nascimento.
* **Prontuário/Gestão de Cuidados:** Para cada animal, é possível registrar e gerenciar seu histórico de cuidados (prontuário), incluindo nome/tipo do cuidado, descrição, frequência e status (Em espera, Em andamento, Finalizado).
* **Interface Amigável:** A aplicação possui um design moderno com opção de alternância de tema (Dark/Light Mode).

---

### 💻 Tecnologias Utilizadas

| Componente | Tecnologia | Detalhes |
| :--- | :--- | :--- |
| **Backend (API)** | **ASP.NET Core** (net9.0) | Criação de Web API RESTful para manipulação dos dados. |
| | **Entity Framework Core** | ORM para comunicação com o banco de dados. |
| | **MySQL/Pomelo** | Banco de dados relacional e provedor MySQL para EF Core. |
| **Frontend** | **React** | Biblioteca JavaScript para a construção da interface do usuário. |
| | **Vite** | Ferramenta de build e servidor de desenvolvimento rápido. |
| | **Axios** | Cliente HTTP para requisições à API. |

---

### ⚙️ Pré-requisitos

Para executar este projeto, você precisará ter instalado:

* [.NET SDK](https://dotnet.microsoft.com/download) (Versão `9.0` ou superior)
* [Node.js](https://nodejs.org/) (Versão LTS ou mais recente)
* Um servidor **MySQL** local ou acessível.

### 🚀 Configuração e Execução

Siga os passos abaixo para configurar e iniciar o projeto:

#### 1. Configurar o Banco de Dados (Backend)

1.  **Crie o Banco de Dados:** Certifique-se de que um banco de dados MySQL chamado `ZooDb` exista em seu servidor.
2.  **Verifique a Conexão:** A string de conexão padrão está configurada em `GerenciamentoZoo.Api/appsettings.json`:
    ```json
    "ConnectionStrings": {
      "DefaultConnection": "Server=localhost;Port=3306;Database=ZooDb;Uid=root;Pwd=;"
    }
    ```
    *Altere as credenciais (`Uid=root;Pwd=;`) se necessário.*
3.  **Aplique as Migrações:** Navegue até o diretório `GerenciamentoZoo.Api` e execute os comandos do Entity Framework Core para criar o schema do banco de dados:

    ```bash
    # No diretório GerenciamentoZoo.Api
    dotnet ef database update
    ```

#### 2. Iniciar o Backend (API)

1.  Navegue até o diretório `GerenciamentoZoo.Api`:
    ```bash
    cd GerenciamentoZoo.Api
    ```
2.  Inicie a aplicação. Por padrão, a API será executada na porta `5226`:
    ```bash
    dotnet run
    ```
    A URL base será: `http://localhost:5226`.

#### 3. Iniciar o Frontend (React)

1.  Navegue até o diretório `gerenciamento-zoo-frontend`:
    ```bash
    cd ../gerenciamento-zoo-frontend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento. Ele usará o proxy configurado em `vite.config.js` para redirecionar requisições `/api` para o backend em `http://localhost:5226`:
    ```bash
    npm run dev
    ```
4.  O aplicativo será aberto no seu navegador.

---

### 🌐 Endpoints da API (Referência Rápida)

A API RESTful expõe os seguintes endpoints:

| Recurso | Método | Rota | Descrição |
| :--- | :--- | :--- | :--- |
| **Animais** | `GET` | `/api/Animais` | Lista todos os animais. |
| | `GET` | `/api/Animais/{id}` | Obtém detalhes de um animal específico. |
| | `POST` | `/api/Animais` | Cadastra um ou mais novos animais. |
| | `PUT` | `/api/Animais/{id}` | Atualiza um animal existente. |
| | `DELETE` | `/api/Animais/{id}` | Remove um animal. |
| **Cuidados** | `GET` | `/api/Cuidados` | Lista todos os registros de cuidados (prontuários). |
| | `GET` | `/api/Cuidados/{id}` | Obtém um registro de cuidado específico. |
| | `POST` | `/api/Cuidados` | Cadastra um novo cuidado para um animal. |
| | `PUT` | `/api/Cuidados/{id}` | Atualiza um registro de cuidado. |
| | `DELETE` | `/api/Cuidados/{id}` | Remove um registro de cuidado. |

Você pode testar a API diretamente usando o arquivo `GerenciamentoZoo.Api/TestarBackend.http`.
