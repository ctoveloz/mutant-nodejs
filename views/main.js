// Botão Baixar
document.getElementById('baixarButton').addEventListener('click', function(e) {
  console.log('Botão Baixar Clicado!');

  fetch('/botaoBaixar', {method: 'POST'})
    .then(res => res.text())
    .then(data => document.write(data))
});

// Botão Salvar
document.getElementById('salvarButton').addEventListener('click', function(e) {
console.log('Botão Salvar Clicado!');

fetch('/botaoSalvar', {method: 'POST'})
  .then(res => res.text())
  .then(data => document.write(data))
});