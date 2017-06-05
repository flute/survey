var List = require('../models/list'),
    Analyze = require('../models/analyze');

module.exports = function(req,callback){
    var id = req.params.id;
        
    if( !id || typeof parseInt(id) !='number' || parseInt(id)==NaN ){
        var data = {
            title:'汇总分析',
            user:req.session.user,
            status:0,
            msg:'failed'
        };
        callback(data)
    }else{
        List.getSurveyById(id,function(result){
            var results = result;       
            if(result){
                Analyze.getResultData(id,function(r){
                    
                    if( r.code == 0 ){
                        var question = results.question;
                        results.count = 0;
                        results.question = [];
                        for( var i in question ){
                            results.question.push( question[i] );
                        }
                        var data = {
                            title:'问卷结果',
                            user:req.session.user,
                            status:1,
                            tag:'list',
                            msg:'success',
                            survey:results
                        };
                        callback(data);
                    }else{
                        
                        var result = getAnalyze(results,r);
                        var data = {
                            title:'问卷结果',
                            user:req.session.user,
                            status:1,
                            tag:'list',
                            msg:'success',
                            survey:result
                        };
                        callback(data);
                    }
                    
                }) 
            }
        })
    }
}

function getAnalyze(result,r){
    var arr = r.arr,
        count = arr.count;
    
    result.count = count;
    var question = result.question;
    result.question = [];
    for( var i in question ){
        result.question.push( question[i] );
    }

    for( var i=0;i<result.question.length;i++ ){
        if( result.question[i].type==1 || result.question[i].type==2 ){
            var questionId = result.question[i].id,
                analyzeData = [];

            for( var j=0;j<result.question[i].option.length;j++ ){
                var optionId = result.question[i].option[j].id;
                if( arr[questionId] ){
                    if( arr[questionId][optionId] ){
                        analyzeData.push({
                            value:arr[questionId][optionId],
                            name:result.question[i].option[j].content
                        });
                    }else{
                        analyzeData.push({
                            value:0,
                            name:result.question[i].option[j].content
                        });
                    }
                }
            }
            //其他选项
            if( result.question[i].other == 1 ){
                analyzeData.push({
                    value:arr[questionId][0],
                    name:'其他'
                });
            }
            result.question[i].analyze = analyzeData;

        }
    }
    return result;
}