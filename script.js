document.addEventListener('DOMContentLoaded', function() {
  carregarProdutos();

  var form = document.getElementById('form-produto');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    cadastrarProduto();
  });
});

function carregarProdutos() {
  var listaProdutos = document.getElementById('lista-produtos');
  listaProdutos.innerHTML = '<p class="loading">Carregando produtos...</p>';

  fetch('/api/produtos')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.error) {
        listaProdutos.innerHTML = '<p class="erro">Erro: ' + data.error + '</p>';
        return;
      }

      if (data.length === 0) {
        listaProdutos.innerHTML = '<p class="vazio">Nenhum produto cadastrado ainda.</p>';
        return;
      }

      var html = '';
      for (var i = 0; i < data.length; i++) {
        var produto = data[i];
        html += criarCardProduto(produto);
      }
      listaProdutos.innerHTML = html;
    })
    .catch(function(error) {
      console.error('Erro ao carregar produtos:', error);
      listaProdutos.innerHTML = '<p class="erro">Erro ao carregar produtos. Verifique a conexao.</p>';
    });
}

function criarCardProduto(produto) {
  var categoriaClass = 'categoria-' + produto.categoria;
  var precoFormatado = 'R$ ' + parseFloat(produto.preco).toFixed(2).replace('.', ',');
  
  var card = '<div class="card-produto">';
  card += '<div class="card-header">';
  card += '<h3>' + escapeHtml(produto.nome) + '</h3>';
  card += '<span class="categoria ' + categoriaClass + '">' + escapeHtml(produto.categoria) + '</span>';
  card += '</div>';
  card += '<div class="card-body">';
  card += '<p class="preco">' + precoFormatado + '</p>';
  if (produto.detalhes) {
    card += '<p class="detalhes">' + escapeHtml(produto.detalhes) + '</p>';
  }
  card += '</div>';
  card += '</div>';
  
  return card;
}

function escapeHtml(text) {
  if (!text) return '';
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function cadastrarProduto() {
  var nome = document.getElementById('nome').value.trim();
  var preco = document.getElementById('preco').value;
  var categoria = document.getElementById('categoria').value;
  var descricao = document.getElementById('descricao').value.trim();

  if (nome.length < 5) {
    alert('O nome deve ter pelo menos 5 caracteres.');
    return;
  }

  if (parseFloat(preco) <= 0) {
    alert('O preco deve ser maior que zero.');
    return;
  }

  if (!categoria) {
    alert('Selecione uma categoria.');
    return;
  }

  var dados = {
    nome: nome,
    preco: preco,
    categoria: categoria,
    descricao: descricao
  };

  fetch('/api/produtos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.error) {
        alert('Erro: ' + data.error);
        return;
      }

      alert('Produto cadastrado com sucesso!');
      limparFormulario();
      carregarProdutos();
    })
    .catch(function(error) {
      console.error('Erro ao cadastrar produto:', error);
      alert('Erro ao cadastrar produto. Tente novamente.');
    });
}

function limparFormulario() {
  document.getElementById('nome').value = '';
  document.getElementById('preco').value = '';
  document.getElementById('categoria').value = '';
  document.getElementById('descricao').value = '';
}
