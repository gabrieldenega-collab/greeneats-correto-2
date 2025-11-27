const API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE_NAME = 'Produtos';

if (!API_KEY || !BASE_ID) {
  console.error('ERRO: Configure os Secrets AIRTABLE_API_KEY e AIRTABLE_BASE_ID no Replit!');
}

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/produtos', async function(req, res) {
  try {
    if (!API_KEY || !BASE_ID) {
      return res.status(500).json({ error: 'Airtable nao configurado. Configure os Secrets.' });
    }

    const url = 'https://api.airtable.com/v0/' + BASE_ID + '/' + encodeURIComponent(TABLE_NAME);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.error || 'Erro ao buscar produtos' });
    }

    const data = await response.json();
    
    const produtos = data.records.map(function(record) {
      return {
        id: record.id,
        nome: record.fields.nome || '',
        preco: record.fields.preco || 0,
        categoria: record.fields.categoria || '',
        detalhes: record.fields['detalhes do produto'] || ''
      };
    });

    res.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/produtos', async function(req, res) {
  try {
    if (!API_KEY || !BASE_ID) {
      return res.status(500).json({ error: 'Airtable nao configurado. Configure os Secrets.' });
    }

    const { nome, preco, categoria, descricao } = req.body;

    if (!nome || nome.length < 5) {
      return res.status(400).json({ error: 'O nome deve ter pelo menos 5 caracteres.' });
    }

    const precoNumero = parseFloat(preco);
    if (isNaN(precoNumero) || precoNumero <= 0) {
      return res.status(400).json({ error: 'O preco deve ser maior que zero.' });
    }

    const categoriasValidas = ['fruta', 'legumes', 'verdura'];
    if (!categoria || !categoriasValidas.includes(categoria.toLowerCase())) {
      return res.status(400).json({ error: 'A categoria deve ser: fruta, legumes ou verdura.' });
    }

    const url = 'https://api.airtable.com/v0/' + BASE_ID + '/' + encodeURIComponent(TABLE_NAME);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              nome: nome,
              preco: precoNumero,
              categoria: categoria.toLowerCase(),
              'detalhes do produto': descricao || ''
            }
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.error || 'Erro ao salvar produto' });
    }

    const data = await response.json();
    res.status(201).json({ success: true, record: data.records[0] });
  } catch (error) {
    console.error('Erro ao salvar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', function() {
  console.log('Servidor GreenEats rodando na porta ' + PORT);
  if (!API_KEY || !BASE_ID) {
    console.log('AVISO: Configure AIRTABLE_API_KEY e AIRTABLE_BASE_ID nos Secrets para conectar ao Airtable.');
  }
});
