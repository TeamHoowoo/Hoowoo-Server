// @ts-check
const express = require('express');

const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.SQL_USER,
  password: process.env.SQL_PW,
  port: '3306',
  database: 'hoowoo',
});

connection.connect();

module.exports = router;
