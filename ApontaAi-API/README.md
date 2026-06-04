# ApontaAi API

API Django para gestão de jogos e palpites.

## Preparação local

1. Crie um arquivo `.env` a partir de `.env.example`.
2. Configure as credenciais do banco e a `DJANGO_SECRET_KEY`.
3. Instale as dependências com `pip install -r requirements.txt`.
4. Execute as migrações com `python manage.py migrate`.
5. Suba a aplicação com `python manage.py runserver`.

## Observações

- O arquivo `.env` não deve ser enviado para o repositório.
- Arquivos de teste locais como `testes.http` e `tests.py` ficam ignorados por padrão.