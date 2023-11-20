var express = require('express');
var router = express.Router();
var path = require('path');
var url ='/dist/app-angular-json-server/index.html';
var urlMain=path.join(__dirname,'../',url);
		

/* GET users listing. */

//router.use(express.static(url));
//router.get('*.*',express.static(url));

router.get('/path', function(req, res, next) {
	
  res.send('path : '+urlMain);
});

router.get('/*',(req,res,next)=>{
	console.log(urlMain)
	res.sendFile(urlMain); 
})


module.exports = router;
