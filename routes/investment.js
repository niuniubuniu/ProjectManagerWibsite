var express = require('express');
var router = express.Router();
var URL = require('url');
var {insertUPData, findUPData, removeUPData } = require('../db/investmentDB')
var {insertProjectsData, findProjectsData, removeProjectsData, findProjectsByProjectIds} = require('../db/dbHandler')

const tableName = 'investment';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('investment', { title: 'investment' });
});

router.get('/getInvestmentProject', function(req, res, next) {

  var params = URL.parse(req.url, true).query;
  findUPData( tableName, params, (data)=>{

      var projectIdArr=[];
      data.map((item)=>{
          projectIdArr.push(item.projectId)
      })

      findProjectsByProjectIds('projects', projectIdArr, (projectsData)=>{

          var investmentArr = [];

          data.map((item)=>{
              projectsData.map((project)=>{
                  if (item.projectId == project._id) {
                      investmentArr.push(Object.assign({}, project, item))
                  }
              })
          })

          var response = {status:1, data:investmentArr};
          res.setHeader("content-type","application/json" )
          res.send(JSON.stringify(response));
      })

  })

});

router.get('/investment', function(req, res, next) {

  var params = URL.parse(req.url, true).query;
  findUPData( tableName, params, (data)=>{
    var response = {status:1,data:data};
    res.setHeader("content-type","application/json" )
    res.send(JSON.stringify(response));
  })

});

router.post('/investment', function(req, res, next) {

  var params = req.body;
  console.log('insertProjectsData',req);
  insertUPData(tableName, params, (result)=>{
      var response ;
      if(result && result.result && result.result.n){
        response = {status:1 ,data:{message: "数据添加成功"}};
      }else {
        response = {status:0 ,data:{message: "数据添加失败"}};
      }
      res.setHeader("content-type","application/json" )

     res.send(JSON.stringify(response));
  })

});

router.delete('/investment', function(req, res, next) {
  var params = URL.parse(req.url, true).query;
  removeUPData(tableName , params, (result)=>{
    var response ;
    if(result && result.result && result.result.n){
      response = {status:1 ,data:{message: "数据删除成功"}};
    }else {
      response = {status:0 ,data:{message: "数据删除失败"}};
    }
    res.setHeader("content-type","application/json" )
    res.send(JSON.stringify(response));
  })

});


module.exports = router;
