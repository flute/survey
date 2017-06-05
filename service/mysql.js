var mysql = require('mysql');
var conf = require('../conf/db.js');
//使用连接池，提升性能
var pool = mysql.createPool( conf.mysql );

module.exports = function(callback){

	pool.getConnection(function(err, connection){
			if( err ){
				// 连接失败
				callback(err)
				return;
			}else{
				callback(null, connection);
			}
	})
}