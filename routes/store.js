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

// 특정 스토어의 모든 제품 정보 반환
router.get('/:store_id/item', (req, res) => {
  const getItems = `SELECT * FROM item WHERE store_id = '${req.params.store_id}';`;
  const getStore = `SELECT store_id, storeName, storeAddress, storeIntro, phone, pickupDate FROM store WHERE store_id = '${req.params.store_id}';`;

  connection.query(getItems + getStore, (err, rows) => {
    if (err) throw err;
    else res.status(200).json({ items: rows[0], ...rows[1][0] });
  });
});

// 제품 등록(데이터 일부분만)
router.post('/:store_id/new', (req, res) => {
  connection.query(
    `INSERT INTO item (name, detail, delivery, pickup, store_id) VALUES ('${
      req.body.name
    }', '${req.body.detail}', ${
      req.body.delivery ? Number(req.body.delivery) : null
    }, ${req.body.pickup}, ${req.params.store_id});`,
    (err) => {
      if (err) throw err;
      else res.status(201).json('제품 등록 완료');
    }
  );
});

module.exports = router;
