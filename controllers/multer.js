var express=require("express");
const app=express();
const path=require("path");
const multer=require("multer");
const bodyParser=require("body-parser");
const imageStorage=multer.diskStorage({
	destination:"uploads",
	filename:(req,file,cb)=>{ //cb is callback
		cb(null,file.filename+" "+Date.now()+path.extname(file.originalname));
	}
});
const imageuploader=multer({
	storage:imageStorage,
	limits:{
		fileSize:2100000 //2mb file sizr limit 2000000  2097152
	},
	fileFilter(req,file,cb){
		if(!file.orignalname.match(/\.(jpg|png|gif|pdf)$/)
			return cb(new Error("only jpg,png,gif,pdf"));
		cb(undefined, true);
	}
});
app.set('view engine','ejs');
app.po
app.get('/',function(req,res){
	res.render('fileupload_view');
});
app.post('/uploadsubmit',imageuploader.single('image'),function(req,res){
	res.send(req.file);
},(error,req,res,next)=>);
app.listen(8080,()=>console.log("sever run at port 8080"));