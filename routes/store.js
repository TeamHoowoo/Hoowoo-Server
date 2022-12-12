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

// 제품 정보 반환
router.get('/:store_id/item/:item_id', (req, res) => {
  connection.query(
    `SELECT i.*, s.storeName, s.storeAddress, s.storeIntro, s.phone, s.pickupDate FROM item AS i JOIN store AS s ON i.store_id = s.store_id WHERE i.item_id = '${req.params.item_id}';`,
    (err, data) => {
      if (err) throw err;
      else res.status(200).json(data);
    }
  );
});

// 제품 수정(데이터 일부분만)
router.put('/:store_id/item/:item_id', (req, res) => {
  connection.query(
    `UPDATE item SET name = '${req.body.name}', detail = '${
      req.body.detail
    }', delivery = ${
      req.body.delivery ? Number(req.body.delivery) : null
    }, pickup =${req.body.pickup} WHERE item_id = ${req.params.item_id};`,
    (err) => {
      if (err) throw err;
      else res.status(200).json('제품 수정 완료');
    }
  );
});

// 제품 삭제
router.delete('/:store_id/item/:item_id', (req, res) => {
  connection.query(
    `DELETE FROM item WHERE item_id = '${req.params.item_id}';`,
    (err) => {
      if (err) throw err;
      else res.status(200).json('제품 삭제 완료');
    }
  );
});

// 스토어 정보 반환
router.get('/:store_id/myinfo', (req, res) => {
  connection.query(
    `SELECT * FROM store WHERE store_id = '${req.params.store_id}';`,
    (err, data) => {
      if (err) throw err;
      else res.status(200).json(data);
    }
  );
});

// 스토어 정보 수정
router.put('/:store_id/myinfo', (req, res) => {
  connection.query(
    `UPDATE store SET password = password('${req.body.password}'), storeIntro = '${req.body.storeIntro}', pickupDate = '${req.body.pickupDate}';`,
    (err) => {
      if (err) throw err;
      else res.status(200).json('스토어 정보 수정 완료');
    }
  );
});

module.exports = router;
