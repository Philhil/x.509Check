var socket = io();
var SelectedFile;
var FReader;
var Name;
function hideUpload()
{
    $('#UploadBox').addClass('hidden');
}
function showUpload()
{
    $('#UploadBox').removeClass('hidden');
}
function hideList()
{
    $('#CertBox').addClass('hidden');
}
function showList()
{
    $('#CertBox').removeClass('hidden');
}
function parseCriticality(strText)
{
    switch(strText)
    {
        case "none":
            return "";
        case "ok":
            return '<span class="glyphicon glyphicon-ok text-success" aria-hidden="true"></span>';
        case "warn":
            return '<span class="glyphicon glyphicon-warning-sign text-warning" aria-hidden="true"></span>';
        case "critical":
            return '<span class="glyphicon glyphicon-remove text-danger" aria-hidden="true"></span>';
        default:
            return '<span>' + strText + '</span>';
    }

}
function parseComaseperatedValued(strText)
{
    var rows = strText.split(",");
    if(rows.length <1)
    {
        return '<span>' + strText + '</span>';
    }
    var returnElem = $('<div>');
    returnElem.addClass("row");

    for(i=0; i<rows.length; i++)
    {
        rows[i].trim();
        if(rows[i] === "" || rows[i] === " ")
        {
            continue;
        }
        var singlerow = $('<div>');
        singlerow.addClass("row");
        singlerow.addClass("innerRow");
        var name = $('<div class="col-md-6">');
        var information = rows[i].split("=");
        information[0].trim();
        name.append($('<span>').text(information[0]));
        singlerow.append(name);

        if(information.length>1)
        {
            var val = $('<div class="col-md-6">');
            information[1].trim();
            val.append($('<span>').text(information[1]));
            singlerow.append(val);
        }
        returnElem.append(singlerow);
    }
    return returnElem;
}

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
        $('#messages').append($('<div class="row">').append($('<span>').text(msg)));
    });
    socket.on('cert data', function(msg){
        console.log('received cert data: ' + msg);
        var data = jQuery.parseJSON(msg);

        $('#certDetails').append(
            $('<div class="row">').append(
                $('<div class="col-md-1">').append(
                    parseCriticality(data.criticallity)),
                $('<div class="col-md-2">').append(
                    $('<span>').text(data.name)),
                $('<div class="col-md-5">').append(
                    parseComaseperatedValued(data.value)),
                $('<div class="col-md-4">').append(
                    $('<span>').text(data.explanation))
            )
        );

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
            hideUpload();
            showList();
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