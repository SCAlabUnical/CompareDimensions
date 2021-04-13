/*
This class takes care of creating the graphics of the extension and managing the methods connected to it.
*/

/*
    Constructor:
        - dimensioni: array containing product dimension found by the method in dimensionScript.js
        - immagini: array containing product image URLs found by the method in imageScript.js
        - sagome: map with the references. The key is the local url of the image, the value is the dimensions.
*/
var Extension = function(dimensioni,immagini,sagome){
    this.dimensioniReali=dimensioni;
    //what is the first image to show in the slides of the product
    this.slideIndex = 1;
    //what is the first image to show in the slides of the references
    this.sagomeIndex=1;
    //the heigth
    this.altezza=dimensioni[0];
    //the width
    this.profondità=dimensioni[2];
    //the length
    this.larghezza=dimensioni[1];
    this.immagini=immagini;
    //id of the Chrome extension
    this.id=chrome.runtime.id;
    this.sagome=sagome;
    this.leftCorner="";
    this.is=new ImageScript();
    this.array= new Array();
}

/*
    This method creates the gui 
*/
Extension.prototype.inizializzazione = function(){
    var h= this.ridimensionaAltezza(this.altezza);
    var lar=this.ridimensionaLarghezza(this.larghezza);
    this.adjustCorner(lar);

    //------------- EXTENSION TITLE-------------------------------------------------------
    var container = document.createElement("div");
    container.id = "container_estensione";
    document.querySelector('#dp-container').appendChild(container);

    var estensione = document.createElement("div");
    estensione.id = "estensione";
    document.querySelector('#container_estensione').appendChild(estensione);

    var titolo = document.createElement('label');
    titolo.className = "titolo";
    titolo.innerText = "CompareSize Plugin";
    document.querySelector('#estensione').appendChild(titolo);
    //---------------------------------------------------------------------
    //--------------BOX WITH IMAGES--------------------
        //--------------SLIDE------------------------------
        var div2 = document.createElement("div");
        div2.id = "div_table";
        div2.className="mytableDiv";

        var table = document.createElement("table");
        table.border = '0';

        var tableBody = document.createElement('tbody');
        table.appendChild(tableBody);

        //------------------------------ROW 0-------------------------------------
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);

        //-----------------COLUMN 0--- Y AXIS-------------------------------------------------------------
        var td = document.createElement('TD');
        var metro = document.createElement("img");
        metro.id = "metro_y";
        metro.className = "metro";
        metro.style.backgroundImage = "url('chrome-extension://"+this.id+"/img/metro300y.jpg')";
        td.appendChild(metro);
        tr.appendChild(td);

        //------------------COLUMN 1----REFERENCES AND IMAGES--------------------------------------------------
        //COLUMN 0 --> REFERENCES
        var td = document.createElement('TD');

        var div_immagini = document.createElement('div');
        div_immagini.id = "div_sagome";
        div_immagini.className = "mySagomeDiv";
        var div_sagome2=document.createElement('div');
       // div_sagome2.className="mySagomeDiv";

        // REFERENCES SLIDE
        for (var [key,value] of this.sagome){
            
            var img1 = document.createElement("img");
            
            img1.className ="mySagome";
            img1.src="chrome-extension://"+this.id+"/img/sfondo-trasparente.png";
            img1.style.backgroundImage = "url('chrome-extension://"+this.id+key;
           
            var hi=this.ridimensionaAltezza(value.split(",")[0]);
            var li=this.ridimensionaLarghezza(value.split(",")[1]);
            //console.log(hi+","+li);
            img1.style.backgroundSize=li+"px "+hi+"px";
            img1.style.width=li+"px";
            img1.style.height=hi+"px";
           
            div_sagome2.appendChild(img1);
        };
        div_immagini.appendChild(div_sagome2);
        
        // COLONNA 1 --> PRODUCT SLIDE------
        
        var div_slide2=document.createElement('div');
        div_slide2.id="div_slide2";
        div_slide2.className = "mySlidesDiv";
       
        for (var i =0 ; i<this.immagini.length; i++){
            var img1=document.createElement("img");
            img1.className="mySlides";
            img1.crossOrigin = "Anonymous";
            img1.draggable="true";
            img1.className="mySlides";
            img1.style.backgroundSize=lar+"px "+h+"px";
            img1.style.width=lar+"px";
            img1.style.height=h+"px";          
            img1.src = this.immagini[i].replace(/['"]+/g,"");   
            this.array.push(img1);
            div_slide2.appendChild(img1);
        }
        
        div_immagini.appendChild(div_slide2);

        td.appendChild(div_immagini);
        tr.appendChild(td);
        
        //---------------------------------------------------------------------------------------
        
        //-----X AXIS -----ROW 1-----------------------------------------------------------------
        var tr2 = document.createElement('TR');
        tableBody.appendChild(tr2);
        //AN EMPTY COLUMN
        var td = document.createElement('TD');
        tr2.appendChild(td);
        //COLUMN 1 ROW 1
        var td = document.createElement('TD');
        var metro_y_sagoma= document.createElement("img");
        metro_y_sagoma.id="metro_x";
        metro_y_sagoma.style.backgroundImage = "url('chrome-extension://"+this.id+"/img/metro300x.jpg')";
        metro_y_sagoma.className="metro_x";
        td.appendChild(metro_y_sagoma);
        tr2.appendChild(td);
        //-----------------------------------------------------------------------------------------
        div2.appendChild(table);
        document.querySelector('#estensione').appendChild(div2);
        
        //---------------------TABLE WITH DIMENSION------------------------------------------
        var div_dimensioni = document.createElement('div');
        div_dimensioni.id = "div_dimensioni";
        div_dimensioni.className = "right";

        var tabledim = document.createElement("table");
        tabledim.style.border="1px solid blue";

        var tableBody = document.createElement('tbody');
        tabledim.appendChild(tableBody);

        //RIGA 0
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);
        var th = document.createElement("th");
        th.innerText = "Product size                               ";
        
        
        tr.appendChild(th);
        
    //-----------------REFRESH DIMENSION---------------------------
        var th = document.createElement("th");
        var refresh= document.createElement("button");
        refresh.id="refreshDim";
        refresh.className="refresh";
        refresh.style.backgroundImage="url('chrome-extension://"+this.id+"/img/refresh.png')";
        refresh.addEventListener('click', () => {
            this.refreshDim();
        });
        th.appendChild(refresh);
        //-----------------------------------------------------------
        tr.appendChild(th);

        var tr = document.createElement('TR');
        tableBody.appendChild(tr);
        var td = document.createElement('td');
       
        td.innerHTML = "   Length";
        tr.appendChild(td);
        var td = document.createElement('td');

        var larghezza = document.createElement("input");
        larghezza.id="larghezza";
        larghezza.type="text";
        larghezza.value=this.larghezza+" cm";
        td.appendChild(larghezza);

        tr.appendChild(td);

        var tr = document.createElement('TR');
        tableBody.appendChild(tr);
        var td = document.createElement('td');

        td.innerHTML = "   Width";
        tr.appendChild(td);
        var td = document.createElement('td');
        
        var profondita = document.createElement("input");
        profondita.id="profondita";
        profondita.type="text";
        profondita.value=this.profondità+" cm";
        td.appendChild(profondita);
        
        tr.appendChild(td);

        var tr = document.createElement('TR');
        tableBody.appendChild(tr);
        var td = document.createElement('td');
        
        td.innerHTML = "   Height";
        tr.appendChild(td);
        var td = document.createElement('td');

        var altezza = document.createElement("input");
        altezza.id="altezza";
        altezza.type="text";
        altezza.value=this.altezza+" cm";
        td.appendChild(altezza);

        tr.appendChild(td);

        div_dimensioni.appendChild(tabledim);
        //document.querySelector('#estensione').appendChild(div_dimensioni);
       // console.log("--->"+this.larghezza+" x "+this.profondità+" x "+this.altezza+" cm")


        //------------------- CECKBOX BUTTON ----------------------------------------------
        //-------LABEL SHOW REFERENCE SYSTEM----------------
        var label = document.createElement('label');
        label.htmlFor = 'ceckDim';
        label.innerText="   Show reference systems ";
        label.className="label";
        div_dimensioni.appendChild(label);
        //----------------------------------------------

        //-------check SHOW REFERENCE SYSTEM----------------
        var ceckDim = document.createElement("input");
        ceckDim.id="ceckDim";
        ceckDim.type="checkbox";
        ceckDim.className="check";
        ceckDim.addEventListener('click', () => {
            this.showDim();
        });
        div_dimensioni.appendChild(ceckDim);

        div_dimensioni.appendChild(document.createElement("br"));
        div_dimensioni.appendChild(document.createElement("br"));

        //-------LABEL SHOW measurements in inches----------------
        var labelUnit = document.createElement('label');
        labelUnit.htmlFor = 'changeUnit';
        labelUnit.innerText="   Show measurements in inches  ";
        labelUnit.className="label";
        div_dimensioni.appendChild(labelUnit);
        //----------------------------------------------
         //-------check SHOW measurements in inches-------------
        var changeUnit= document.createElement("input");
        changeUnit.id="changeUnit";
        changeUnit.type="checkbox";
        changeUnit.className="checkbox"
        changeUnit.addEventListener('click', () => {
            this.changeUnit();
        });
        div_dimensioni.appendChild(changeUnit);
        //-------------------------------------
        
        document.querySelector('#estensione').appendChild(div_dimensioni);

        //------------------------BOTTONI------------------------------------
         //--------------- NEXT E PREV---BUTTON------------------------------
         var div_bottoni= document.createElement('div');
         div_bottoni.className="divBottoni";
         var butt1 = document.createElement('button');
         butt1.id = "uno_s";
         butt1.style.backgroundImage="url('chrome-extension://"+this.id+"/img/rewind-button.png')";
         butt1.className = "prevS";
         butt1.addEventListener('click', () => {
            this.plusSagome(-1);
         });
          //pre
          
        div_bottoni.appendChild(butt1);
         var butt2 = document.createElement('button');
         butt2.id = "due_s"; 
         butt2.style.backgroundImage="url('chrome-extension://"+this.id+"/img/forward-button.png')";
         butt2.className = "nextS";
          
         butt2.addEventListener('click', () => {
              this.plusSagome(+1);
          });
  
          //next
          div_bottoni.appendChild(butt2);
        // tr1.appendChild(td);

        //---------------NEXT E PREV---BUTTON---------------------------------
        var butt1 = document.createElement('button');
        butt1.id = "uno";
        butt1.style.backgroundImage="url('chrome-extension://"+this.id+"/img/rewind-button.png')";
        butt1.className = "prev";
        butt1.addEventListener('click', () => {
            this.plusSlides(-1);
        });
        //pre
        
        div_bottoni.appendChild(butt1);
               
        var butt2 = document.createElement('button');
        butt2.id = "due"; 
        butt2.style.backgroundImage="url('chrome-extension://"+this.id+"/img/forward-button.png')";
        butt2.className = "next";
        
        butt2.addEventListener('click', () => {
            this.plusSlides(+1);
        });
        div_bottoni.appendChild(butt2);
        
        document.querySelector('#estensione').appendChild(div_bottoni);
        //------------------------------------------------------------------------------------------------   
}

/*
    This method attaches the white border removal method to
     images after they have been loaded successfully.
*/
Extension.prototype.attachOnLoad=function(){
    for(var j=0; j<this.array.length; j++){
        this.array[j].onload=onloadp(this.array[j]);
    }

}
function onloadp(img1){
    img1.src=new ImageScript().removeImageBlanks(img1);
};

/*
    This method takes care of showing the image of the right reference in the slide box.
*/
Extension.prototype.showSagome=function(n) {
    var i;
    var slides = document.getElementsByClassName("mySagome");
    if (n > slides.length) { this.sagomeIndex = 1}
    if (n < 1) { this.sagomeIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
         //To return the moved image to its place.
         slides[i].style.top="";
         slides[i].style.left="";
    }
    slides[ this.sagomeIndex-1].style.display = "block";
    //Add the ability to move the selected image
    this.dragElement(slides[this.sagomeIndex-1]);
}
// Next/previous controls reference
Extension.prototype.plusSagome=function(n) {

    this.showSagome( this.sagomeIndex += n);
}

// Thumbnail image controls reference
Extension.prototype.currentSagoma=function(n) {
  this.showSagome( this.sagomeIndex = n);
}


/*
    This function resizes the height of the image.
    If the pixels are greater than the maximum height given to the image container,
     they are set to the maximum value.
*/

Extension.prototype.ridimensionaAltezza=function(altezza){
    var h=(705*altezza)/300;
    if(h>700) return 700;
    else return h;
}

/*
    This function resizes the length of the image.
    If the pixels are greater than the maximum length given to the image container,
     they are set to the maximum value.
*/

Extension.prototype.ridimensionaLarghezza=function(larghezza){
    var l= (690*larghezza)/300;
    return l>690?690:l;
}

// For the slide of the product images (similar to that of the references).

Extension.prototype.showSlides=function(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    
    if (n > slides.length) {this.slideIndex = 1}
    if (n < 1) {this.slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        //PER RIPORTARE L'IMMAGINE SPOSTATA AL POSTO
        slides[i].style.top="";
        slides[i].style.left=this.leftCorner;

    }
        
    slides[this.slideIndex-1].style.display = "block";
    this.dragElement(slides[this.slideIndex-1]);
}
// Next/previous controls
Extension.prototype.plusSlides=function(n) {
    this.showSlides(this.slideIndex += n);
}

// Thumbnail image controls
Extension.prototype.currentSlide=function(n) {
  this.showSlides(this.slideIndex = n);
}

//-------------------DRAG ELEMENT----------------------------------------------------------
var PADDING = 3;

var rect;
var viewport = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0
}

Extension.prototype.dragElement=function(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
     
      
    }
  
    function dragMouseDown(e) {
     
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        //-------------------------------------
        rect = elmnt.getBoundingClientRect();
        viewport.bottom = 705 - PADDING;
        viewport.left = PADDING;
        viewport.right = 698 - PADDING;
        viewport.top = PADDING;
        //------------------------------------
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // check to make sure the element will be within our viewport boundary
        var newLeft = elmnt.offsetLeft - pos1;
        var newTop = elmnt.offsetTop - pos2;

        if (newLeft < viewport.left
            || newTop < viewport.top
            || newLeft + rect.width > viewport.right
            || newTop + rect.height > viewport.bottom
        ) {
            // the element will hit the boundary, do nothing...
        } else {
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
   
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
}

//--------------function of check box---------------------------------------------------
//-----------SHOW REFERENCE SYSTEM------------------------------------------------------
Extension.prototype.showDim=function(){
    var checkBox = document.getElementById("ceckDim");
    var metri_x = document.getElementById("metro_x");
    var metri_y=document.getElementById("metro_y");
    var checkBoxMis = document.getElementById("changeUnit");
    //If both buttons are selected then it is necessary to show the axes with inches as the unit of measurement.
    if (checkBox.checked == true && checkBoxMis.checked==true){
            metri_y.style.backgroundImage = "url('chrome-extension://"+this.id+"/img/metro_inches_y.PNG')";
            metri_x.style.backgroundImage = "url('chrome-extension://"+this.id+"/img/metro_inches_x.PNG')";
            metri_x.style.display = "block";
            metri_y.style.display = "block";
    }
    //If only the "show reference system" button is selected then it is necessary
    // to show the axes with centimeters as the unit of measurement.
    else if(checkBox.checked == true && checkBoxMis.checked==false){
            metri_y.style.backgroundImage = "url('chrome-extension://"+this.id+"/img/metro300y.jpg')";
            metri_x.style.backgroundImage = "url('chrome-extension://"+this.id+"/img/metro300x.jpg')";
            metri_x.style.display = "block";
            metri_y.style.display = "block";
    }
    //Hide the axes.
     else {
            metri_x.style.display = "none";
            metri_y.style.display = "none";
    }   
}

//----------- SHOW measurements in inches------------------------------------------------------
Extension.prototype.changeUnit=function(){
    var checkBox = document.getElementById("changeUnit");
    var altezza= document.getElementById("altezza");
    var larghezza=document.getElementById("larghezza");
    var profondita=document.getElementById("profondita");
   // If the button is selected convert the measurements into inches
    if (checkBox.checked == true){
        altezza.value=parseFloat(this.altezza/2.54).toFixed(2)+" inches";
        larghezza.value=parseFloat(this.larghezza/2.54).toFixed(2)+" inches";
        profondita.value=parseFloat(this.profondità/2.54).toFixed(2)+" inches";
    }   
    else {
        altezza.value=this.altezza+" cm";
        larghezza.value=this.larghezza+" cm";
        profondita.value=this.profondità+" cm";
    }
    var checkBoxDim = document.getElementById("ceckDim");
   // console.log(checkBoxDim)
    //If both buttons are selected then it is necessary to show the axes with inches as the unit of measurement.
    if(checkBox.checked == true && checkBoxDim.checked==true){
       // console.log("ciao")
        var metri_x = document.getElementById("metro_x");
        var metri_y=document.getElementById("metro_y");
        metri_y.style.backgroundImage = "url('chrome-extension://"+this.id+"/img/metro_inches_y.PNG')";
        metri_x.style.backgroundImage = "url('chrome-extension://"+this.id+"/img/metro_inches_x.PNG')";
    }
    //If only the "show reference system" button is selected then it is necessary
    // to show the axes with centimeters as the unit of measurement.
    if(checkBox.checked == false && checkBoxDim.checked==true){
        var metri_x = document.getElementById("metro_x");
        var metri_y=document.getElementById("metro_y");
        metri_y.style.backgroundImage = "url('chrome-extension://"+this.id+"/img/metro300y.jpg')";
        metri_x.style.backgroundImage = "url('chrome-extension://"+this.id+"/img/metro300x.jpg')";
    }

}

//--------Change dimension--------------------------------------------------------------------
/*
    This method resizes the images to the new size entered by the user.
*/
Extension.prototype.changeDimension=function(){
    var h=document.getElementById("altezza").value.replace(/(cm|inches)/g,"");
    var l=document.getElementById("larghezza").value.replace(/(cm|inches)/g,"");
    var p=document.getElementById("profondita").value.replace(/(cm|inches)/g,"");
    var checkBox = document.getElementById("changeUnit");
    if (checkBox.checked == true){
        this.altezza= parseFloat(h*2.54).toFixed(2);
        this.larghezza= parseFloat(l*2.54).toFixed(2);
        this.profondità=parseFloat(p*2.54).toFixed(2);
    }   
    else {
        this.altezza= h;
        this.larghezza=l; 
        this.profondità=p;
    }
    //   resize
    var nuovaAL= this.ridimensionaAltezza(this.altezza);
    var nuovaLa= this.ridimensionaLarghezza(this.larghezza);
    this.adjustCorner(nuovaLa);
    var slides= document.getElementsByClassName("mySlides");

    for (i = 0; i < slides.length; i++) {
        slides[i].style.backgroundSize=nuovaLa+"px "+nuovaAL+"px";
        //TO UNIFORM THE SIZE OF THE IMAGE CONTAINER
        slides[i].style.width=nuovaLa+"px";
        slides[i].style.height=nuovaAL+"px";
        slides[i].style.top=700-nuovaAL+"px";
        slides[i].style.left=this.leftCorner;
    }
    
}
/*
    This method returns the object to its original size.
*/
Extension.prototype.refreshDim=function(){
    this.altezza= this.dimensioniReali[0];
    this.larghezza= this.dimensioniReali[1];
    this.profondità=this.dimensioniReali[2];

    var checkBox = document.getElementById("changeUnit");
    if (checkBox.checked == true){
        document.getElementById("altezza").value=parseFloat(this.altezza/2.54).toFixed(2)+" inches";
        document.getElementById("larghezza").value=parseFloat(this.larghezza/2.54).toFixed(2)+" inches";
        document.getElementById("profondita").value=parseFloat(this.profondità/2.54).toFixed(2)+" inches";
    }   
    else {
        document.getElementById("altezza").value=this.altezza+" cm";
        document.getElementById("larghezza").value=this.larghezza+" cm";
        document.getElementById("profondita").value=this.profondità+" cm";
    }   
  

    var nuovaAL= this.ridimensionaAltezza(this.altezza);
    var nuovaLa= this.ridimensionaLarghezza( this.larghezza);

    var slides= document.getElementsByClassName("mySlides");
    this.adjustCorner(nuovaLa);
    for (i = 0; i < slides.length; i++) {
        slides[i].style.backgroundSize=nuovaLa+"px "+nuovaAL+"px";
        slides[i].style.width=nuovaLa+"px";
        slides[i].style.height=nuovaAL+"px";
        slides[i].style.top=700-nuovaAL+"px";
        slides[i].style.left=this.leftCorner;
    }
}

Extension.prototype.adjustCorner=function(width){
    if(width==690)  this.leftCorner="0px";
    this.leftCorner=685-width+"px";
}
