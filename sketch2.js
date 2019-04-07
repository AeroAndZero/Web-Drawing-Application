//------------------- This Sketch Is For Viewing Submissions ------------------------//
    
    //Stores What Sent
let undoHistoryX,
    undoHistoryY,
    r,
    g,
    b,
    a,
    lastradius,
    downloadedCanvasX,
    downloadedCanvasY,
    canvas1;

let username = [];
let database;   //Access The Firebase's Database
let ref;        //Reference To The Database
let keys;       //Stores Database's Keys
let dataList;   //Stores Datalist

//----------------------------------------------- Setup Function
function setup(){
    database = firebase.database();
    ref = database.ref('gifts/');
    ref.on('value',gotData,errorData);
}

//----------------------------------------------- Got Data Function
function gotData(data){
    username = [];

    dataList = data.val();
    keys = Object.keys(dataList);
    for(var i = keys.length - 1; i >= 0 ;i--){
        //Showing Username
        var k = keys[i];
        username.unshift(dataList[k].username); // All I Need In This Function

        //Creating List Of Username:
        var li = createElement('li','');
        li.parent("#links");
        var usernameAhref = createA('#',dataList[k].username);
        usernameAhref.parent(li);
        usernameAhref.mousePressed(printLink);
    }
    document.getElementById("Header").innerHTML = "Click On Any Of The Link To View Submission";
}

//----------------------------------------------- Error In Getting Data Function
function errorData(err){
    document.getElementById("Header").innerHTML = "An Error Occured [!]";
}

//----------------------------------------------- Printing Links & Drawing Canvas
function printLink(){
    var clickKey = keys[username.indexOf(this.html())];
    var oneDrawingRef = database.ref('gifts/' + clickKey);
    
    oneDrawingRef.on('value',function(data){
        document.getElementById("Header").innerHTML = "Loading...";
        
        //Storing All Data
        undoHistoryX = dataList[clickKey].drawX;
        undoHistoryY = dataList[clickKey].drawY;
        r = dataList[clickKey].redChannel;
        g = dataList[clickKey].greenChannel;
        b = dataList[clickKey].blueChannel;    
        a = dataList[clickKey].alphaChannel;
        lastradius = dataList[clickKey].radius;
        downloadedCanvasX = dataList[clickKey].canvasX;
        downloadedCanvasY = dataList[clickKey].canvasY;

        canvas1 = createCanvas(downloadedCanvasX,downloadedCanvasY);
        canvas1.parent('#sketch2container');
        canvas1.background(0);
        for(var i = undoHistoryX.length - 1; i >= 0; i--){
            canvas1.stroke(r[i],g[i],b[i],a[i]);
            canvas1.strokeWeight(lastradius[i]-4);
            for(var j = 0; j < undoHistoryX[i].length; j++){
                canvas1.line(undoHistoryX[i][j],undoHistoryY[i][j],undoHistoryX[i][j+1],undoHistoryY[i][j+1]);
            }
        }

    },errorData);
    document.getElementById("Header").innerHTML = "Click On Any Of The Link To View Submission";
}