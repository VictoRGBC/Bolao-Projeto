# Integra Bolão - Frontend

Aplicação frontend do **Integra Bolão**, uma plataforma moderna e responsiva para gerenciamento de palpites de partidas de futebol. Desenvolvida em React, a aplicação oferece uma experiência intuitiva para usuários realizarem seus palpites, acompanharem rankings em tempo real e interagirem com os resultados das partidas, integrando-se perfeitamente a uma API desenvolvida com Django REST Framework.

---

# 📖 Visão Geral

O Integra Bolão permite que usuários participem de um bolão esportivo realizando previsões para partidas antes do início dos jogos e acompanhando sua pontuação através de um ranking global.

A aplicação também conta com um painel administrativo dedicado para gerenciamento de partidas, importação em lote de dados e atualização de resultados.

---

# 🚀 Tecnologias Utilizadas

## Frontend

* React
* React Router DOM
* Context API
* Axios

## Ferramentas de Build

* Vite (recomendado)
* Create React App (compatível)

## Integração Backend

* Django REST Framework
* Autenticação JWT

---

# ✨ Funcionalidades

## 👤 Funcionalidades para Usuários

### Autenticação

* Cadastro de usuários
* Login seguro utilizando JWT
* Persistência de sessão
* Gerenciamento automático de tokens

### Dashboard de Jogos

* Visualização de partidas agendadas, em andamento e finalizadas
* Exibição das bandeiras dos países participantes
* Interface responsiva para desktop e dispositivos móveis

### Sistema de Palpites

* Registro de palpites para cada partida:

  * Vitória do Mandante
  * Empate
  * Vitória do Visitante
* Alteração de palpites até o início da partida
* Feedback visual após processamento dos resultados

### Atualizações em Tempo Real

* Atualização automática a cada 10 segundos
* Atualização do status das partidas
* Atualização automática do ranking
* Não é necessário recarregar a página

### Ranking Global

* Classificação geral dos participantes
* Ordenação por pontuação total
* Atualização dinâmica conforme os resultados são processados

### Feedback de Pontuação

* Acerto do palpite: **+10 pontos**
* Indicação visual de acertos e erros

---

## 🛡️ Funcionalidades Administrativas

### Controle de Acesso

* Acesso restrito para usuários com permissão de administrador (`is_staff`)
* Rotas protegidas
* Verificação automática de permissões

### Gerenciamento de Partidas

* Cadastro manual de partidas
* Edição de partidas existentes
* Exclusão de partidas
* Atualização de resultados

### Importação Inteligente em Lote

* Importação de partidas via JSON
* Criação automática de novos registros
* Atualização automática de partidas já existentes
* Sincronização de status e resultados

### Formatação Automática de Dados

* Máscara para datas (`DD/MM/AAAA`)
* Máscara para horários (`HH:MM`)
* Conversão automática para formatos compatíveis com o backend

---

# 🏗️ Arquitetura da Aplicação

## Gerenciamento de Autenticação

A autenticação é centralizada através da Context API.

Principais responsabilidades:

* Armazenamento do token JWT
* Controle de login e logout
* Persistência da sessão do usuário
* Verificação de permissões
* Controle de rotas protegidas

---

## Comunicação com a API

Toda comunicação com o backend é realizada através de uma instância centralizada do Axios.

Recursos:

* URL base configurável
* Inclusão automática do token de autenticação
* Padronização de requisições
* Tratamento de erros
* Reutilização de configurações

---

# 🛠️ Instalação

## 1. Clonar o Repositório

```bash
git clone <url_do_repositorio>
cd ApontaAi-Web
```

## 2. Instalar Dependências

Utilizando npm:

```bash
npm install
```

Ou utilizando yarn:

```bash
yarn install
```

---

## 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto.

### Para projetos utilizando Vite

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

### Para projetos utilizando Create React App

```env
REACT_APP_API_URL=http://127.0.0.1:8000/api
```

Altere a URL conforme o ambiente utilizado.

---

## 4. Executar a Aplicação

### Utilizando Vite

```bash
npm run dev
```

### Utilizando Create React App

```bash
npm start
```

---

# 📂 Estrutura do Projeto

```text
src/
│
├── contexts/
│   └── AuthContext.jsx
│
├── services/
│   └── api.js
│
├── pages/
│   ├── Dashboard.jsx
│   ├── AdminJogos.jsx
│   ├── Login.jsx
│   └── Register.jsx
│
├── components/
│   └── ...
│
└── App.jsx
```

## Detalhamento dos Diretórios

### `src/contexts`

Responsável pelo gerenciamento de estado global.

**AuthContext.jsx**

* Controle de autenticação
* Gerenciamento do JWT
* Controle da sessão do usuário
* Validação de permissões

### `src/services`

**api.js**

* Configuração do Axios
* URL base da API
* Cabeçalhos de autorização
* Centralização das requisições

### `src/pages`

**Dashboard.jsx**

* Exibição dos jogos
* Registro de palpites
* Exibição do ranking
* Atualizações automáticas

**AdminJogos.jsx**

* CRUD de partidas
* Importação em lote
* Gerenciamento de resultados

**Login.jsx**

* Autenticação de usuários

**Register.jsx**

* Cadastro de usuários

---

# 🔄 Estratégia de Atualização em Tempo Real

O dashboard realiza consultas automáticas à API a cada **10 segundos** para:

* Atualizar informações das partidas
* Atualizar o ranking geral
* Refletir alterações de status
* Exibir resultados processados

Essa abordagem garante que os usuários visualizem informações atualizadas sem a necessidade de recarregar a página.

---

# 🔐 Segurança

* Autenticação baseada em JWT
* Rotas protegidas para administradores
* Controle de acesso por perfil de usuário
* Comunicação segura com a API
* Inclusão automática de tokens nas requisições autenticadas

---

# 🚀 Melhorias Futuras

* Integração com WebSockets para atualizações em tempo real
* Sistema de notificações
* Perfil de usuário
* Histórico de desempenho
* Suporte a múltiplos torneios
* Tema escuro (Dark Mode)

---

# 👨‍💻 Autor

**Victor Gabriel Barros Moreira**

Analista de Implantação & Desenvolvedor Full Stack

Especialidades:

* Desenvolvimento Full Stack
* Integrações de Sistemas
* Deploy e Infraestrutura
* Arquitetura de Aplicações Web

---

# 📄 Licença

Este projeto pode ser utilizado conforme os termos definidos na licença do repositório.
