var express = require('express');
var router = express.Router();
var path = require('path');
var url ='/dist/index.html';
var urlMain=path.join(__dirname,'../',url);
		

/* GET users listing. */

//router.use(express.static(url));
//router.get('*.*',express.static(url));

//router.get('*',express.static(path.join(__dirname + '/docs/index.html')));

router.get('/path', function(req, res, next) {
	
  res.send('path : '+urlMain);
});



router.get('/*',(req,res,next)=>{
	console.log();
	res.sendFile(urlMain); 
})


module.exports = router;
