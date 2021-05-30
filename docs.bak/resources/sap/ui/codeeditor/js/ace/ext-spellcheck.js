ace.define("ace/ext/spellcheck",["require","exports","module","ace/lib/event","ace/editor","ace/config"],function(e,t,n){"use strict";var i=e("../lib/event");t.contextMenuHandler=function(e){var t=e.target;var n=t.textInput.getElement();if(!t.selection.isEmpty())return;var o=t.getCursorPosition();var r=t.session.getWordRange(o.row,o.column);var s=t.session.getTextRange(r);t.session.tokenRe.lastIndex=0;if(!t.session.tokenRe.test(s))return;var c="";var l=s+" "+c;n.value=l;n.setSelectionRange(s.length,s.length+1);n.setSelectionRange(0,0);n.setSelectionRange(0,s.length);var a=false;i.addListener(n,"keydown",function e(){i.removeListener(n,"keydown",e);a=true});t.textInput.setInputHandler(function(e){console.log(e,l,n.selectionStart,n.selectionEnd);if(e==l)return"";if(e.lastIndexOf(l,0)===0)return e.slice(l.length);if(e.substr(n.selectionEnd)==l)return e.slice(0,-l.length);if(e.slice(-2)==c){var i=e.slice(0,-2);if(i.slice(-1)==" "){if(a)return i.substring(0,n.selectionEnd);i=i.slice(0,-1);t.session.replace(r,i);return""}}return e})};var o=e("../editor").Editor;e("../config").defineOptions(o.prototype,"editor",{spellcheck:{set:function(e){var n=this.textInput.getElement();n.spellcheck=!!e;if(!e)this.removeListener("nativecontextmenu",t.contextMenuHandler);else this.on("nativecontextmenu",t.contextMenuHandler)},value:true}})});(function(){ace.require(["ace/ext/spellcheck"],function(e){if(typeof module=="object"&&typeof exports=="object"&&module){module.exports=e}})})();