let radius; // Brush's Radius
let lastradius = []; // Stores Last Brush's Radius For Undo Function
let canvas2; // Second Canvas For Drawing
let mhx = []; // Stores Latest Brush Path's X
let mhy = []; // Stores Latest Brush Path's Y
let undoHistoryX = []; // Undo History That Stores Brush Path's X
let undoHistoryY = []; // Undo History That Stores Brush Path's Y
let slider; //Brush Size
let docelement = document.documentElement; //Document Itself
let windowx, windowy; // Window Size
let startedInCanvas; // none currently
let r = [],g = [],b = []; //Color For Brush
let lastBrush = []; //Last Brush Type
let imgStorageRef, databaseRef; // Firebase References
let finalData; //Stores The Submission On Submit Button Press
let colorNumber = 1; //Stores Current Color's Index Number

function setup(){
    //Window Setup
    isMobileDevice();
    windowx = 0.95 * windowWidth;
    windowy = windowHeight * 0.8;

    canvas1 = createCanvas(windowx, windowy);
    background(0);
    canvas1.parent("sketchcontainer");

    //Database Setup
    var storage = firebase.storage();
    var database = firebase.database();
    imgStorageRef = storage.ref("gifts/");
    databaseRef = database.ref("gifts/");

    //-------------v------------------ All The CSS ---------------v----------------//
    
    //Empty Space
    createElement("br");

    //---------------------------------------------------------------- Line 1 Canvas
    var line1 = createDiv("Brush Size : ");
    line1.addClass("line1");

    //Slider
    slider = createSlider(10,70,50);
    slider.addClass('sliderClass');
    line1.child(slider);

    //Undo Button
    var undo = createButton("Undo");
    line1.child(undo);
    undo.mousePressed(undofunc);
    undo.addClass("undo");

    //Clear Button
    var clear = createButton("Clear");
    line1.child(clear);
    clear.mousePressed(clearfunc);
    clear.addClass("clear");

    //---------------------------------------------------------------- Line 2 div
    var line2 = createDiv("Color : ");
    line2.addClass("line2");

    //All The Color Buttons
    whiteC = createButton("  ");      whiteC.addClass("ColorButtons");
    blackC = createButton("  ");      blackC.addClass("ColorButtons");
    blueC = createButton("  ");       blueC.addClass("ColorButtons");
    greenC = createButton("  ");      greenC.addClass("ColorButtons");
    yellowC = createButton("  ");     yellowC.addClass("ColorButtons");
    orangeC = createButton("  ");     orangeC.addClass("ColorButtons");
    pinkC = createButton("  ");       pinkC.addClass("ColorButtons");
    redC = createButton("  ");        redC.addClass("ColorButtons");
    purpelC = createButton("  ");     purpelC.addClass("ColorButtons");
    
    whiteC.style("background-color","#ffffff");
    blackC.style("background-color","#000000");
    blueC.style("background-color","#3f92ff");
    greenC.style("background-color","#0aff0a");
    yellowC.style("background-color","#ffff0a");
    orangeC.style("background-color","#ffa00a");
    pinkC.style("background-color","#ff0a82");
    redC.style("background-color","#ff0a0a");
    purpelC.style("background-color","#b432ff");

    line2.child(whiteC);    line2.child(blackC);    line2.child(blueC);
    line2.child(greenC);    line2.child(yellowC);   line2.child(orangeC);
    line2.child(pinkC);     line2.child(redC);      line2.child(purpelC);
    
    BreakElement = createElement("br");
    line2.child(BreakElement);
    line2.child(BreakElement);

    whiteC.mousePressed(function ()  {colorNumber = 1;}  );
    blackC.mousePressed(function ()  {colorNumber = 2;}  );
    blueC.mousePressed(function ()   {colorNumber = 3;}  );
    greenC.mousePressed(function ()  {colorNumber = 4;}  );
    yellowC.mousePressed(function () {colorNumber = 5;}  );
    orangeC.mousePressed(function () {colorNumber = 6;}  );
    pinkC.mousePressed(function ()   {colorNumber = 7;}  );
    redC.mousePressed(function ()    {colorNumber = 8;}  );
    purpelC.mousePressed(function () {colorNumber = 9;}  );

    //---------------------------------------------------------------- Line 3 Div
    var line3 = createDiv();
    line3.addClass("line3");
    
    eraserSettings = createButton("Set Eraser");
    brushSettings = createButton("Set Brush");
    eraserSettings.addClass("eraserSettingsClass");
    brushSettings.addClass("brushSettingsClass");
    line3.child(eraserSettings);
    line3.child(brushSettings);

        //Submit Buttons
        submitButton = createButton("Submit");
        viewSubmissionsButton = createButton("View Submissions");
        line3.child(submitButton);
        line3.child(viewSubmissionsButton);
        submitButton.mousePressed(submit);
        viewSubmissionsButton.mousePressed(viewsub);
            //Submit Button & View Submissions Button Style :
            submitButton.addClass("submitButtonClass");
            viewSubmissionsButton.addClass("viewSubmissionsButtonClass");
        

        //Setting Up Brush Colors
        eraserSettings.mousePressed(setEraser);
        brushSettings.mousePressed(setBrush);
}

//--------------------------------------- Mobile Detector
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};


//--------------------------------------- Setting Up Pointer For Touch
if(isMobileDevice() == true){

    function touchStarted(){
        if(mouseX >= 0 && mouseX <= windowx && mouseY >= 0 && mouseY <= windowy){
            switch(colorNumber){
                case 1:
                r.unshift(255);
                g.unshift(255);
                b.unshift(255);
                break;
        
            case 2:
                r.unshift(0);            
                g.unshift(0);            
                b.unshift(0);            
                break;
        
            case 3:
                r.unshift(63);
                g.unshift(146);
                b.unshift(255);
                break;
        
            case 4:
                r.unshift(10);
                g.unshift(255);
                b.unshift(10);
                break;
        
            case 5:
                r.unshift(255);
                g.unshift(255);
                b.unshift(10);
                break;
        
            case 6:
                r.unshift(255);
                g.unshift(160);
                b.unshift(10);
                break;
        
            case 7:
                r.unshift(255);
                g.unshift(10);
                b.unshift(130);
                break;
        
            case 8:
                r.unshift(255);
                g.unshift(10);
                b.unshift(10);
                break;
        
            case 9:
                r.unshift(180);
                g.unshift(50);
                b.unshift(255);
                break;
        
            default:
                r.unshift(255);
                g.unshift(255);
                b.unshift(255);
            }

            radius = slider.value();
            mhx = [];
            mhy = [];
        
            mhx.unshift(mouseX);
            mhy.unshift(mouseY);
            lastradius.unshift(radius-4);
        }
    }

    function touchMoved(){
        if(mouseX >= 0 && mouseX <= windowx && mouseY >= 0 && mouseY <= windowy){
            mhx.unshift(mouseX);
            mhy.unshift(mouseY);

            stroke(r[0],g[0],b[0]);
            strokeWeight(radius-4);
            line(mhx[0],mhy[0],mhx[1],mhy[1]);
        }
    }

    function touchEnded(){
        if(mouseX >= 0 && mouseX <= windowx && mouseY >= 0 && mouseY <= windowy){
            undoHistoryX.unshift(mhx);
            undoHistoryY.unshift(mhy);
            mhx = [];
            mhy = [];
        }
    }

}else{

//--------------------------------------- Setting Up Pointer For Mouse
    function mousePressed(){
        if(mouseX >= 0 && mouseX <= windowx && mouseY >= 0 && mouseY <= windowy){
            switch(colorNumber){
                case 1:
                r.unshift(255);
                g.unshift(255);
                b.unshift(255);
                console.log("White");
                break;
        
            case 2:
                r.unshift(0);            
                g.unshift(0);            
                b.unshift(0);
                console.log("Black");            
                break;
        
            case 3:
                r.unshift(63);
                g.unshift(146);
                b.unshift(255);
                console.log("Blue");
                break;
        
            case 4:
                r.unshift(10);
                g.unshift(255);
                b.unshift(10);
                console.log("Green");
                break;
        
            case 5:
                r.unshift(255);
                g.unshift(255);
                b.unshift(10);
                console.log("Yellow");
                break;
        
            case 6:
                r.unshift(255);
                g.unshift(160);
                b.unshift(10);
                console.log("Orange");
                break;
        
            case 7:
                r.unshift(255);
                g.unshift(10);
                b.unshift(130);
                console.log("Pink");
                break;
        
            case 8:
                r.unshift(255);
                g.unshift(10);
                b.unshift(10);
                console.log("Red");
                break;
        
            case 9:
                r.unshift(180);
                g.unshift(50);
                b.unshift(255);
                console.log("Purple");
                break;
        
            default:
                r.unshift(255);
                g.unshift(255);
                b.unshift(255);
                console.log("White");
            }

            radius = slider.value();
            mhx = [];
            mhy = [];
            mhx.unshift(mouseX);
            mhy.unshift(mouseY);
            lastradius.unshift(radius-4);
        }
    }

    function mouseDragged(){
        if(mouseX >= 0 && mouseX <= windowx && mouseY >= 0 && mouseY <= windowy){
            mhx.unshift(mouseX);
            mhy.unshift(mouseY);
            
            stroke(r[0],g[0],b[0]);
            strokeWeight(radius-4);
            line(mhx[0],mhy[0],mhx[1],mhy[1]);
        }
    }

    function mouseReleased(){
        if(mouseX >= 0 && mouseX <= windowx && mouseY >= 0 && mouseY <= windowy){
            undoHistoryX.unshift(mhx);
            undoHistoryY.unshift(mhy);

            mhx = [];
            mhy = [];
        }
    }
}

//--------------------------------------- Clear Canvas function
function clearfunc(){
    background(0);
    undoHistoryX = [];
    undoHistoryY = [];
    mhx = [];
    mhy = [];
    r = [];
    g = [];
    b = [];
    lastradius = [];
}

//--------------------------------------- Undo Function
function undofunc(){
    background(0);
    lastradius.shift();
    undoHistoryX.shift();
    undoHistoryY.shift();
    r.shift();
    g.shift();
    b.shift();
    lastBrush.shift();

    //Draws The Whole Drawing      *Very Important Function*
    for(var i = undoHistoryX.length - 1; i >= 0; i--){
        stroke(r[i],g[i],b[i]);
        strokeWeight(lastradius[i]);
        for(var j = 0; j < undoHistoryX[i].length; j++){
            line(undoHistoryX[i][j],undoHistoryY[i][j],undoHistoryX[i][j+1],undoHistoryY[i][j+1]);
        }
    }
}

//--------------------------------------- Eraser Setter
function setEraser(){
    colorNumber = 2;
}

//--------------------------------------- Brush Setter
function setBrush(){
    colorNumber = 1;
}

//--------------------------------------- Submit Button Function
function submit(){
    finalData = {
        drawX : undoHistoryX,
        drawY : undoHistoryY,
        redChannel : r,
        greenChannel : g,
        blueChannel : b,
        radius : lastradius,
        canvasX : windowx,
        canvasY : windowy,
        username : username
    }
    databaseRef.push(finalData);
    alert("Uploading Your Data.. Click Ok And Wait For Few Seconds");
    setTimeout(function(){ alert("Data Upload Successful. Thank You For Your Submission!"); },3000);
}

//--------------------------------------- View Submission Button Function
function viewsub(){
    window.location.href = "ViewSubmissions.html";
}