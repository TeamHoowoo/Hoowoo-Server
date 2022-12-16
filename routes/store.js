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

// 제품 등록(데이터 일부분만)
router.post('/:store_id/item', (req, res) => {
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
    `UPDATE store SET password = password('${req.body.password}'), storeIntro = '${req.body.storeIntro}', pickupDate = '${req.body.pickupDate}' WHERE store_id = ${req.params.store_id};`,
    (err) => {
      if (err) throw err;
      else res.status(200).json('스토어 정보 수정 완료');
    }
  );
});

// 스토어 삭제
router.delete('/:store_id/myinfo', (req, res) => {
  connection.query(
    `DELETE FROM store WHERE store_id = '${req.params.store_id}';`,
    (err) => {
      if (err) throw err;
      else res.status(200).json('스토어 삭제 완료');
    }
  );
});

// 모든 예약 목록 반환
router.get('/:store_id/order', (req, res) => {
  connection.query(
    `SELECT * FROM \`order\` WHERE store_id = '${req.params.store_id}' ORDER BY regDate DESC;`,
    (err, data) => {
      if (err) throw err;
      else res.status(200).json(data);
    }
  );
});

// 예약 정보 반환
router.get('/:store_id/order/:order_id', (req, res) => {
  connection.query(
    `SELECT * FROM \`order\` WHERE order_id = '${req.params.order_id}';`,
    (err, data) => {
      if (err) throw err;
      else res.status(200).json(data);
    }
  );
});

// 예약 상태 변경
router.put('/:store_id/order/:order_id', (req, res) => {
  connection.query(
    `UPDATE order SET status = '${req.body.status}' WHERE order_id = ${req.params.order_id};`,
    (err) => {
      if (err) throw err;
      else res.status(200).json('예약 상태 변경 완료');
    }
  );
});

// 모든 일정 반환
router.get('/:store_id/schedule', (req, res) => {
  connection.query(
    `SELECT order_id, itemName AS title, DATE_ADD(date, INTERVAL 9 HOUR) AS date FROM \`order\` WHERE store_id = '${req.params.store_id}' AND status = '예약 확정';`,
    (err, data) => {
      if (err) throw err;
      else {
        res.status(200).json(data);
      }
    }
  );
});

module.exports = router;
