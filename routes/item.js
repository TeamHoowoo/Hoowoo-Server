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

// 모든 제품 목록 반환
router.get('/', (req, res) => {
  connection.query(
    'SELECT i.*, s.storeName, s.storeAddress, s.storeIntro, s.phone, s.pickupDate FROM item AS i JOIN store AS s ON i.store_id = s.store_id;',
    (err, data) => {
      if (err) throw err;
      else res.status(200).json(data);
    }
  );
});

// 스토어의 모든 제품 목록 반환
router.get('/store/:store_id', (req, res) => {
  const getItems = `SELECT * FROM item WHERE store_id = '${req.params.store_id}';`;
  const getStore = `SELECT store_id, storeName, storeAddress, storeIntro, phone, pickupDate FROM store WHERE store_id = '${req.params.store_id}';`;

  connection.query(getItems + getStore, (err, rows) => {
    if (err) throw err;
    else res.status(200).json({ items: rows[0], ...rows[1][0] });
  });
});

// 제품 정보 반환
router.get('/:item_id', (req, res) => {
  connection.query(
    `SELECT i.*, s.storeName, s.storeAddress, s.storeIntro, s.phone, s.pickupDate FROM item AS i JOIN store AS s ON i.store_id = s.store_id WHERE i.item_id = '${req.params.item_id}';`,
    (err, data) => {
      if (err) throw err;
      else res.status(200).json(data);
    }
  );
});

module.exports = router;
