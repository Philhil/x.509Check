var socket = io();
var SelectedFile;
var FReader;
var Name;

$(function () {

    socket.on('MoreData', function (data){
        console.log(data['Percent']);
        var Place = data['Place'] * 524288; //Next Blocks Starting Pos
        var NewFile; //hold the new Block
        if(SelectedFile.webkitSlice)
            NewFile = SelectedFile.webkitSlice(Place, Place + Math.min(524288, (SelectedFile.size-Place)));
        else
            NewFile = SelectedFile.slice(Place, Place + Math.min(524288, (SelectedFile.size-Place)));
        FReader.readAsBinaryString(NewFile);
    });

    socket.on('chat message', function(msg){
        console.log('new Message: ' + msg);
        $('#messages').append($('<li>').text(msg));
    });
    socket.on('cert data', function(msg){
        console.log('received cert data: ' + msg);
        var data = jQuery.parseJSON(msg);
        $('#messages').append($('<li>').text(data.name + " : " + data.value));

    });
    socket.on('Done', function (data){
    });

    $('form').submit(function () {
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

    $( "#UploadButton" ).click(function() {
        if($('#FileBox').prop("files").length > 0)
        {
            SelectedFile = $('#FileBox').prop("files")[0];
            FReader = new FileReader();
            var Content = "<span id='NameArea'>Uploading " + SelectedFile.name + "</span>";
            $('#UploadArea').html(Content);
            FReader.onload = function(evnt){
                socket.emit('Upload', {Name: SelectedFile.name, Data : evnt.target.result });
            }
            socket.emit('Start', {Name: SelectedFile.name, 'Size' : SelectedFile.size });
        }
        else
        {
            alert("Please Select A File");
        }
    });
});