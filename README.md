# 🦖 Pokédex Management Suite

Uma aplicação Full Stack robusta desenvolvida para gerenciar o ecossistema Pokémon, dividida em uma experiência tática para Treinadores (Clientes) e um controle total via Painel Administrativo (Modo Deus).

---

## 🚀 Funcionalidades Principais

### 🎮 Área do Treinador
* **Autenticação Completa:** Sistema de Login e Cadastro com validação de dados e persistência via Token JWT.
* **Registro de Capturas:** Permite registrar novos Pokémons capturados definindo apelidos customizados e nível inicial.
* **Evolução Dinâmica:** Sistema integrado que valida e evolui o Pokémon baseado em seu ID de evolução.
* **Gerenciador de Elite (Times):** Criação e estruturação de times táticos com a trava clássica de **limite máximo de 6 slots** por grupo.
* **Galeria de Insígnias:** Catálogo interativo onde o treinador pode visualizar e reivindicar insígnias oficiais para o seu perfil.

### ⚡ Modo Deus (Painel Administrativo)
* **Acesso Centralizado:** Conta mestra exclusiva configurada diretamente no fluxo de autenticação.
* **Controle de Treinadores:** Tela administrativa para listar, editar dados cadastrais, banir/excluir treinadores e criar novas contas de clientes.
* **Gestão de Espécies Globais:** Catálogo geral para cadastrar novos Pokémons na base de dados, além de editar ou excluir espécies existentes.
* **Gerenciador de Insígnias:** Painel para criar, editar e remover insígnias do catálogo oficial do sistema.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
* **React.js** com **TypeScript**
* **React Router Dom** (Gerenciamento de rotas protegidas e navegação fluida)
* **Axios** (Integração com a API do Backend)
* **Tailwind CSS** (Estilização moderna e interface em Dark Mode)

### Backend
* **Node.js** com **TypeScript**
* **Express** (Estruturação de rotas HTTP e Middlewares)
* **Prisma ORM** (Modelagem de dados e integração com o Banco)
* **JWT (JsonWebToken) & Bcrypt** (Segurança e criptografia de senhas)

---

## 📦 Como Executar o Projeto

### 1. Pré-requisitos
Certifique-se de ter o **Node.js** e um gerenciador de pacotes (npm, yarn ou pnpm) instalados em sua máquina.

### 2. Configurando o Backend
1. Navegue até a pasta do servidor:

    ```Bash
   cd backend
    
2. Instale as dependências:

    ```Bash
    npm install
    
Configure as suas variáveis de ambiente no arquivo .env (Database URL e JWT Secret).

Execute as migrations do Prisma para estruturar o banco de dados:

    ````Bash
    npx prisma migrate dev
Inicie o servidor de desenvolvimento:

    ````Bash
    npm run dev
    
3. Configurando o Frontend
Navegue até a pasta do cliente:

    ````Bash
   cd frontend
Instale as dependências:

    ````Bash
    npm install
Garanta que a URL da API no arquivo services/api.ts está apontando para a porta correta do seu backend.

Inicie o app:

    ````Bash
    npm run dev
    
🔒 Conta Administrador Padrão
Para acessar o painel administrativo, utilize as seguintes credenciais na tela de login:

E-mail: admin@pokedex.com
Senha: adminSuperSecreto123
