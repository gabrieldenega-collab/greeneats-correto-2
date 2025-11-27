# GreenEats

## Visao Geral
GreenEats e uma aplicacao web para gerenciamento de produtos organicos (frutas, legumes e verduras) com integracao ao Airtable.

## Arquitetura do Projeto

### Stack Tecnologico
- **Backend**: Node.js com Express.js
- **Frontend**: HTML5, CSS3, JavaScript Vanilla (puro)
- **Banco de Dados**: Airtable (API externa)

### Estrutura de Arquivos
```
/
├── server.js          # Servidor Express com rotas API
├── package.json       # Dependencias do projeto
├── public/
│   ├── index.html     # Pagina principal
│   ├── script.js      # Logica do frontend
│   └── style.css      # Estilos da aplicacao
└── replit.md          # Este arquivo
```

### Rotas da API
- `GET /api/produtos` - Lista todos os produtos do Airtable
- `POST /api/produtos` - Cadastra um novo produto

### Validacoes (POST)
- Nome: minimo 5 caracteres
- Preco: deve ser maior que zero
- Categoria: deve ser 'fruta', 'legumes' ou 'verdura'

## Configuracao

### Secrets Necessarios
Configure os seguintes Secrets no Replit:
- `AIRTABLE_API_KEY` - Sua chave de API do Airtable
- `AIRTABLE_BASE_ID` - ID da sua base no Airtable

### Estrutura da Tabela no Airtable
Nome da tabela: `Produtos`
Campos:
- `nome` (Single line text)
- `preco` (Number)
- `categoria` (Single select: fruta, legumes, verdura)
- `detalhes do produto` (Long text)

## Como Executar
O servidor roda automaticamente na porta 5000.

## Alteracoes Recentes
- 27/11/2025: Projeto criado com estrutura completa
