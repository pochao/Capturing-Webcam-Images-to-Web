var
http = require('http'),
path = require('path'),
fs = require('fs'),
url = require('url')
 
//these are the only file types we will support for now
extensions = {
	".html" : "text/html",
	".css" : "text/css",
	".js" : "application/javascript",
	".png" : "image/png",
	".gif" : "image/gif",
	".jpg" : "image/jpeg"
};
 
//helper function handles file verification
function getFile(filePath,res,page404,mimeType){
	//does the requested file exist?
	fs.exists(filePath,function(exists){
		//if it does...
		if(exists){
			//read the fiule, run the anonymous function
			fs.readFile(filePath,function(err,contents){
				if(!err){
					//if there was no error
					//send the contents with the default 200/ok header
					res.writeHead(200,{
						"Content-type" : mimeType,
						"Content-Length" : contents.length
					});
					res.end(contents);
				} else {
					//for our own troubleshooting
					console.dir(err);
				};
			});
		} else {
			//if the requested file was not found
			//serve-up our custom 404 page
			fs.readFile(page404,function(err,contents){
				//if there was no error
				if(!err){
					//send the contents with a 404/not found header 
					res.writeHead(404, {'Content-Type': 'text/html'});
					res.end(contents);
				} else {
					//for our own troubleshooting
					console.dir(err);
				};
			});
		};
	});
};
 
//a helper function to handle HTTP requests
function requestHandler(req, res) {
	var
	//fileName = path.basename(req.url) || 'index.html',
	fileName = path.basename(url.parse(req.url).pathname) || 'index.html',
	ext = path.extname(fileName),
	localFolder = __dirname + '/public/',
	page404 = localFolder + '404.html';
 
	//do we support the requested file type?
	if(!extensions[ext]){
		//for now just send a 404 and a short message
		res.writeHead(404, {'Content-Type': 'text/html'});
		res.end("&lt;html&gt;&lt;head&gt;&lt;/head&gt;&lt;body&gt;The requested file type is not supported&lt;/body&gt;&lt;/html&gt;");
	};
 
	//call our helper function
	//pass in the path to the file we want,
	//the response object, and the 404 page path
	//in case the requestd file is not found
	getFile((localFolder + fileName),res,page404,extensions[ext]);
};

var app = http.createServer(requestHandler)
app.listen(8081)
//以上為小型web server程式碼


//建立socket io伺服器
var io = require('socket.io')(app)

io.on('connection', function(socket){
	//接收webcam更新相片訊息
	socket.on('new_image', function(data){
		//將相片更新訊息傳給webpage
		socket.broadcast.emit('image')
	})
	//接收webpage停止訊息
	socket.on('stop_webcam', function(data){
		//將操作訊息傳給webvideo.py
		console.log('stop_webcam')
		socket.broadcast.emit('aaa_response')
	})
	
	//接收webpage啟動訊息
	socket.on('start_webcam', function(data){
		console.log("start_webcam")
		//呼叫webvideo.py
		startCam()
	})
})

//啟動webcam
startCam()

function startCam(){
	var exec = require('child_process').exec
	var filename = 'webvideo.py'
	exec('python' + ' ' + filename,function(err,stdout,stderr){
		if(err){
	    	console.log('stderr',err)
		}
	    
		if(stdout){
	    	console.log('stdout',stdout)
		}
	})	
}
