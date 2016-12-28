# survey
a simple survey system made by nodejs+express+mysql+material design

##install
1. `npm install`
2. 配置数据库 `conf/db.js` ，导入sql文件 `mysql.sql`
3. `node app.js`

##功能
1. 登陆验证
1. 问题类型包括 单选、多选及问答三类
2. 查看问卷列表、删除
3. 填写提交问卷
4. 问卷结果列表及结果详情

###注：
在系统实现过程中，数据表的设计及数据操作有些麻烦，感兴趣的往下看：

为了问卷结果的可读性及统计方便，数据表设计时将 问卷、问题、选项 分为三个表，在插入、读取问卷时，需要顺序、批量进行数据库操作。

如：新增1个问卷，该问卷有10个问题，单选及多选问题包含2个以上的选项。

那么数据操作顺序是：

1. 先插入问卷，并得到返回的问卷ID。
2. 得到问卷ID，按顺序插入10个问题，每个问题在插入成功后，返回问题ID。
3. 每个问题插入成功时得到问题ID，按顺序插入该问题的多个选项，只有当该问题及问题选项全部插入成功时，开始执行下个问题。

可以看到3是2中的内部循环，2本身是个循环，1和2是顺序执行关系。对于这样的数据插入，如果用常规的嵌套回调，光一个问题就是三层以上的嵌套，几十个问题的话就没法玩了😂。而且所有的操作只需要一个返回结果，及最终成功与否，只要当其中任何一此插入失败则失败。

最终实现方法是使用`async.eachSeries`，以下代码实现上述问题：

```js
insertSurvey: function (data,callback) {
	//从mysql连接池获取连接
	pool.getConnection(function(err,connection){
		if( err ){
			callback(err);
			return;
		}
		connection.query( "insert into t_survey(... , ... ,...) values(..., ...)", function(err,res){
			if(res){
				//问卷插入成功
				var surveyId = res.insertId;
				//异步批量按序插入问题
				//拼接sql数组
				{...}
				/**
				 * insertQuestionSql 是插入问题的语句数组
				 * 
				 * insertQuestionSql = [
				 * 		insert into t_survey_question(createAt,type,.....) values(... ,.. , ...),
				 * 		insert into t_survey_question(createAt,type,.....) values(... ,.. , ...),
				 * 		.....
				 * ];
				 */
				async.eachSeries( insertQuestionSql, function(item,questioncb){
					connection.query( item.survey, function(err, results) {
						if(err) {
							questioncb(err,result);
						}else{
							//问题插入成功，继续插入选项
							var questionId = results.insertId;
							//如果是单选或多选，存在多个选项，异步批量按序插入选项
							//拼接sql数组
							{...}
							/**
							 * insertOptionSql 是需要插入的选项数组
							 * 
							 * insertOptionSql = [
							 * 		insert into t_survey_option(createAt,type,.....) values(... ,.. , ...),
							 * 		insert into t_survey_option(createAt,type,.....) values(... ,.. , ...),
							 * 		.....
							 * ];
							 */
							if( item.data.type == 'radio' || item.data.type == 'checkbox' ){
								async.eachSeries( insertOptionSql, function( optionitem, optioncb ){
									connection.query( optionitem, function( operror,opresult){
										if(operror){
											optioncb(operror,opresult);
										}else{
											//选项插入成功
											optioncb( opresult.insertId );
										}
									});
								},function(err){
									//当前问题的所有选项插入结束
									if(err){
										callback(err);
									}else{
										callback();
									}
								});
							}else{
								//问答无选项，直接回调
								questioncb();
							}
						}
					});
				},function(err) {
					//所有问题插入结束
					callback(err);
				});
			}else if(err){
				callback(err)
			}
			//回调结果
			callback(result);
			//释放连接 
            connection.release();
		})
	})
},
```
最终的解决方案也是三层嵌套回调，也对应了对三个表的操作，暂时算是最优解决方案了。

`async.eachSeries` 保证了SQL的执行顺序，而且当其中一条执行异常，就不会继续执行下一条，简单示例：

```js
var sqls = [
  "INSERT INTO log SET data='data1'",
  "INSERT INTO log SET data='data2'",
  "INSERT INTO log SET data='data3'"
];

async.eachSeries(sqls, function(item, callback) {
  // 遍历每条SQL并执行
  connection.query(item, function(err, results) {
    if(err) {
      // 异常后调用callback并传入err
      callback(err);
    } else {
      console.log(item + "执行成功");
      // 执行完成后也要调用callback，不需要参数
      callback();
    }
  });
}, function(err) {
  // 所有SQL执行完成后回调
  if(err) {
    console.log(err);
  } else {
    console.log("SQL全部执行成功");
  }
});
```


