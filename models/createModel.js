var sql = {
    insert: 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
    update: 'update user set name=?, age=? where id=?',
    delete: 'delete from user where id=?',
    queryById: 'select * from user where id=?',
    queryAll: 'select * from user',
    insertSurvey:'INSERT INTO t_survey(createdAt, updatedAt, adminId, title) VALUES(?,?,?,?)',
    insertSurveyQuestion: 'insert into t_survey_question(createdAt, updatedAt, surveyId, title, type) values(?,?,?,?,?)',
    insertSurveyOption: 'insert into t_survey_option(createdAt, updatedAt, questionId, content) values(,,,)'
};
module.exports = sql;