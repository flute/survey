var Conf = require("../conf/db"),
    request = require('request');

var List = require("../models/list.js");

module.exports = {
    //检查是否登陆
    checkLogin: function (req, res, next) {
        var callbackUrl = req.protocol+"://"+req.headers.host+req.originalUrl;
        //ssoLogin(req,res,next,callbackUrl);

         req.session.user = {account:'17701275128',name:'管理员',id:1};
         req.session.user.currentRegion = {
             shortName:'乌鲁木齐市',
             code:'6501'
         }
         next();
    },
    logOut:function(req, res, next){
        var ticket = req.session.ticket,
            ssoLogOutUrl = Conf.ssoUrl+"logout?ticket="+ticket;
        
        request( ssoLogOutUrl, function(error, response, body){
            // 请求注销ticket
        })
    }   
}

function ssoLogin(req,res,next,callbackUrl){
    var session = req.session.user,
        ticket = req.query.ticket,
        ssoLoginUrl = Conf.ssoUrl+"login?service="+callbackUrl;
        checkTicketUrl = Conf.ssoUrl+"validate?ticket="+ticket;
    //session存在
    if( session ) {
        //session存在，直接进入系统
        console.log('session存在');
        next();
    }
    //session不存在、ticket存在
    else if( ticket ) {
        console.log('ticket存在');
        //发送ticket到 SSO 服务器验证ticket，接收返回的参数
        request( checkTicketUrl ,function(error,response,body){ 
            if(!error && response.statusCode == 200){
                var info = JSON.parse(body);

                if(info.status==1){
                    //ticket有效，将接收到的用户信息写入本地会话
                    var account = info.data.account;
                    //req.session.user = info.data;
                    
                    List.getAdminInfoByAccount(account,function(result){
                        if( result.status ){
                            req.session.user = result.data;
                            req.session.ticket = ticket;

                            // 获取管理员当前所在层级（currentRegionId）
                            request( Conf.regionURL + "?ticket=" + ticket, function(err, response, body) {
                                
                                if(!err && response.statusCode == 200) {
                                    var retObj = JSON.parse(body);
                                    req.session.user['currentRegion'] = retObj.data.currentRegion;
                                    if(!retObj.data.currentRegion) {
                                        res.redirect(ssoLoginUrl);
                                    } else {
                                        next();
                                    }
                                    
                                } else {
                                    res.redirect(ssoLoginUrl);
                                }
                            });


                        }else{
                            res.redirect(ssoLoginUrl);
                        }
                    });
                    
                }else{
                    //ticket无效，跳转到sso登陆页，附带本页URL地址
                    res.redirect(ssoLoginUrl);
                }
            }else{
                //error
                res.redirect(ssoLoginUrl);
                console.log('res error');
            }
        })
    }
    //session不存在、ticket不存在
    else {
        //跳转到sso登陆页面，附带本页URL地址
        return res.redirect(ssoLoginUrl);
    }
    
}
