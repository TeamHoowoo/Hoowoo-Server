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
  multipleStatements: true,
});

connection.connect();

// 장바구니 목록
router.get('/:user_id/list', (req, res) => {
  connection.query(
    `SELECT * FROM cart WHERE user_id = '${req.params.user_id}';`,
    (err, data) => {
      if (err) throw err;
      else res.status(200).json(data);
    }
  );
});

// 장바구니 전체 삭제
router.delete('/:user_id/list', (req, res) => {
  connection.query(
    `DELETE FROM cart WHERE user_id = '${req.params.user_id}';`,
    (err, data) => {
      if (err) throw err;
      else res.status(200).json(data);
    }
  );
});

module.exports = router;
