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

// 주문 하기
router.post('/:user_id/order/:store_id/:item_id', (req, res) => {
  const o = req.body;
  connection.query(
    `INSERT INTO order (regDate, count, receipt, letteringColor, creamColor, flavor, size, price, totalPrice, lettering, status, name, phone, address, user_id, store_id, item_id)
    VALUES (${o.regDate}, ${Number(o.count)},'${o.receipt}', '${
      o.letteringColor
    }', '${o.creamColor}', '${o.flavor}', '${o.size}', ${Number(
      o.price
    )}, ${Number(o.totalPrice)}, '${o.lettering}', '대기', '${o.name}', '${
      o.phone
    }', '${o.address}', ${req.params.user_id}, ${req.params.store_id}, ${
      req.params.item_id
    });`,
    (err) => {
      if (err) throw err;
      else res.status(201).json('주문 완료');
    }
  );
});

// 주문 취소
router.delete('/:user_id/order/:order_id', (req, res) => {
  connection.query(
    `DELETE FROM item WHERE order_id = '${req.params.order_id}';`,
    (err) => {
      if (err) throw err;
      else res.status(200).json('주문 취소 완료');
    }
  );
});

module.exports = router;
