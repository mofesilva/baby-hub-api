# Baby Hub API

API em Node.js + Express responsável por gerenciar o catálogo de presentes, pledges e registros de doações para o chá de bebê virtual.

## Tecnologias
- Node.js 20+
- Express 5
- MongoDB (via Mongoose 8)
- express-validator, cors, dotenv

## Pré-requisitos
- Node.js / npm instalados
- Instância MongoDB (Atlas ou local)

## Configuração
1. Clone o repositório e acesse a pasta `apps/api`.
2. Copie `.env.example` para `.env` e configure:
   ```env
   PORT=4000
   MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/cha-de-fraldas
   MONGODB_DB_NAME=cha-de-fraldas
   PIX_KEY=00000000-0000-0000-0000-000000000000
   PIX_RECIPIENT_NAME=Nome dos Pais
   PIX_DESCRIPTION=Doação Chá de Bebê
   JWT_SECRET=troque-por-um-segredo-forte
   JWT_EXPIRES_IN=1h
   ADMIN_NAME=Administração
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=troque-essa-senha
   STORAGE_DRIVER=s3
   S3_BUCKET=nome-do-bucket
   S3_REGION=us-east-1
   S3_ACCESS_KEY_ID=chave
   S3_SECRET_ACCESS_KEY=segredo
   S3_PUBLIC_BASE_URL=https://nome-do-bucket.s3.amazonaws.com
   ```
3. Instale as dependências:
   ```pwsh
   npm install
   ```

## Scripts úteis
| Comando        | Descrição                              |
| -------------- | -------------------------------------- |
| `npm run dev`  | Inicia servidor com Nodemon            |
| `npm start`    | Inicia servidor em modo produção       |

## Rotas principais
| Método | Rota            | Descrição |
| ------ | --------------- | --------- |
| GET    | `/api/products` | Lista produtos ativos (seed automático a partir de `src/data/products.json`)
| POST   | `/api/pledges`  | Cria um pledge (donor + itens) e devolve instruções Pix
| POST   | `/api/donations`| Registra metadados de uma doação Pix vinculada a um pledge
| GET    | `/api/babies`    | Lista perfis de bebês públicos (para o app)
| GET    | `/api/babies/:slug` | Retorna detalhes + timeline pública de um bebê
| POST   | `/api/admin/uploads`| (Admin) Recebe multipart `file` e envia para o storage configurado

> Todas as respostas seguem o formato `{ data: ... }` e erros usam `{ errors: [...] }` conforme `express-validator`.

## Estrutura de pastas
```
src/
├── app.js            # Middlewares base e montagem das rotas
├── server.js         # Bootstrap (conexão Mongo + seed + listen)
├── config/env.js     # Carrega variáveis de ambiente
├── db/mongoose.js    # Helper de conexão com MongoDB
├── models/           # Schemas de Product, Pledge, Donation
├── repositories/     # Camada de acesso a dados (Mongo)
├── routes/           # Rotas Express (products, pledges, donations)
├── utils/pix.js      # Centraliza instruções Pix
└── data/products.json# Seed inicial do catálogo
```

## Fluxo resumido
1. Cliente requisita `GET /api/products` para exibir o catálogo.
2. Ao enviar `POST /api/pledges`, gravamos o pledge com snapshot dos valores e retornamos os dados Pix.
3. Opcionalmente, `POST /api/donations` registra comprovantes/metadados do Pix.

## Próximos passos
- Adicionar autenticação e painel administrativo.
- Disponibilizar rota de atualização de status do pledge.
- Criar testes automatizados com `vitest` + `supertest` + `mongodb-memory-server`.

Para detalhes completos da arquitetura e integração com o frontend, consulte `../docs/development-guide.md` no monorepo original.
