const express = require('express');
const mysql = require('mysql');
const axios = require('axios');

const router = express.Router();

/* DB CONFIG */
var mysqlHost = process.env.MYSQL_HOST || 'localhost';
var mysqlUser = process.env.MYSQL_USER || 'cristianouser';
var mysqlPass = process.env.MYSQL_PASS || 'cristianopass';
var mysqlDB   = process.env.MYSQL_DB   || 'mutant';

const db = mysql.createPool({
  host: mysqlHost,
  user: mysqlUser,
  password: mysqlPass,
  database: mysqlDB
});

db.getConnection(function(err) {
  if (err) {
    return console.error('erro: ' + err.message);
  }

  console.log('Banco Conectado!')
});

// index
router.get('/', (req, res) => {
  res.render('index', {box: ''});
});

//URL API
const urlApi = 'http://jsonplaceholder.typicode.com/users';

// GLOBAL DATA
const globalData = [];

// Botão baixar
router.post('/botaoBaixar', function(req, res){
  console.log("Sucesso retorno botão baixar");

  /* AXIOS CONFIG */
  const request = axios({
    url: urlApi, 
    method: 'get', 
    responseType: 'json'
  })
  .then(function (response) {
    const data = response.data;
    console.log(data);
    res.render('index', {box: JSON.stringify(data, null, 2)}); 
    globalData.push(data);
    return data
  }).catch(function (error) {
    console.log(error);
  });

});

// Botão Salvar
router.post('/botaoSalvar', function(req, res){
  console.log("Sucesso retorno botão salvar");

      // Filtro Suites
      const filtro = globalData[0].filter(function (item) {
        return item.address.suite.includes('Suite');
      });

      // Filtro Nome
      const filtroNome = filtro.sort((a, b) => a.name.localeCompare(b.name));

      console.log(filtroNome);

      // Cria tabela Users
      const createUsers = `create table if not exists users(id int AUTO_INCREMENT,
         name VARCHAR(255),
         username VARCHAR(255),
         email VARCHAR(255),
         street VARCHAR(255),
         suite VARCHAR(255),
         city VARCHAR(255),
         zipcode VARCHAR(255),
         phone VARCHAR(255),
         site VARCHAR(255),
         PRIMARY KEY (id))`;
      db.query(createUsers, function(err, results, fields) {
        if (err) {
          console.log(err.message);
        }
        
        console.log('Tabela users criada');

      });
      
      // Insere
      for (var i = 0; i < filtroNome.length; i++) {

          let post = {name: filtroNome[i].name, 
                      username: filtroNome[i].username, 
                      email: filtroNome[i].email, 
                      street: filtroNome[i].address.street, 
                      suite: filtroNome[i].address.suite, 
                      city: filtroNome[i].address.city, 
                      zipcode: filtroNome[i].address.zipcode, 
                      phone: filtroNome[i].phone, 
                      site: filtroNome[i].website};
          let sql = 'INSERT INTO users SET?';
          let query = db.query(sql, post, (err, res) => {
              if (err) {
                throw err; 
              }
              else {
                  console.log(res);
              }
          });
      };

});

module.exports = router;