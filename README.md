# 🎒 PokéDex Project (Monorepo)

Este é um projeto Full Stack de uma PokéDex, composto por um front-end moderno em React (Vite) e uma API robusta de back-end em Node.js. O projeto foi projetado com controle de acesso para Treinadores e Administradores.

---

## 🚀 Arquitetura do Projeto

O repositório está organizado como um monorepo:

* **`pokedex-web/`**: Aplicação client-side desenvolvida com React, Vite, Tailwind CSS, React Router e implantada na **Vercel**.
* **`pokedex-api/`**: Servidor/API REST desenvolvido em Node.js, Express, integrado a banco de dados e implantado no **Render**.

---

## 🎯 Casos de Uso (Use Cases)

O sistema possui fluxos de trabalho distintos para três perfis de usuários: **Visitantes**, **Treinadores** e **Administradores**.

### 1. Visitantes (Não Autenticados)
* **UC01 - Cadastrar Treinador:** Um visitante pode criar uma nova conta de Treinador fornecendo e-mail, senha e nome.
* **UC02 - Realizar Login:** O usuário pode se autenticar para acessar o painel correspondente ao seu nível de permissão (Treinador ou Administrador).

### 2. Treinador (Autenticado)
* **UC03 - Visualizar Pokédex:** Listar todos os Pokémons disponíveis no sistema com seus respectivos tipos e atributos.
* **UC04 - Capturar Pokémon:** Adicionar um Pokémon à sua lista de capturados.
* **UC05 - Meu Perfil:** Visualizar dados pessoais e a lista de Pokémons que ele capturou.
* **UC06 - Liberar Pokémon:** Remover um Pokémon anteriormente capturado da sua lista pessoal.

### 3. Administrador (Autenticado)
* **UC07 - Painel Administrativo:** Acessar métricas gerais (total de treinadores, total de Pokémons cadastrados).
* **UC08 - Gerenciar Pokémons (CRUD):** Criar novos Pokémons, editar atributos de Pokémons existentes ou deletar Pokémons do sistema.
* **UC09 - Gerenciar Treinadores:** Visualizar todos os treinadores cadastrados e gerenciar suas permissões ou contas.

---

## 📊 Diagrama de Classes

Abaixo está o modelo conceitual das classes e relacionamentos principais que governam o domínio da aplicação:

```mermaid
classDiagram
    direction TB

    class Usuario {
        <<Abstract>>
        +String id
        +String nome
        +String email
        +String senha
        +String tipoPerfil
        +autenticar(email, senha) Boolean
    }

    class Treinador {
        +List~Pokemon~ pokemonsCapturados
        +capturarPokemon(pokemon: Pokemon) Void
        +liberarPokemon(pokemonId: String) Void
        +listarCapturados() List~Pokemon~
    }

    class Admin {
        +cadastrarNovoPokemon(pokemon: Pokemon) Void
        +atualizarPokemon(id: String, dados: Object) Void
        +removerPokemon(id: String) Void
        +removerTreinador(id: String) Void
    }

    class Pokemon {
        +String id
        +String nome
        +String tipoPrincipal
        +String tipoSecundario
        +Int HP
        +Int ataque
        +Int defesa
        +String urlImagem
    }

    class SessaoUsuario {
        +String tokenJWT
        +Date expiraEm
        +Usuario usuarioAtivo
        +validarSessao() Boolean
    }

    %% Relacionamentos
    Usuario <|-- Treinador : Especializa
    Usuario <|-- Admin : Especializa
    Treinador "1" --> "*" Pokemon : possui/capturou
    SessaoUsuario "1" --> "1" Usuario : autentica

🛠️ Tecnologias Utilizadas
Front-end: React, TypeScript, Vite, Tailwind CSS, Axios, React Router Dom.

Back-end: Node.js, Express, CORS, JWT (JSON Web Tokens), BCrypt (criptografia de senhas).

Hospedagem: Vercel (Front-end), Render (Back-end).

🔧 Configuração e Instalação Local
Requisitos Prévios
Node.js (versão 18 ou superior)

NPM ou Yarn

Configurando o Back-end (pokedex-api)
Entre na pasta:

Bash
cd pokedex-api
Instale as dependências:

Bash
npm install
Crie um arquivo .env baseado no .env.example e preencha suas chaves.

Inicie o servidor em modo de desenvolvimento:

Bash
npm run dev
Configurando o Front-end (pokedex-web)
Abra um novo terminal e entre na pasta:

Bash
cd pokedex-web
Instale as dependências:

Bash
npm install
Crie o seu arquivo .env local:

Snippet de código
VITE_API_URL=http://localhost:3000
Inicie o projeto:

Bash
npm run dev
