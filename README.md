# Integra Bolão 🏆

## Sobre o Projeto

O **Integra Bolão** é uma aplicação web full stack desenvolvida para gerenciamento de bolões esportivos da Copa do Mundo. A plataforma permite que usuários realizem palpites para partidas, acompanhem rankings em tempo real e visualizem resultados automaticamente atualizados.

O sistema foi projetado com foco em automação, escalabilidade e experiência do usuário, utilizando uma arquitetura desacoplada baseada em API REST.

---

## Arquitetura do Sistema

O projeto é dividido em dois ambientes independentes que se comunicam através de uma API REST:

### Back-end (API)

Desenvolvido com **Python**, **Django** e **Django REST Framework**, responsável por:

* Autenticação via JWT;
* Gerenciamento de usuários;
* Cadastro e controle de partidas;
* Registro de palpites;
* Cálculo automático de pontuações;
* Controle de permissões administrativas.

### Front-end (Web)

Desenvolvido com **React** e **Vite**, responsável por:

* Interface responsiva e dinâmica;
* Consumo da API REST;
* Atualizações periódicas em tempo real;
* Dashboard de classificação;
* Área administrativa para gerenciamento de partidas.

---

## Principais Funcionalidades

### Sistema Automático de Pontuação

Utilização de **Django Signals** para processar automaticamente os resultados dos usuários.

Quando uma partida é marcada como finalizada:

* Os palpites são avaliados automaticamente;
* Usuários que acertaram o resultado recebem pontuação;
* O ranking geral é atualizado sem intervenção manual.

### Dashboard em Tempo Real

A aplicação realiza consultas periódicas à API para manter informações atualizadas:

* Status das partidas;
* Resultados ao vivo;
* Ranking dos participantes;
* Pontuação dos usuários.

### Operações em Massa para Administração

Ferramentas administrativas permitem:

* Cadastro de múltiplas partidas via JSON;
* Atualização em lote de resultados;
* Redução significativa do tempo de configuração do torneio.

### Controle de Acesso

Implementação de autenticação baseada em JWT com separação entre:

* Usuários comuns;
* Administradores (`is_staff`).

Rotas e endpoints protegidos garantem acesso apenas aos recursos autorizados.

### Interface Dinâmica

Recursos implementados:

* Exibição de bandeiras dos países participantes;
* Botões interativos para palpites:

  * Vitória Mandante
  * Empate
  * Vitória Visitante
* Bloqueio automático de palpites após o início da partida.

---

## Estrutura do Projeto

```text
integra-bolao/
│
├── ApontaAi-API/
│   ├── core/
│   ├── jogos/
│   ├── palpites/
│   ├── usuarios/
│   ├── manage.py
│   └── requirements.txt
│
└── ApontaAi-Web/
    ├── src/
    │   ├── contexts/
    │   ├── pages/
    │   └── services/
    ├── package.json
    └── vite.config.js
```

---

## Tecnologias Utilizadas

### Back-end

* Python
* Django
* Django REST Framework
* Simple JWT
* SQLite / PostgreSQL
* Django Signals

### Front-end

* React
* Vite
* Axios
* React Router
* Context API

---

## Como Executar o Projeto

### 1. Executar o Back-end

```bash
cd ApontaAi-API

python -m venv venv

# Linux/macOS
source venv/bin/activate

# Windows
venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

### 2. Executar o Front-end

```bash
cd ApontaAi-Web

npm install

npm run dev
```

Certifique-se de configurar corretamente a URL da API no arquivo `.env` do frontend.

Exemplo:

```env
VITE_API_URL=http://127.0.0.1:8000/api/
```

---

## Diferenciais Técnicos

* Arquitetura desacoplada (Front-end + API REST);
* Autenticação JWT;
* Atualização automática de rankings;
* Processamento automatizado com Django Signals;
* Operações administrativas em lote;
* Interface responsiva e dinâmica;
* Atualizações periódicas sem necessidade de recarregar a página.

---

## Autor

**Victor Gabriel Barros Moreira**

Deployment Analyst • Full Stack Developer

* Python
* Django
* React
* REST APIs
* SQL
* DevOps & Deployment

Desenvolvido como projeto de demonstração de competências em desenvolvimento Full Stack, arquitetura web moderna e automação de regras de negócio.
