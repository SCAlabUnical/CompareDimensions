/*
   This class contains methods for images retrieval and pixel manipulation. 
*/

//Default constructor
var ImageScript = function(){}

/*
    This method deals with the retrieval of images.
    Returns an array containing the image references.
*/
ImageScript.prototype.cercaImmagini= function(){
    var scripts=document.getElementsByTagName('script');
    var array=null;
    var documento=null;

    //regex to search for the script that contains the images
    var regex =/(P\.when\('A'\)\.register)([\W\S_])*/g;
    
    for (var i=0; i<scripts.length; i++){
        if(scripts[i].innerHTML.match(regex)){
            documento=scripts[i].innerHTML;
            break;
        }
    }
    var array= new Array();
    //if it finds the document, it takes the images
    //images are associated with URLs. Each image has several URLs that correspond to different resolutions
    //we take those with large tags
    if (documento!=null){
        var regexim=/"large":"https:\/\/images-na\.ssl-images-amazon\.com\/images\/([^"]*)"/g;
        array = documento.match(regexim);
       
        if(array!=null){
            for(var i=0; i< array.length; i++){
                array[i]=array[i].replace("\"large\":","");
            }
        }
        //If the array is empty, we search for images with thumb tags
        else{
            var regexim=/"thumb":"https:\/\/images-na\.ssl-images-amazon\.com\/images\/([^"]*)"/g
        
            array = documento.match(regexim);
           // console.log(array+ "thumb")
            if(array!=null){
                for(var i=0; i< array.length; i++){
                    array[i]=array[i].replace("\"thumb\":","");
                }
            }
        }
    }
    // if it does not find the document or the images, we insert the path of a help image in the array
    else if(documento==null || array.length==0){
        array=new Array();
        array.push("chrome-extension://acbimkejopbidopjjhkejjjpopahgomj/img/cubo1.png");
    }
    return array;

}
/*
    This method takes care of cutting any white border around the images taken by amazon.
    It is used to avoid distorting image resizing.
*/
ImageScript.prototype.removeImageBlanks=function(imageObject) {
    //An input image canvas object is created to manipulate pixels
    var imgWidth = imageObject.width;
    var imgHeight = imageObject.height;
    var canvas = document.createElement('canvas');
    canvas.width=imgWidth;
    canvas.height=imgHeight;    
    var context = canvas.getContext('2d');
    context.drawImage(imageObject, 0, 0);

    //
    var imageData = context.getImageData(0, 0, imgWidth, imgHeight),
        data = imageData.data,
        getRBG = function(x, y) {
            var offset = imgWidth * y + x;
            return {
                red:     data[offset * 4],
                green:   data[offset * 4 + 1],
                blue:    data[offset * 4 + 2],
                opacity: data[offset * 4 + 3]
            };
        },
        isWhite = function (rgb) {
            // many images contain noise, as the white is not a pure #fff white
            return rgb.red > 200 && rgb.green > 200 && rgb.blue > 200;
        },
        scanY = function (fromTop) {
            var offset = fromTop ? 1 : -1;

            // loop through each row
            for(var y = fromTop ? 0 : imgHeight - 1; fromTop ? (y < imgHeight) : (y > -1); y += offset) {

                // loop through each column
                for(var x = 0; x < imgWidth; x++) {
                    var rgb = getRBG(x, y);
                    if (!isWhite(rgb)) {
                        if (fromTop) {
                            return y;
                        } else {
                            return Math.min(y + 1, imgHeight);
                        }
                    }
                }
            }
            return null; // all image is white
        },
        scanX = function (fromLeft) {
            var offset = fromLeft? 1 : -1;

            // loop through each column
            for(var x = fromLeft ? 0 : imgWidth - 1; fromLeft ? (x < imgWidth) : (x > -1); x += offset) {

                // loop through each row
                for(var y = 0; y < imgHeight; y++) {
                    var rgb = getRBG(x, y);
                    if (!isWhite(rgb)) {
                        if (fromLeft) {
                            return x;
                        } else {
                            return Math.min(x + 1, imgWidth);
                        }
                    }      
                }
            }
            return null; // all image is white
        };

    var cropTop = scanY(true),
        cropBottom = scanY(false),
        cropLeft = scanX(true),
        cropRight = scanX(false),
        cropWidth = cropRight - cropLeft,
        cropHeight = cropBottom - cropTop;
        
    canvas.setAttribute("width", cropWidth);
    canvas.setAttribute("height", cropHeight);
        // finally crop the guy
    canvas.getContext("2d").drawImage(imageObject,
            cropLeft, cropTop, cropWidth, cropHeight,
            0, 0, cropWidth, cropHeight);
    return canvas.toDataURL('image/png');
}
