module.exports = {
    mysql: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'survey',
        port: 3306
    },
    ssoUrl:'https://sso.XXX.com/',
    regionURL : "https://xxx.com/xxx"
};
/**
 * 路由： routes/index.js
 * service: 
 *       dealResult: 得到问卷结果数据
 *       getAnalyze: 得到问卷汇总分析数据
 *       ssoLogin  : SSO登陆
 *       upload    : 上传
 */