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
let msgbox; //Div For 'Thank you' Dialog Box

function setup(){
    //Window Setup
    isMobileDevice();
    windowx = 0.95 * windowWidth;
    windowy = windowHeight * 1.4;

    canvas1 = createCanvas(windowx, windowy);
    canvas2 = createGraphics(windowx, windowy);
    canvas2.clear();

    background(0);
    canvas1.parent("sketchcontainer");
    canvas2.parent("sketchcontainer");

    //Database Setup
    var storage = firebase.storage();
    var database = firebase.database();
    imgStorageRef = storage.ref("gifts/");
    databaseRef = database.ref("gifts/");

    //-------------v------------------ All The CSS ---------------v----------------//
    
    //Empty Space
    createElement("br");

    //Line 1 Canvas
    var line1 = createDiv();
    line1.style("align","center");

    //Slider
    var sliderdiv = createDiv("BRUSH SIZE :");
    slider = createSlider(10,70,50);
    slider.addClass('sliderClass');
    sliderdiv.child(slider);
        //Slider Style
        sliderdiv.style("color","black");
        sliderdiv.style("font-size","34px");
        sliderdiv.style("font-family","Century Gothic");
        sliderdiv.style("align","center");
        slider.style("-webkit-appearance","none");
        slider.style("width",0.50 * windowx+"px");
        slider.style("height","13px");
        slider.style("cursor","pointer");
        slider.style("border-radius","20px");
        slider.style("outline","none");
        slider.style("background","#d3d3d3");
        slider.style("margin-left","20px");

    //Undo Button
    var undo = createButton("Undo");
    sliderdiv.child(undo);
    undo.mousePressed(undofunc);
        //Undo Button css
        undo.style("-webkit-appearance","none");
        undo.style("border-radius","5px");
        undo.style("background-color","#ff0000");
        undo.style("color","#ffffff");
        undo.style("font-size","34px");
        undo.style("font-family","Century Gothic");
        undo.style("margin-right","10px");
        undo.style("margin-left","20px");
        undo.style("margin-right","20px");

    //Clear Button
    var clear = createButton("Clear");
    sliderdiv.child(clear);
    clear.mousePressed(clearfunc);
        //Css
        clear.style("-webkit-appearance","none");
        clear.style("border-radius","5px");
        clear.style("background-color","#ff0000");
        clear.style("color","#ffffff");
        clear.style("font-size","34px");
        clear.style("font-family","Century Gothic");

    //Setting Up Line 1 Div
    line1.child(sliderdiv);

    //Line 2 div
    var line2 = createDiv();
    line2.style("clear","both");
    line2.style("align","center");

    //Line 3 Div
    var line3 = createDiv();
    line3.style("clear","both");
    line3.style("align","center");

    //Color Sliders
    colorSlider = createDiv("COLOR : ");
    redColorSlider = createSlider(0,255,255);
    greenColorSlider = createSlider(0,255,255);
    blueColorSlider = createSlider(0,255,255);
    alphaColorSlider = createSlider(0,255,255);
    eraserSettings = createButton("Set Eraser");
    brushSettings = createButton("Set Brush");
    
    line2.child(colorSlider);
    colorSlider.child(redColorSlider);
    colorSlider.child(greenColorSlider);
    colorSlider.child(blueColorSlider);
    colorSlider.child(alphaColorSlider);
    line3.child(eraserSettings);
    line3.child(brushSettings);

        //Color Slider CSS :
        colorSlider.style("align","center");
        colorSlider.style("font-size","34px");
        colorSlider.style("font-family","Century Gothic");
        colorSlider.style("float","left");
        redColorSlider.addClass("redColorSliderClass");
        greenColorSlider.addClass("greenColorSliderClass");
        blueColorSlider.addClass("blueColorSliderClass");
        alphaColorSlider.addClass("alphaColorSliderClass");
        eraserSettings.addClass("eraserSettingsClass");
        brushSettings.addClass("brushSettingsClass");

    //Submit Buttons
    buttonDiv = createDiv();
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
    //Intialization
    background(0);
    // radius = slider.value();
    
    //overlay Canvas
    image(canvas2,0,0);
    canvas2.fill(255);
    canvas2.noStroke();

    //Actual Canvas
    if(isMobileDevice() == false){
        stroke(255,0,0);
        strokeWeight(4);
        fill(redColorSlider.value(),greenColorSlider.value(),blueColorSlider.value());
        ellipse(mouseX,mouseY,slider.value(),slider.value());
    }

    //Showing Selected Color
    noStroke();
    text("Brush Color", 10,30);
    textSize(20);
    fill(redColorSlider.value(),greenColorSlider.value(),blueColorSlider.value(),alphaColorSlider.value());
    rect(120,10,30,30);
}


//--------------------------------------- Mobile Detector
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};


//--------------------------------------- Setting Up Pointer For Touch
if(isMobileDevice() == true){

    function touchStarted(){
        if(mouseX >= 0 && mouseX <= windowx && mouseY >= 0 && mouseY <= windowy){
            mhx = [];
            mhy = [];
        
            mhx.unshift(mouseX);
            mhy.unshift(mouseY);
            lastradius.unshift(slider.value());
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

            canvas2.stroke(r[0],g[0],b[0],a[0]);
            canvas2.strokeWeight(slider.value()-4);
            canvas2.line(mhx[0],mhy[0],mhx[1],mhy[1]);
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
            mhx = [];
            mhy = [];
            mhx.unshift(mouseX);
            mhy.unshift(mouseY);
            lastradius.unshift(slider.value());
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
            
            canvas2.stroke(r[0],g[0],b[0],a[0]);
            canvas2.strokeWeight(slider.value()-4);
            canvas2.line(mhx[0],mhy[0],mhx[1],mhy[1]);
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
    canvas2.clear();
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
    canvas2.clear();
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
        canvas2.stroke(r[i],g[i],b[i],a[i]);
        canvas2.strokeWeight(lastradius[i]-4);
        for(var j = 0; j < undoHistoryX[i].length; j++){
            canvas2.line(undoHistoryX[i][j],undoHistoryY[i][j],undoHistoryX[i][j+1],undoHistoryY[i][j+1]);
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