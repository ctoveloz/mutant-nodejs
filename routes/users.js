const express = require('express');
const mysql = require('mysql');
const request = require('request');

const router = express.Router();

/* DB CONFIG */
var mysqlHost = process.env.MYSQL_HOST || 'localhost';
var mysqlUser = process.env.MYSQL_USER || 'cristiano';
var mysqlPass = process.env.MYSQL_PASS || 'rootpass';
var mysqlDB   = process.env.MYSQL_DB   || 'mutant';

const db = mysql.createPool({
  host: mysqlHost,
  user: mysqlUser,
  password: mysqlPass,
  database: mysqlDB
});

// index
router.get('/', (req, res) => {
  res.render('index', {box: ''});
});

//URL API
const urlApi = 'http://jsonplaceholder.typicode.com/users';

// Botão baixar
router.post('/botaoBaixar', function(req, res){
  console.log("Sucesso retorno botão baixar");

  request({
    url: urlApi,
    json: true
  }, (err, resp, data) => {
      console.log(data);     
      res.render('index', {box: JSON.stringify(data, null, 2)}); 
  });
});

// Botão Salvar
router.post('/botaoSalvar', function(req, res){
  console.log("Sucesso retorno botão salvar");

  request({
    url: urlApi,
    json: true
  }, (err, resp, data) => {

      // Filtro Suites
      const filtro = data.filter(function (item) {
        return item.address.suite.includes('Suite');
      });

      // Filtro Nome
      const filtroNome = filtro.sort((a, b) => a.name.localeCompare(b.name));

      console.log(filtroNome);

      
      for (var i = 0; i < filtroNome.length; i++) {

          let post = {nome: filtroNome[i].name, username: filtroNome[i].username};
          let sql = 'INSERT INTO users SET?';
          let query = db.query(sql, post, (err, result) => {
              if (err) throw err;
              console.log(result);
          });
      };
      res.send('Usuarios em ordem alfabetica salvo do DB!')

  });


});



module.exports = router;