/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// create the nodeType constants if the Node object is not defined
if (!window.Node){
  var Node =
      {
        ELEMENT_NODE                :  1,
        ATTRIBUTE_NODE              :  2,
        TEXT_NODE                   :  3,
        CDATA_SECTION_NODE          :  4,
        ENTITY_REFERENCE_NODE       :  5,
        ENTITY_NODE                 :  6,
        PROCESSING_INSTRUCTION_NODE :  7,
        COMMENT_NODE                :  8,
        DOCUMENT_NODE               :  9,
        DOCUMENT_TYPE_NODE          : 10,
        DOCUMENT_FRAGMENT_NODE      : 11,
        NOTATION_NODE               : 12
      };
}



var i18n = {};
i18n.__elements = ["span","p", "button"];//falten setters i remove, per poder-ho gestionar
/*i18n.__s = {//S'ha d'actualitzar dinamicament via ajax
    "ca_ES": {
        "First String": "Primera cadena",
        "Another piece of text": "Un altre text" ,
        "Text to translate": "Text a traduir",
        "Hello":"Hola",
        "Hello World":"Hola Mon"
    },
    "es_ES":{
    
        "First String": "Primera cadena",
        "Another piece of text": "Otro texto",
        "Text to translate": "Texto a traducir",
        "Hello":"Hola",
        "Hello World":"Hola Mundo"
    }
};*/
i18n.__s = { };

i18n.__lang_translation = {
    "ca":"ca_ES",
    "ca-ES":"ca_ES",
    "ca_ES":"ca_ES",
    "es":"es_ES",
    "es-ES":"es_ES",
    "es_ES":"es_ES",
    "en":"en_US",
    "en-US":"en_US",
    "en_US":"en_US"
};

i18n.__langExist = function (lang){
    language = i18n.__s[lang];
    return (language != undefined);
}
i18n.initialLang = function (){
    var lang = "";
    if (navigator.languages != undefined) {
        lang =  navigator.languages[0]; 
    } else { 
        lang =  navigator.language;
    }
    //TODO: S'haurai de fer un setLang? en comptes de retornar el lang?
    i18n.setLang(lang);
    return lang;
}
i18n.translate = function (){

    i18n.__elements.forEach(function(element){
        //Check if lang is in out i18 object
        $(element).each( function(){
            //if lang del dom != lang then translate
            local_lang = this.getAttribute("lang");
            translated = this.getAttribute("translated");
            if(local_lang != i18n.__lang || translated != "true"){
                var textToTranslate = this.getAttribute ("original-text");
                //guardar quantitat de  Nodes, per poder guardar 
                //Guardad la posició de cada node, si es un text o no. 
                //Guardar el text original de cada node si es un text. 
                //console.log(element.childNodes.length);
                //console.log(element.childNodes);
                //console.log(element.childNodes[0].nodeType);
                //Es pot fer de dos metodes, el primer intentar agafar tot el 
                //innetHtml, i mirar si es pot traduir tal qual. Si no es pot traduir així
                //es pot mirar de fer per troços. 
                //console.log(element.innerHtml);//Aixi s'agafa tot sencer.
                //sino agafem els nodes i mirem de traduir-los.
                
                //recursivament???
                
                if ( textToTranslate == null){
                    textToTranslate = this.textContent;
                    this.setAttribute ("original-text", this.textContent);
                }

                translation = _(textToTranslate);
                this.textContent= translation;

                this.setAttribute ("lang", i18n.__lang);
                this.setAttribute ("translated", "true");                
            }

        });
    });
}
i18n.__lang = "ca_ES";
i18n.__fileName = "translations.json";
i18n.path = function(lang){
    return "/i18/js/lang/"+lang+"/";
}
i18n.setLang = function (_lang){
    success = true;
    lang = i18n.__lang_translation[_lang];
    if(lang != undefined){

        if (i18n.__langExist(lang)){
            i18n.__lang = lang;
            i18n.translate();
        }else{
            $.ajax(i18n.path(lang)+i18n.__fileName)
            .done(function(data){

                i18n.__s[lang] = data;
                i18n.__lang = lang;
                i18n.translate();
            })
            .fail(function( jqXHR, textStatus, errorThrown){
                console.log("AJAX CALL ERROR");
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            });


            success = false;
        }  
    }else{
        console.warn("LET KNOW DEVELOPERS THIS LOCALE HAVE TO BE ADDED => ["+_lang+"] at http://www.i18n_javascript.io");
        sucess = false;
        //Enviar una crida ajax en un crud per afegir els locales no tinguts en compte en una base 
        //de dades, i contar quants cops s'ha cridat.
        //El crud hauria de mirar si la ultima versió existeix, si no existeix 
        //ho posa a la base de dades
    }
    
    return success;
}

i18n.initialLang();
//function _ = i18n._;

//i18n._ = function (s){   
function _(s){ 

    if (typeof(i18n)!='undefined' && i18n.__s[i18n.__lang][s]) {
        return i18n.__s[i18n.__lang][s];
    }else{
        console.warn("TRANSLATION MISSING: ["+s+"] ");
    }
    return s;
}

$( document ).ready(function() {


    btn_en = document.getElementById("en");
    btn_en.addEventListener("click",function(){
        i18n.setLang("en_US");
    });
    btn_ca = document.getElementById("ca");
    btn_ca.addEventListener("click",function(){
        i18n.setLang("ca_ES");
    });
    btn_es = document.getElementById("es");
    btn_es.addEventListener("click",function(){
        i18n.setLang("es_ES");
    });
    btn_ru = document.getElementById("ru");
    btn_ru.addEventListener("click",function(){
        i18n.setLang("ru");
    });
});

