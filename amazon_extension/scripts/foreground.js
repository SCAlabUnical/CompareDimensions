if(document.querySelector('#container_estensione')==null){
    //--------------------------------------------SAGOME--------------------------------------------------------------------
    var sagome= new Map();
    sagome.set("/img/uomo2.png","175,54");
    sagome.set("/img/donnan.png","165,45");
    sagome.set("/img/adolescented.png","150,40");
    sagome.set("/img/sagoma_bambino.png","100,32");
    sagome.set("/img/baby.png","50,50");
    sagome.set("/img/sediascuola.png","95,50");
    sagome.set("/img/home_chair.png","82,40");
    sagome.set("/img/door.png","210,80");

    //------------------------------------------DIMENSIONS---------------------------------------------------------------------------

    var dimensioni = new DimensionScript();
    var arrayDimensioni = dimensioni.findPatternDimension();
    
    //--------------------------------------------IMAGES---------------------------------------------------------------------------

    var img = new ImageScript();
    var immagini=img.cercaImmagini();

    //-------------------------------------------COMPONENT CREATION------------------------------------------------------------------
    var estensione= new Extension(arrayDimensioni,immagini,sagome);
    estensione.inizializzazione();
     
    window.addEventListener("load", function(){
        estensione.attachOnLoad();
        estensione.showSlides(1);
        estensione.showSagome(1);
    }); 
    document.addEventListener("keyup", function(event){
        if(event.keyCode==13 ){
            estensione.changeDimension();
        }
        
    })
}