//TODO CHECK PARENTHESES BALANCED

/*******************************************************************************
***************************** ENABLE VALID BUTTONS *****************************
*******************************************************************************/

var parentheses = 0;

function incrParentheses(){
    parentheses += 1;
}

function decrParentheses(){
    parentheses -= 1;
    toggleParentheses(1)
}

function toggle(){
    $(".buttons").toggleClass("highlight");
}

function toggleParentheses(onoff){
    if (onoff == 1 && parentheses > 0) $(".sbutton").addClass("highlight");
    else $(".sbutton").removeClass("highlight");
}

/*******************************************************************************
********************************* APPEND TO TR *********************************
*******************************************************************************/

function createTR(){
    var property = $("#property").val();
    var operator = $("#operator").val();
    var value = $("#literalvalue").val();
    if (! (parseInt(value).toString() == value)) value = '"' + value + '"';
    appendToTR(property + ' '+ operator + ' ' + value);
}

function appendToTR(tr){
    $("#TR").val($("#TR").val() + tr);
    $(".sbutton").removeClass("highlight");
}

/*******************************************************************************
******************************* COPY TO CLIPBOARD ******************************
*******************************************************************************/
$(document).ready(function() {

  ZeroClipboard.setDefaults( { moviePath: 'scripts/ZeroClipboard.swf' } );
  var clip = new ZeroClipboard($("#d_clip_button"));

  clip.on("ready", function() {
    debugstr("Flash movie loaded and ready.");

    this.on("aftercopy", function(event) {
      debugstr("Copied text to clipboard: " + event.data["text/plain"]);
    });
  });

  clip.on("error", function(event) {
    $(".demo-area").hide();
    debugstr('error[name="' + event.name + '"]: ' + event.message);
    ZeroClipboard.destroy();
  });


  // jquery stuff (optional)
  function debugstr(text) {
    $("#d_debug").append($("<p>").text(text));
  }

});

/*******************************************************************************
************************************* CLEAR ************************************
*******************************************************************************/

function clearTR(){
    $("#TR").val("");
    parentheses = 0;
    $(".sbutton").removeClass("highlight");
    if($("#button_add").attr('class').indexOf('highlight') == -1) toggle()
}

/*******************************************************************************
************************* TARGGETING RULES VALIDATION **************************
*******************************************************************************/

function validateTR(targeting_rule){
    var separator = /(\(|\)|<=|>=|>|<|==|!=|\s)/
    var replace = /(?:"[^\\"]*(\\"[^\\"]*)*"|'[^\\']*(\\'[^\\']*)*')/g
    var filter = function(arr){
        regexpr = /^\s*$/;
        return ! regexpr.test(arr)
    }
    var tr = targeting_rule.toLowerCase().replace(replace, '""').split(separator).filter(filter);
    alert (validateTR_recursion(tr, 0, 1));
}

function validate_tr(targeting_rule){
    var regexpr_tr = /^(EnvironmentId|Graphics.DriverProviderName|Graphics.HardwareID|Graphics.MatchingID|OS.Arch|OS.Version|System.Manufacturer|System.ProcessorId|System.Vendor|WIDI.AdapterModel|WiFi.BundleVersion|WiFi.DriverProviderName|WiFi.HardwareID){1}(<|>|==|<=|>=|!=|match){1}(\"\"$|\d+$)/i
    return regexpr_tr.test(targeting_rule)
}

function validateTR_recursion(targeting_rule, type, final){
    if(targeting_rule.length == 0 && final == 1) return true;
    else if (type == 0){
        var tr = targeting_rule.shift();
        if (tr == 'not' || tr == '(') return validateTR_recursion(targeting_rule, 0, 0);
        else {
            var isvalidtr = validate_tr(tr + targeting_rule.shift() + targeting_rule.shift());
            if (isvalidtr) return validateTR_recursion(targeting_rule, 1, 1);
            else return false
        };
    }
    else if (type == 1){
        var tr = targeting_rule.shift();
        if (tr == 'and' || tr == 'or') return validateTR_recursion(targeting_rule, 0, 0);
        else if (tr == ')') return validateTR_recursion(targeting_rule, 1, 1);
        else return false;
    }
    else return false;
}