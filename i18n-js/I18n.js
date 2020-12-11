

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



class I18n {
    
    _elements = ["span","p", "button"];//falten setters i remove, per poder-ho gestionar
    _s = { };
    _lang_translation = {
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
    _lang = "ca_ES";
    _fileName = "translations.json";
    
    constructor(){
        console.log("I18n created!");
    }
  
  
    setLang (_lang){
        let success = true;
        let lang = this._lang_translation[_lang];
        if(lang != undefined){

            if (this._langExist(lang)){
                this._lang = lang;
                this.translate();
            }else{
                $.ajax({
                    url:this.path(lang)+this._fileName,
                    context:this
                })
                .done(function(data){

                    this._s[lang] = data;
                    this._lang = lang;
                    this.translate();
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
            success = false;
            //Enviar una crida ajax en un crud per afegir els locales no tinguts en compte en una base 
            //de dades, i contar quants cops s'ha cridat.
            //El crud hauria de mirar si la ultima versió existeix, si no existeix 
            //ho posa a la base de dades
        }

        return success;
    }
    
    _langExist (lang){
        let language = this._s[lang];
        return (language != undefined);
    }
    initialLang (){
        var lang = "";
        if (navigator.languages != undefined) {
            lang =  navigator.languages[0]; 
        } else { 
            lang =  navigator.language;
        }

        this.setLang(lang);
        return lang;
    }    
    path (lang){
        return "/i18/js/lang/"+lang+"/";
    }    
    
    translate (){
        var _this = this;
        this._elements.forEach(function(element){
            //Check if lang is in out i18 object
            $(element).each( function(){
                //if lang del dom != lang then translate
                var local_lang = this.getAttribute("lang");
                var translated = this.getAttribute("translated");
                if(local_lang != _this._lang || translated != "true"){
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

                    var translation = _(textToTranslate);
                    this.textContent= translation;

                    this.setAttribute ("lang", _this._lang);
                    this.setAttribute ("translated", "true");                
                }

            });
        });
    }
}

const i18n = new I18n();
i18n.initialLang();

function _(s){
    if (typeof(i18n)!='undefined' && i18n._s[i18n._lang][s]) {
        return i18n._s[i18n._lang][s];
    }else{
        console.warn("TRANSLATION MISSING: ["+s+"] ");
    }
    return s;
}

//######################################################
//######################################################
//######################################################
//######################################################
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