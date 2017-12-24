var app = require('express')();
var https = require('https');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs'),
    exec = require('child_process').exec,
    util = require('util');
const x509 = require('x509');

var Files = {};

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('Start', function (data) {
        var Name = data['Name'];
        socket.emit('chat message', "Start upload " + data['Name']);

        Files[Name] = {  //Create a new Entry in The Files Variable
            FileSize : data['Size'],
            Data     : "",
            Downloaded : 0
        };
        var Place = 0;
        try{
            var Stat = fs.statSync('Temp/' +  Name);
            if(Stat.isFile())
            {
                Files[Name]['Downloaded'] = Stat.size;
                Place = Stat.size / 524288;
            }
        }
        catch(er){} //It's a New File
        fs.open("Temp/" + Name, "a", 0755, function(err, fd){
            if(err)
            {
                console.log(err);
            }
            else
            {
                Files[Name]['Handler'] = fd; //We store the file handler so we can write to it later
                socket.emit('MoreData', { 'Place' : Place, Percent : 0 });
            }
        });
    });

    socket.on('Upload', function (data){
        var Name = data['Name'];
        Files[Name]['Downloaded'] += data['Data'].length;
        Files[Name]['Data'] += data['Data'];
        if(Files[Name]['Downloaded'] == Files[Name]['FileSize']) //If File is Fully Uploaded
        {
            fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
                socket.emit('chat message', "Upload 100 %");
                socket.emit('Done', {'Name' : data['Name']});

                //check x509

                var options = { mode: 0755 };
                /*var file = fs.createWriteStream("Temp/cacert.pem", options);
                var request = https.get("https://curl.haxx.se/ca/cacert.pem", function(response) {
                    response.pipe(file);
                });*/

                try{
                    var cert = x509.parseCert(__dirname + '/Temp/'+data['Name']);


                    var issuer;
                    var pubkey;
                    for (var k in cert['issuer']){
                        issuer += k + "=" + cert['issuer'][k].toString() + ", ";
                    }

                    for (var k in cert['publicKey']){
                        pubkey += k + "=" + cert['publicKey'][k].toString() + ", ";
                    }

                    socket.emit('chat message', "Version: " + cert['version'].toString());
                    socket.emit('chat message', "Issuer: " + issuer);
                    socket.emit('chat message', "Valid from: " + cert.notBefore);
                    socket.emit('chat message', "Valid to: " + cert.notAfter);
                    socket.emit('chat message', "Public Key: " + pubkey);

                    /*
                    x509.verify(
                        __dirname + '/Temp/'+data['Name'],
                        __dirname + '/Temp/cacert.pem',
                        function(err, result){if (err == null){
                            socket.emit('chat message', "This is a Valid Cert Chain");
                        } else {
                            console.log(err);
                            console.log(result);
                            socket.emit('chat message', "This is NOT a Valid Cert Chain: "+ err);
                        }}
                    );*/

                }
                catch(er){ //It's not a valid cert file
                    socket.emit('chat message', data['Name'] + " is not a Valid x509 Cert file");
                }
            });
        }
        else if(Files[Name]['Data'].length > 10485760){ //If the Data Buffer reaches 10MB
            fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
                Files[Name]['Data'] = ""; //Reset The Buffer
                var Place = Files[Name]['Downloaded'] / 524288;
                var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
                socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
            });
        }
        else
        {
            var Place = Files[Name]['Downloaded'] / 524288;
            var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
            socket.emit('chat message', "Upload " + Percent + " %");
            socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
        }
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
