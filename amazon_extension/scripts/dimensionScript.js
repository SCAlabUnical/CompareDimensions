//Default constructor
var DimensionScript = function(){}
   // var regexPATTERN =/[\d]*[.]{0,1}[\d]+ x [\d]*[.]{0,1}[\d]+ x [\d]*[.]{0,1}[\d]+/i;
   // var regexUnita=/([ ]{0,1}[(]{0,1}[ ]{0,1}(lu|l|la|a|p|h){1}[ ]{0,1}[x]{1}[ ]{0,1}(lu|l|la|a|p|h){1}[ ]{0,1}[x]{1}[ ]{0,1}(lu|l|la|a|p|h){1}[ ]{0,1}[)]{0,1}[ ]{0,1}){1}/gi
    //var regexcm =/([(]{0,1}[ ]{0,1}(l|lu|la|a|p|h){1}[ ]{0,1}[x]{1}[ ]{0,1}(l|lu|la|a|p|h){1}[ ]{0,1}[x]{1}[ ]{0,1}(l|lu|la|a|p|h){1}[ ]{0,1}[)]{0,1}[	]{0,1}[	]{0,1}){0,1}[\d]*[.]{0,1}[\d]+ x [\d]*[.]{0,1}[\d]+ x [\d]*[.]{0,1}[\d]+[ ]{0,1}(cm|mm|m|metri|centimetri|inches){1}[;]{0,1}([ ]{0,1}[(]{0,1}[ ]{0,1}(lu|l|la|a|p|h){1}[ ]{0,1}[x]{1}[ ]{0,1}(lu|l|la|a|p|h){1}[ ]{0,1}[x]{1}[ ]{0,1}(lu|l|la|a|p|h){1}[ ]{0,1}[)]{0,1}[ ]{0,1}){0,1}/gi;

/*
    The first pattern found of the type: lxpxh is usually the dimension of the product (in fact normally recommended product are at 
    the end of the page).
    So, we have the correct dimension of the product that we are looking for.
    In this sense we have a problem, or 2. Usually further size specifications (i.e. length, height, depth)
    are not specified at the top but at the bottom of the page: we have to find this second pattern eventually after the  
    first research when we have the correct information about the size.
*/
/*
    This is the main method that is invoked on the foreground page.
    It looks for the first pattern on dimensions without considering the one on sizes (length, width and height).
    It then searches for the complete pattern and returns the array with the dimensions sorted according to LxWxH.

*/
DimensionScript.prototype.findPatternDimension=function(){
    //find dimension
    var dimensionFound = this.firstResearch()[0].replace(/ /g,"").replace(/,/g,".");
    var regexWithUnits=/([ ]{0,1}[(]{0,1}[ ]{0,1}(lu|l|la|a|p|h|w){1}[ ]{0,1}[x]{1}[ ]{0,1}(lu|l|la|a|p|h|w){1}[ ]{0,1}[x]{1}[ ]{0,1}(lu|l|la|a|p|h|w){1}[ ]{0,1}[)]{0,1}[ ]{0,1}){1}/gi
    var regexUnits =/([(]{0,1}[ ]{0,1}(l|lu|la|a|h|p|w){1}[ ]{0,1}[x]{1}[ ]{0,1}(l|lu|la|a|p|h|w){1}[ ]{0,1}[x]{1}[ ]{0,1}(l|lu|la|a|p|h|w){1}[ ]{0,1}[)]{0,1}[	]{0,1}[ ]{0,1}){0,1}[\d]*[.,]{0,1}[\d]+[ ]{0,1}[x]{1}[ ]{0,1}[\d]*[.,]{0,1}[\d]+[ ]{0,1}[x]{1}[ ]{0,1}[\d]*[.,]{0,1}[\d]+[ ]{0,1}(mm|cm|m|metri|centimetri|inches){1}[;]{0,1}[ ]{0,1}([(]{0,1}[ ]{0,1}(l|lu|la|a|h|p|w){1}[ ]{0,1}[x]{1}[ ]{0,1}(l|lu|la|a|p|h|w){1}[ ]{0,1}[x]{1}[ ]{0,1}(l|lu|la|a|p|h|w){1}[ ]{0,1}[)]{0,1}[	]{0,1}[ ]{0,1}){0,1}/gi;
    //find all the pattern with units or not
    var dim=new Array();
    var elems = document.body.getElementsByTagName("*");
    for(var i=0; i<elems.length; i++){
        var text= elems[i].outerText;
        
        if(text!=null){
            var match=text.match(regexUnits);
            //there is a match
            if(match!=null){
               //console.log("MATCH: at tag "+i);
               //console.log("MATCH: "+match+" len= "+match.length);
               dim=dim.concat(match);
               //console.log("array dim at tag "+i+" --> "+dim); 
               //console.log("len= "+dim.length);      
            }
        }
       
    }
    //we have all occorrences
    var finalArray=this.removeDuplicates(dim);
  //  console.log("END --> "+finalArray);
  //  console.log("dimension first research "+dimensionFound);
    var res="";
    //found pattern if exists
    for(var i =0; i<finalArray.length; i++){
        //it matches with regex unit?
        var element= finalArray[i];
        element=element.replace(/ /g,"").replace(/,/g,".");
        if(element.match(regexWithUnits) && element.includes(dimensionFound)){
           // console.log("match with "+ element);
            res=element;
            //console.log("ris "+ res);
            break;
        }
    }
    //doesn't exits the pattern with dimension
    if(res==""){
       // console.log("---DEFAULT---")
        return this.processDimensionDefault(dimensionFound);
    } 
    //processing dimension 
    return this.processDimension(res);
    //in both cases return an array with the dimension in order 
}
/*
    It looks for the first pattern on dimensions without considering the one on sizes (length, width and height).
*/
DimensionScript.prototype.firstResearch=function(){
    var text = document.querySelector('body').outerText;
    //regex dimensioni in cm
    var regexcm =/[\d]*[.,]{0,1}[\d]+[ ]{0,1}[x]{1}[ ]{0,1}[\d]*[.,]{0,1}[\d]+[ ]{0,1}[x]{1}[ ]{0,1}[\d]*[.,]{0,1}[\d]+[ ]{0,1}(cm|mm|metri|centimetri|inches|m){1}[;]{0,1}/i;
    var testo_dimensioni=text.match(regexcm);
    return testo_dimensioni;

}

/*
    This method processes the string given in input returning an array containing the values sorted
    according to the LxWxH pattern.
    The values are to be considered in centimeters.
*/
DimensionScript.prototype.processDimensionDefault=function(dimension){
   // console.log("....process dimension default....");
    var unit=this.findUnit(dimension)[0].toLowerCase();
    var multiplicativeFactor=this.processUnit(unit);

    var result= new Array();
    var array = dimension.match(/[\d]*[.]{0,1}[\d]+/g);
    //height
    result.push(array[2]).toFixed(2);
    //length
    result.push(array[0]).toFixed(2);
     //depth
    result.push(array [1]).toFixed(2);
    for(var i=0; i<3;i++) result[i]=parseFloat(result[i]*multiplicativeFactor).toFixed(2);
    return result;
}

/*
    This method processes the string given in input returning an array containing the values sorted
    according to the size's pattern found.
    The values are to be considered in centimeters.
*/

DimensionScript.prototype.processDimension=function(pattern){
   // console.log(".....process dimension.....");
   // console.log(pattern);
    //find the unit
    var unit=this.findUnit(pattern)[0].toLowerCase();
    //find the multiplicative factor
    var multiplicativeFactor=this.processUnit(unit);
    //associate dimension to pattern dimension
    var arrayUDimension=this.findUDimension(pattern);
    //adapt in cm
    for(var i=0; i<3;i++) arrayUDimension[i]=parseFloat(arrayUDimension[i]*multiplicativeFactor).toFixed(2);

    return arrayUDimension;
}

/*
    This method looks for the unit of measure associated with the measures.
*/

DimensionScript.prototype.findUnit=function(pattern){
    var unit = /(cm|mm|m|inches)/gi
    return pattern.match(unit);
}

/*
    This method associates a multiplicative factor to the unit of measure in order
     to transform the quantities into centimeters.
*/
DimensionScript.prototype.processUnit=function(unit){
    var multiplicativeFactor=1;
    switch(unit){
        case "mm":
            multiplicativeFactor=0.1;
            break;
        case "m":
            multiplicativeFactor=100;
            break;
        case "inches":
            multiplicativeFactor=2.54;
            break;
        default:
            multiplicativeFactor=1;
            break;
    }
    return multiplicativeFactor;
}

/*
    This method returns the array of dimensions sorted according
    to LxWxH based on the letter-number order of the main pattern given in input.
*/
DimensionScript.prototype.findUDimension=function(pattern){
    var regexU=/(lu|l|la|a|p|h|w){1}x(lu|l|la|a|p|h|w){1}x(lu|l|la|a|p|h|w){1}/gi;
    var stringU=pattern.match(regexU)[0].toLowerCase();
    var arrayUnit=stringU.split("x");
    var arrayNumber = pattern.match(/[\d]*[.]{0,1}[\d]+/g);
    //console.log(arrayNumber);
    var result=new Array(3);
    for (var i=0; i<arrayUnit.length; i++){
        //console.log("nel for "+ arrayUnit[i])
        switch(arrayUnit[i]){
            case "l":
            case "lu":
            case "la":
                result[1]=arrayNumber[i];
                break;
            case "h":
            case "a":
                result[0]=arrayNumber[i];
                break;
            case "p":
            case "w":
                result[2]=arrayNumber[i];
                break;
            default:
                //console.log("BREAK DEFAULT!!!! >> NO GOOD");
                break;
        }
    }
   // console.log(result);
    return result;
    
}


DimensionScript.prototype.removeDuplicates=function(data){
    return [...new Set(data)];
}