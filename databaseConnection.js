const mysql = require('mysql2/promise');

const is_qoddi = process.env.IS_QODDI || false;

const dbConfigQoddi = {
	host: "sql.freedb.tech",
	user: "freedb_comp2350_a_calif",
	password: "GvbBQ9JW7cj!$zA",
	database: "freedb_: comp2350-A01323412",
	multipleStatements: false,
	namedPlaceholders: true
};

const dbConfigLocal = {
	host: "localhost",
	user: "root",
	password: "Ahmed18131806",
	database: "event_booking",
	multipleStatements: false,
	namedPlaceholders: true
};


if (is_qoddi) {
	var database = mysql.createPool(dbConfigQoddi);
}
else {
	var database = mysql.createPool(dbConfigLocal);
}

module.exports = database;