let radius; // Brush's Radius
let lastradius = []; // Stores Last Brush's Radius For Undo Function
let canvas2; // Second Canvas For Drawing
let mhx = []; // Stores Latest Brush Path's X
let mhy = []; // Stores Latest Brush Path's Y
let undoHistoryX = []; // Undo History That Stores Brush Path's X
let undoHistoryY = []; // Undo History That Stores Brush Path's Y
let slider; //Brush Size
let docelement = document.documentElement; //Document Itself
let alphabrush; //Eraser
let windowx, windowy; // Window Size
let startedInCanvas; // none currently
let r = [],g = [],b = [],a = []; //Color For Brush
let lastBrush = []; //Last Brush Type
let imgStorageRef, databaseRef; // Firebase References
let finalData; //Stores The Submission On Submit Button Press

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

    //Line 1 Canvas
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

    //Line 2 div
    var line2 = createDiv("Color : ");
    line2.addClass("line2");

    //Line 3 Div
    var line3 = createDiv();
    line3.addClass("line3");

    //Color Sliders
    redColorSlider = createSlider(0,255,255);
    greenColorSlider = createSlider(0,255,255);
    blueColorSlider = createSlider(0,255,255);
    alphaColorSlider = createSlider(0,255,255);
    eraserSettings = createButton("Set Eraser");
    brushSettings = createButton("Set Brush");

    line2.child(redColorSlider);
    line2.child(greenColorSlider);
    line2.child(blueColorSlider);
    line2.child(alphaColorSlider);
    BreakElement = createElement("br");
    line2.child(BreakElement);
    line2.child(BreakElement);
    
    line3.child(eraserSettings);
    line3.child(brushSettings);

        //Color Slider CSS :
        redColorSlider.addClass("redColorSliderClass");
        greenColorSlider.addClass("greenColorSliderClass");
        blueColorSlider.addClass("blueColorSliderClass");
        alphaColorSlider.addClass("alphaColorSliderClass");
        eraserSettings.addClass("eraserSettingsClass");
        brushSettings.addClass("brushSettingsClass");

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
    r.unshift(redColorSlider.value());
    g.unshift(greenColorSlider.value());
    b.unshift(blueColorSlider.value());
    a.unshift(alphaColorSlider.value());

}

//----------------------------- Draw Function
function draw(){
    //Showing Selected Color
    noStroke();
    text("Brush Color", 10,30);
    textSize(20);
    fill(redColorSlider.value(),greenColorSlider.value(),blueColorSlider.value(),alphaColorSlider.value());
    rect(140,10,30,30);
}


//--------------------------------------- Mobile Detector
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};


//--------------------------------------- Setting Up Pointer For Touch
if(isMobileDevice() == true){

    function touchStarted(){
        if(mouseX >= 0 && mouseX <= windowx && mouseY >= 0 && mouseY <= windowy){
            radius = slider.value();
            mhx = [];
            mhy = [];
        
            mhx.unshift(mouseX);
            mhy.unshift(mouseY);
            lastradius.unshift(radius-4);
            r.unshift(redColorSlider.value());
            g.unshift(greenColorSlider.value());
            b.unshift(blueColorSlider.value());
            a.unshift(alphaColorSlider.value());
        }
    }

    function touchMoved(){
        if(mouseX >= 0 && mouseX <= windowx && mouseY >= 0 && mouseY <= windowy){
            mhx.unshift(mouseX);
            mhy.unshift(mouseY);

            stroke(r[0],g[0],b[0],a[0]);
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
            radius = slider.value();
            mhx = [];
            mhy = [];
            mhx.unshift(mouseX);
            mhy.unshift(mouseY);
            lastradius.unshift(radius-4);
            r.unshift(redColorSlider.value());
            g.unshift(greenColorSlider.value());
            b.unshift(blueColorSlider.value());
            a.unshift(alphaColorSlider.value());
        }
    }

    function mouseDragged(){
        if(mouseX >= 0 && mouseX <= windowx && mouseY >= 0 && mouseY <= windowy){
            mhx.unshift(mouseX);
            mhy.unshift(mouseY);
            
            stroke(r[0],g[0],b[0],a[0]);
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
    a = [];
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
    a.shift();
    lastBrush.shift();

    //Draws The Whole Drawing      *Very Important Function*
    for(var i = undoHistoryX.length - 1; i >= 0; i--){
        stroke(r[i],g[i],b[i],a[i]);
        strokeWeight(lastradius[i]);
        for(var j = 0; j < undoHistoryX[i].length; j++){
            line(undoHistoryX[i][j],undoHistoryY[i][j],undoHistoryX[i][j+1],undoHistoryY[i][j+1]);
        }
    }
}

//--------------------------------------- Eraser Setter
function setEraser(){
    redColorSlider.value(0);
    greenColorSlider.value(0);
    blueColorSlider.value(0);
    alphaColorSlider.value(255);
}

//--------------------------------------- Brush Setter
function setBrush(){
    redColorSlider.value(255);
    greenColorSlider.value(255);
    blueColorSlider.value(255);
    alphaColorSlider.value(255);
}

//--------------------------------------- Submit Button Function
function submit(){
    finalData = {
        drawX : undoHistoryX,
        drawY : undoHistoryY,
        redChannel : r,
        greenChannel : g,
        blueChannel : b,
        alphaChannel : a,
        radius : lastradius,
        canvasX : windowx,
        canvasY : windowy,
        username : username
    }
    databaseRef.push(finalData);
    alert("Thank You For Your Submission !");
}

//--------------------------------------- View Submission Button Function
function viewsub(){
    window.location.href = "ViewSubmissions.html";
}