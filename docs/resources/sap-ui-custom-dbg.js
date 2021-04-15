//@ui5-bundle sap-ui-custom-dbg.js
//@ui5-bundle-raw-include ui5loader.js
/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
(function(e){"use strict";if(e.Promise===undefined||!e.Promise.prototype.finally||e.URLSearchParams===undefined){var r=document.documentElement,t=r.style,n="Microsoft Internet Explorer 11 and other legacy browsers are no longer supported. For more information, see ",o="Internet Explorer 11 will no longer be supported by various SAP UI technologies in newer releases",i="https://blogs.sap.com/2021/02/02/internet-explorer-11-will-no-longer-be-supported-by-various-sap-ui-technologies-in-newer-releases/";r.innerHTML='<body style="margin:0;padding:0;overflow-y:hidden;background-color:#f7f7f7;text-align:center;width:100%;position:absolute;top:50%;transform:translate(0,-50%);"><div style="color:#32363a;font-family:Arial,Helvetica,sans-serif;font-size:.875rem;">'+n+'<a href="'+i+'" style="color:#4076b4;">'+o+"</a>.</div></body>";t.margin=t.padding="0";t.width=t.height="100%";if(e.stop){e.stop()}else{document.execCommand("Stop")}throw new Error(n+i)}})(window);(function(__global){"use strict";function pathOnly(e){var r=e.search(/[?#]/);return r<0?e:e.slice(0,r)}function docBase(){return pathOnly(document.baseURI)}var isIE11=false;var resolveURL=function(e){try{new e("index.html","http://localhost:8080/")}catch(r){isIE11=true;e=null}if(e){return function(r,t){return new e(r,t?new e(t,docBase()):docBase()).toString()}}var r=document.implementation.createHTMLDocument("Dummy doc for resolveURI");var t=r.createElement("base");t.href=docBase();r.head.appendChild(t);var n=r.createElement("A");r.body.appendChild(n);return function(e,r){t.href=docBase();if(r!=null){n.href=r;t.href=n.href}n.href=e;return n.href}}(__global.URL||__global.webkitURL);function noop(){}function forEach(e,r){Object.keys(e).forEach(function(t){r(t,e[t])})}function executeInSeparateTask(e){setTimeout(e,0)}function executeInMicroTask(e){Promise.resolve().then(e)}var log={debug:noop,info:noop,warning:noop,error:noop,isLoggable:noop};var assert=noop;var measure;var translate;var simulateAsyncCallback=executeInSeparateTask;var strictModuleDefinitions=true;var bGlobalAsyncMode=false;var bExposeAsAMDLoader=false;var syncCallBehavior=0;var DEFAULT_BASE_URL="./";var vOriginalDefine;var vOriginalRequire;var mUrlPrefixes=Object.create(null);mUrlPrefixes[""]={url:DEFAULT_BASE_URL,absoluteUrl:resolveURL(DEFAULT_BASE_URL,document.baseURI)};var mMaps=Object.create(null),mShims=Object.create(null),mDepCache=Object.create(null),bDebugSources=false,fnIgnorePreload;var mModules=Object.create(null),bForceSyncDefines=null,_execStack=[],sLogPrefix="",iAnonymousModuleCount=0,MAX_EXEC_SCRIPT_LENGTH=512*1024;function urnToUI5(e){if(!/\.js$/.test(e)){return undefined}e=e.slice(0,-3);if(/^jquery\.sap\./.test(e)){return e}return e.replace(/\//g,".")}function urnToIDAndType(e){var r=e.lastIndexOf("/"),t=e.lastIndexOf(".");if(t>r){return{id:e.slice(0,t),type:e.slice(t)}}return{id:e,type:""}}var rJSSubTypes=/(\.controller|\.fragment|\.view|\.designtime|\.support)?.js$/;function urnToBaseIDAndSubType(e){var r=rJSSubTypes.exec(e);if(r){return{baseID:e.slice(0,r.index),subType:r[0]}}}var rDotSegmentAnywhere=/(?:^|\/)\.+(?=\/|$)/;var rDotSegment=/^\.*$/;function normalize(e,r){var t=e.search(rDotSegmentAnywhere),n,o,i,a,l;if(t<0){return e}if(t===0){if(r==null){throw new Error("relative name not supported ('"+e+"'")}e=r.slice(0,r.lastIndexOf("/")+1)+e}n=e.split("/");for(i=0,a=0,l=n.length;i<l;i++){o=n[i];if(rDotSegment.test(o)){if(o==="."||o===""){continue}else if(o===".."){if(a===0){throw new Error("Can't navigate to parent of root ('"+e+"')")}a--}else{throw new Error("Illegal path segment '"+o+"' ('"+e+"')")}}else{n[a++]=o}}n.length=a;return n.join("/")}function registerResourcePath(e,r){e=String(e||"");if(r==null){if(e){if(mUrlPrefixes[e]){delete mUrlPrefixes[e];log.info("registerResourcePath ('"+e+"') (registration removed)")}return}r=DEFAULT_BASE_URL;log.info("registerResourcePath ('"+e+"') (default registration restored)")}r=pathOnly(String(r));if(r.slice(-1)!=="/"){r+="/"}mUrlPrefixes[e]={url:r,absoluteUrl:resolveURL(r)}}function getResourcePath(e,r){var t=e,n=e.length,o;while(n>0&&!mUrlPrefixes[t]){n=t.lastIndexOf("/");t=n>0?t.slice(0,n):""}assert((n>0||t==="")&&mUrlPrefixes[t],"there always must be a mapping");o=mUrlPrefixes[t].url+e.slice(n+1);if(o.slice(-1)==="/"){o=o.slice(0,-1)}return o+(r||"")}function getSyncCallBehavior(){return syncCallBehavior}function guessResourceName(e){var r,t,n;e=pathOnly(resolveURL(e));for(r in mUrlPrefixes){t=mUrlPrefixes[r].absoluteUrl.slice(0,-1);if(e.indexOf(t)===0){n=r+e.slice(t.length);if(n.charAt(0)==="/"){n=n.slice(1)}if(mModules[n]&&mModules[n].data!=undefined){return n}}}}function findMapForContext(e){var r,t;if(e!=null){e=urnToIDAndType(e).id;r=e.length;t=mMaps[e];while(r>0&&t==null){r=e.lastIndexOf("/");if(r>0){e=e.slice(0,r);t=mMaps[e]}}}return t||mMaps["*"]}function getMappedName(e,r){var t=findMapForContext(r),n,o;e=normalize(e,r);if(t!=null){n=urnToIDAndType(e).id;o=n.length;while(o>0&&t[n]==null){o=n.lastIndexOf("/");n=o>0?n.slice(0,o):""}if(o>0){if(log.isLoggable()){log.debug("module ID "+e+" mapped to "+t[n]+e.slice(o))}return t[n]+e.slice(o)}}return e}function getGlobalObject(e,r,t,n){for(var o=0;e&&o<t;o++){if(!e[r[o]]&&n){e[r[o]]={}}e=e[r[o]]}return e}function getGlobalProperty(e){var r=e?e.split("."):[];if(syncCallBehavior&&r.length>1){log.error("[nosync] getGlobalProperty called to retrieve global name '"+e+"'")}return getGlobalObject(__global,r,r.length)}function setGlobalProperty(e,r){var t=e?e.split("."):[],n;if(t.length>0){n=getGlobalObject(__global,t,t.length-1,true);n[t[t.length-1]]=r}}function wrapExport(e){return{moduleExport:e}}function unwrapExport(e){return e.moduleExport}var INITIAL=0,PRELOADED=-1,LOADING=1,LOADED=2,EXECUTING=3,READY=4,FAILED=5,NOT_YET_DETERMINED={};function Module(e){this.name=e;this.state=INITIAL;this.settled=false;this.url=this._deferred=this.data=this.group=this.error=this.pending=null;this.content=NOT_YET_DETERMINED}Module.prototype.deferred=function(){if(this._deferred==null){var e=this._deferred={};e.promise=new Promise(function(r,t){e.resolve=r;e.reject=t});e.promise.catch(noop)}return this._deferred};Module.prototype.api=function(){if(this._api==null){this._exports={};this._api={id:this.name.slice(0,-3),exports:this._exports,url:this.url,config:noop}}return this._api};Module.prototype.ready=function(e){assert(!this.settled,"Module "+this.name+" is already settled");this.state=READY;this.settled=true;if(arguments.length>0){this.content=e}this.deferred().resolve(wrapExport(this.value()));if(this.aliases){e=this.value();this.aliases.forEach(function(r){Module.get(r).ready(e)})}};Module.prototype.fail=function(e){assert(!this.settled,"Module "+this.name+" is already settled");this.settled=true;if(this.state!==FAILED){this.state=FAILED;this.error=e;this.deferred().reject(e);if(this.aliases){this.aliases.forEach(function(r){Module.get(r).fail(e)})}}};Module.prototype.addPending=function(e){(this.pending||(this.pending=[])).push(e)};Module.prototype.addAlias=function(e){(this.aliases||(this.aliases=[])).push(e);Module.get(e).addPending(this.name)};Module.prototype.preload=function(e,r,t){if(this.state===INITIAL&&!(fnIgnorePreload&&fnIgnorePreload(this.name))){this.state=PRELOADED;this.url=e;this.data=r;this.group=t}return this};Module.prototype.value=function(){if(this.state===READY){if(this.content===NOT_YET_DETERMINED){var e=mShims[this.name],r=e&&(Array.isArray(e.exports)?e.exports[0]:e.exports);this.content=getGlobalProperty(r||urnToUI5(this.name))}return this.content}return undefined};Module.prototype.dependsOn=function(e){var r=e.name,t=Object.create(null);function n(e){if(!t[e]){t[e]=true;var o=mModules[e]&&mModules[e].pending;return Array.isArray(o)&&(o.indexOf(r)>=0||o.some(n))}return false}return this.name===r||n(this.name)};Module.get=function(e){return mModules[e]||(mModules[e]=new Module(e))};function getExecutingModule(){if(_execStack.length>0){return _execStack[_execStack.length-1].name}return document.currentScript&&document.currentScript.getAttribute("data-sap-ui-module")}var _globalDefine,_globalDefineAMD;function updateDefineAndInterceptAMDFlag(e){if(_globalDefine===e){return}if(_globalDefine){_globalDefine.amd=_globalDefineAMD;_globalDefine=_globalDefineAMD=undefined}_globalDefine=e;if(e&&!e.ui5){_globalDefineAMD=_globalDefine.amd;Object.defineProperty(_globalDefine,"amd",{get:function(){var e=getExecutingModule();if(e&&mShims[e]&&mShims[e].amd){log.debug("suppressing define.amd for "+e);return undefined}return _globalDefineAMD},set:function(e){_globalDefineAMD=e;log.debug("define.amd became "+(e?"active":"unset"))},configurable:true})}}try{Object.defineProperty(__global,"define",{get:function(){return _globalDefine},set:function(e){updateDefineAndInterceptAMDFlag(e);log.debug("define became "+(e?"active":"unset"))},configurable:true})}catch(e){log.warning("could not intercept changes to window.define, ui5loader won't be able to a change of the AMD loader")}updateDefineAndInterceptAMDFlag(__global.define);function ensureStacktrace(e){if(!e.stack){try{throw e}catch(e){return e}}return e}function makeNestedError(e,r){var t=new Error(e+": "+r.message);t.cause=r;t.loadError=r.loadError;ensureStacktrace(t);ensureStacktrace(r);if(t.stack&&r.stack){t.stack=t.stack+"\nCaused by: "+r.stack}return t}function declareModule(e){var r;assert(/\.js$/.test(e),"must be a Javascript module");r=Module.get(e);if(r.state>INITIAL){return r}if(log.isLoggable()){log.debug(sLogPrefix+"declare module '"+e+"'")}r.state=READY;return r}function defineModuleSync(e,r){Module.get(e).ready(r)}function ModuleDefinitionQueue(){var e=[],r=0,t;this.push=function(n,o,i,a){if(log.isLoggable()){log.debug(sLogPrefix+"pushing define() call"+(document.currentScript?" from "+document.currentScript.src:"")+" to define queue #"+r)}e.push({name:n,deps:o,factory:i,_export:a,guess:document.currentScript&&document.currentScript.getAttribute("data-sap-ui-module")});if(!t){t=setTimeout(this.process.bind(this,null,"timer"))}};this.clear=function(){e=[];if(t){clearTimeout(t);t=null}};this.process=function(t,n){var o=log.isLoggable(),i=r++,a=e,l=null;this.clear();if(t){if(t.execError){if(o){log.debug("module execution error detected, ignoring queued define calls ("+a.length+")")}t.fail(t.execError);return}}l=t&&t.name;a.forEach(function(e){if(e.name==null){if(l!=null){e.name=l;l=null}else{if(strictModuleDefinitions){var r=new Error("Modules that use an anonymous define() call must be loaded with a require() call; "+"they must not be executed via script tag or nested into other modules. ");if(t){t.fail(r)}else{throw r}}e.name="~anonymous~"+ ++iAnonymousModuleCount+".js";log.error("Modules that use an anonymous define() call must be loaded with a require() call; "+"they must not be executed via script tag or nested into other modules. "+"All other usages will fail in future releases or when standard AMD loaders are used. "+"Now using substitute name "+e.name)}}else if(t&&e.name===t.name){if(l==null&&!strictModuleDefinitions){log.error("Duplicate module definition: both, an unnamed module and a module with the expected name exist."+"This use case will fail in future releases or when standard AMD loaders are used. ")}l=null}});if(l&&a.length>0){if(o){log.debug("No queued module definition matches the ID of the request. "+"Now assuming that the first definition '"+a[0].name+"' is an alias of '"+l+"'")}Module.get(a[0].name).addAlias(l);l=null}if(o){log.debug(sLogPrefix+"["+n+"] "+"processing define queue #"+i+(t?" for '"+t.name+"'":"")+" with entries ["+a.map(function(e){return"'"+e.name+"'"})+"]")}a.forEach(function(e){executeModuleDefinition(e.name,e.deps,e.factory,e._export,true)});if(l!=null&&!t.settled){if(o){log.debug(sLogPrefix+"no queued module definition for the requested module found, assume the module to be ready")}t.data=undefined;t.ready()}if(o){log.debug(sLogPrefix+"processing define queue #"+i+" done")}}}var queue=new ModuleDefinitionQueue;function loadSyncXHR(e){var r=new XMLHttpRequest;function t(e){e=e||ensureStacktrace(new Error(r.status+" - "+r.statusText));e.status=r.status;e.statusText=r.statusText;e.loadError=true;return e}r.addEventListener("load",function(n){if(r.status===200||r.status===0){e.state=LOADED;e.data=r.responseText}else{e.error=t()}});r.addEventListener("error",function(r){e.error=t()});r.open("GET",e.url,false);try{r.send()}catch(r){e.error=t(r)}}if("currentScript"in document){window.addEventListener("error",function e(r){var t=document.currentScript&&document.currentScript.getAttribute("data-sap-ui-module");var n=t&&Module.get(t);if(n&&n.execError==null){if(log.isLoggable()){log.debug("unhandled exception occurred while executing "+t+": "+r.message)}n.execError=r.error||{name:"Error",message:r.message};return false}})}function loadScript(e,r){var t;function n(r){if(log.isLoggable()){log.debug("JavaScript resource loaded: "+e.name)}t.removeEventListener("load",n);t.removeEventListener("error",o);queue.process(e,"onload")}function o(i){t.removeEventListener("load",n);t.removeEventListener("error",o);if(r){log.warning("retry loading JavaScript resource: "+e.name);if(t&&t.parentNode){t.parentNode.removeChild(t)}e.url=r;loadScript(e,null);return}log.error("failed to load JavaScript resource: "+e.name);e.fail(ensureStacktrace(new Error("failed to load '"+e.name+"' from "+e.url+": script load error")))}t=document.createElement("SCRIPT");t["s"+"rc"]=e.url;t.setAttribute("data-sap-ui-module",e.name);if(r!==undefined){if(mShims[e.name]&&mShims[e.name].amd){t.setAttribute("data-sap-ui-module-amd","true")}t.addEventListener("load",n);t.addEventListener("error",o)}document.head.appendChild(t)}function preloadDependencies(e){var r=mDepCache[e];if(Array.isArray(r)){log.debug("preload dependencies for "+e+": "+r);r.forEach(function(r){r=getMappedName(r,e);if(/\.js$/.test(r)){requireModule(null,r,true)}})}}function requireModule(e,r,t,n,o){var i=log.isLoggable(),a=urnToBaseIDAndSubType(r),l=mShims[r],u,s,d,f,c;if(!a){throw new Error("can only require Javascript module, not "+r)}if(r[0]=="/"){log.error("Module names that start with a slash should not be used, as they are reserved for future use.")}u=Module.get(r);if(l&&l.deps&&!n){if(i){log.debug("require dependencies of raw module "+r)}return requireAll(u,l.deps,function(){return requireModule(e,r,t,true,o)},function(e){u.fail(e);if(t){return}throw e},t)}if(u.state===INITIAL&&u.group&&u.group!==r&&!o){if(i){log.debug(sLogPrefix+"require bundle '"+u.group+"'"+" containing '"+r+"'")}if(t){return requireModule(null,u.group,t).catch(noop).then(function(){return requireModule(e,r,t,n,true)})}else{try{requireModule(null,u.group,t)}catch(e){if(i){log.error(sLogPrefix+"require bundle '"+u.group+"' failed (ignored)")}}}}if(i){log.debug(sLogPrefix+"require '"+r+"'"+(e?" (dependency of '"+e.name+"')":""))}if(u.state!==INITIAL){if(u.state===EXECUTING&&u.data!=null&&!t&&u.async){u.state=PRELOADED;u.async=t;u.pending=null}if(u.state===PRELOADED){u.state=LOADED;u.async=t;c=true;measure&&measure.start(r,"Require module "+r+" (preloaded)",["require"]);execModule(r,t);measure&&measure.end(r)}if(u.state===READY){if(!c&&i){log.debug(sLogPrefix+"module '"+r+"' has already been loaded (skipped).")}return t?Promise.resolve(wrapExport(u.value())):wrapExport(u.value())}else if(u.state===FAILED){if(t){return u.deferred().promise}else{throw c?u.error:makeNestedError("found in negative cache: '"+r+"' from "+u.url,u.error)}}else{if(t){if(e&&u.dependsOn(e)){if(log.isLoggable()){log.debug("cycle detected between '"+e.name+"' and '"+r+"', returning undefined for '"+r+"'")}return Promise.resolve(wrapExport(undefined))}return u.deferred().promise}if(!t&&!u.async){if(log.isLoggable()){log.debug("cycle detected between '"+(e?e.name:"unknown")+"' and '"+r+"', returning undefined for '"+r+"'")}return wrapExport(undefined)}log.warning("Sync request triggered for '"+r+"' while async request was already pending."+" Loading a module twice might cause issues and should be avoided by fully migrating to async APIs.")}}if(isIE11&&t&&l&&l.amd){t=false}measure&&measure.start(r,"Require module "+r,["require"]);u.state=LOADING;u.async=t;s=bDebugSources?["-dbg",""]:[""];if(!t){for(d=0;d<s.length&&u.state!==LOADED;d++){u.url=getResourcePath(a.baseID,s[d]+a.subType);if(i){log.debug(sLogPrefix+"loading "+(s[d]?s[d]+" version of ":"")+"'"+r+"' from '"+u.url+"' (using sync XHR)")}if(syncCallBehavior){f="[nosync] loading module '"+u.url+"'";if(syncCallBehavior===1){log.error(f)}else{throw new Error(f)}}ui5Require.load({completeLoad:noop,async:false},u.url,a.baseID);loadSyncXHR(u)}if(u.state===LOADING){u.fail(makeNestedError("failed to load '"+r+"' from "+u.url,u.error))}else if(u.state===LOADED){execModule(r,t)}measure&&measure.end(r);if(u.state!==READY){if(fnIgnorePreload){loadScript(u)}throw u.error}return wrapExport(u.value())}else{u.url=getResourcePath(a.baseID,s[0]+a.subType);var g=bDebugSources?getResourcePath(a.baseID,s[1]+a.subType):u.url;if(log.isLoggable()){log.debug(sLogPrefix+"loading '"+r+"' from '"+u.url+"' (using <script>)")}ui5Require.load({completeLoad:noop,async:true},g,a.baseID);loadScript(u,g);preloadDependencies(r);return u.deferred().promise}}function execModule(sModuleName,bAsync){var oModule=mModules[sModuleName],bLoggable=log.isLoggable(),sOldPrefix,sScript,oMatch,bOldForceSyncDefines,oOldQueue;if(oModule&&oModule.state===LOADED&&typeof oModule.data!=="undefined"){bOldForceSyncDefines=bForceSyncDefines;oOldQueue=queue;try{bForceSyncDefines=!bAsync;queue=new ModuleDefinitionQueue;if(bLoggable){if(typeof oModule.data==="string"){log.warning(sLogPrefix+"executing '"+sModuleName+"' (using eval)")}else{log.debug(sLogPrefix+"executing '"+sModuleName+"'")}sOldPrefix=sLogPrefix;sLogPrefix=sLogPrefix+": "}oModule.state=EXECUTING;_execStack.push({name:sModuleName,used:false});if(typeof oModule.data==="function"){oModule.data.call(__global)}else if(Array.isArray(oModule.data)){ui5Define.apply(null,oModule.data)}else{sScript=oModule.data;if(sScript){oMatch=/\/\/[#@] source(Mapping)?URL=(.*)$/.exec(sScript);if(oMatch&&oMatch[1]&&/^[^/]+\.js\.map$/.test(oMatch[2])){sScript=sScript.slice(0,oMatch.index)+oMatch[0].slice(0,-oMatch[2].length)+resolveURL(oMatch[2],oModule.url)}if(!oMatch||oMatch[1]){sScript+="\n//# sourceURL="+resolveURL(oModule.url)+"?eval"}}if(typeof translate==="function"){sScript=translate(sScript,sModuleName)}if(__global.execScript&&(!oModule.data||oModule.data.length<MAX_EXEC_SCRIPT_LENGTH)){try{oModule.data&&__global.execScript(sScript)}catch(e){_execStack.pop();eval(oModule.data);throw e}}else{__global.eval(sScript)}}queue.process(oModule,"after eval")}catch(e){oModule.data=undefined;oModule.fail(e)}finally{_execStack.pop();if(bLoggable){sLogPrefix=sOldPrefix;log.debug(sLogPrefix+"finished executing '"+sModuleName+"'")}queue=oOldQueue;bForceSyncDefines=bOldForceSyncDefines}}}function requireAll(e,r,t,n,o){var i,a=[],l,u,s,d;try{if(e instanceof Module){i=e.name}else{i=e;e=null}r=r.slice();for(l=0;l<r.length;l++){r[l]=getMappedName(r[l]+".js",i)}if(e){r.forEach(function(r){if(!/^(require|exports|module)\.js$/.test(r)){e.addPending(r)}})}for(l=0;l<r.length;l++){u=r[l];if(e){switch(u){case"require.js":a[l]=wrapExport(createContextualRequire(i,true));break;case"module.js":a[l]=wrapExport(e.api());break;case"exports.js":e.api();a[l]=wrapExport(e._exports);break;default:break}}if(!a[l]){a[l]=requireModule(e,u,o)}}}catch(e){s=e}if(o){d=s?Promise.reject(s):Promise.all(a);return d.then(t,n)}else{if(s){n(s)}else{return t(a)}}}function executeModuleDefinition(e,r,t,n,o){var i=log.isLoggable();e=normalize(e);if(i){log.debug(sLogPrefix+"define('"+e+"', "+"['"+r.join("','")+"']"+")")}var a=declareModule(e);var l=false;function u(){if(a.settled){if(a.state>=READY&&o&&a.async===false){log.warning("Repeated module execution skipped after async/sync conflict for "+a.name);return true}if(strictModuleDefinitions&&o){log.warning("Module '"+a.name+"' has been defined more than once. "+"All but the first definition will be ignored, don't try to define the same module again.");return true}if(!l){log.error("Module '"+a.name+"' is executed more than once. "+"This is an unsupported scenario and will fail in future versions of UI5 or "+"when a standard AMD loader is used. Don't define the same module again.");l=true}}}if(u()){return}a.content=undefined;requireAll(a,r,function(r){if(u()){return}if(i){log.debug(sLogPrefix+"define('"+e+"'): dependencies resolved, calling factory "+typeof t)}if(n&&syncCallBehavior!==2){var l=e.split("/");if(l.length>1){getGlobalObject(__global,l,l.length-1,true)}}if(typeof t==="function"){try{r=r.map(unwrapExport);var s=t.apply(__global,r);if(a._api&&a._api.exports!==undefined&&a._api.exports!==a._exports){s=a._api.exports}else if(s===undefined&&a._exports){s=a._exports}a.content=s}catch(e){a.fail(e);if(o){return}throw e}}else{a.content=t}if(n&&syncCallBehavior!==2){if(a.content==null){log.error("Module '"+e+"' returned no content, but should export to global?")}else{if(i){log.debug("exporting content of '"+e+"': as global object")}var d=urnToUI5(e);setGlobalProperty(d,a.content)}}a.ready()},function(e){a.fail(e);if(!o){throw e}},o)}function ui5Define(e,r,t,n){var o,i;if(typeof e==="string"){o=e+".js"}else{n=t;t=r;r=e;o=null}if(!Array.isArray(r)){n=t;t=r;if(typeof t==="function"&&t.length>0){r=["require","exports","module"].slice(0,t.length)}else{r=[]}}if(bForceSyncDefines===false||bForceSyncDefines==null&&bGlobalAsyncMode){queue.push(o,r,t,n);if(o!=null){var a=Module.get(o);if(a.state===INITIAL){a.state=EXECUTING;a.async=true}}return}i=_execStack.length>0?_execStack[_execStack.length-1]:null;if(!o){if(i&&!i.used){o=i.name;i.used=true}else{o="~anonymous~"+ ++iAnonymousModuleCount+".js";if(i){o=i.name.slice(0,i.name.lastIndexOf("/")+1)+o}log.error("Modules that use an anonymous define() call must be loaded with a require() call; "+"they must not be executed via script tag or nested into other modules. "+"All other usages will fail in future releases or when standard AMD loaders are used "+"or when ui5loader runs in async mode. Now using substitute name "+o)}}else if(i&&!i.used&&o!==i.name){log.debug("module names don't match: requested: "+e+", defined: ",i.name);Module.get(i.name).addAlias(e)}executeModuleDefinition(o,r,t,n,false)}function amdDefine(e,r,t){var n=arguments;var o=typeof n[n.length-1]==="boolean";if(o){n=Array.prototype.slice.call(n,0,n.length-1)}ui5Define.apply(this,n)}amdDefine.amd={};amdDefine.ui5={};function createContextualRequire(e,r){var t=function(t,n,o){var i;assert(typeof t==="string"||Array.isArray(t),"dependency param either must be a single string or an array of strings");assert(n==null||typeof n==="function","callback must be a function or null/undefined");assert(o==null||typeof o==="function","error callback must be a function or null/undefined");if(typeof t==="string"){i=getMappedName(t+".js",e);var a=Module.get(i);if(r&&a.state!==EXECUTING&&a.state!==READY){throw new Error("Module '"+i+"' has not been loaded yet. "+"Use require(['"+i+"']) to load it.")}return a.value()}requireAll(e,t,function(e){e=e.map(unwrapExport);if(typeof n==="function"){if(bGlobalAsyncMode){n.apply(__global,e)}else{simulateAsyncCallback(function(){n.apply(__global,e)})}}},function(e){if(typeof o==="function"){if(bGlobalAsyncMode){o.call(__global,e)}else{simulateAsyncCallback(function(){o.call(__global,e)})}}else{throw e}},bGlobalAsyncMode)};t.toUrl=function(r){var t=ensureTrailingSlash(getMappedName(r,e),r);return toUrl(t)};return t}function ensureTrailingSlash(e,r){if(r.slice(-1)==="/"&&e.slice(-1)!=="/"){return e+"/"}return e}function toUrl(e){if(e.indexOf("/")===0){throw new Error("The provided argument '"+e+"' may not start with a slash")}return ensureTrailingSlash(getResourcePath(e),e)}var ui5Require=createContextualRequire(null,false);var amdRequire=createContextualRequire(null,true);function requireSync(e){e=getMappedName(e+".js");if(log.isLoggable()){log.warning("sync require of '"+e+"'")}return unwrapExport(requireModule(null,e,false))}function predefine(e,r,t,n){if(typeof e!=="string"){throw new Error("predefine requires a module name")}e=normalize(e);Module.get(e+".js").preload("<unknown>/"+e,[e,r,t,n],null)}function preload(e,r,t){r=r||null;t=t||"<unknown>";for(var n in e){n=normalize(n);Module.get(n).preload(t+"/"+n,e[n],r)}}function dumpInternals(e){var r=[PRELOADED,INITIAL,LOADED,READY,FAILED,EXECUTING,LOADING];var t={};t[PRELOADED]="PRELOADED";t[INITIAL]="INITIAL";t[LOADING]="LOADING";t[LOADED]="LOADED";t[EXECUTING]="EXECUTING";t[READY]="READY";t[FAILED]="FAILED";if(e==null){e=PRELOADED}var n=log.isLoggable("INFO")?log.info.bind(log):console.info.bind(console);var o=Object.keys(mModules).sort();r.forEach(function(r){if(r<e){return}var i=0;n(t[r]+":");o.forEach(function(e,o){var a=mModules[e];if(a.state===r){var l;if(a.state===LOADING){var u=a.pending&&a.pending.reduce(function(e,r){var n=Module.get(r);if(n.state!==READY){e.push(r+"("+t[n.state]+")")}return e},[]);if(u&&u.length>0){l="waiting for "+u.join(", ")}}else if(a.state===FAILED){l=(a.error.name||"Error")+": "+a.error.message}n("  "+(o+1)+" "+e+(l?" ("+l+")":""));i++}});if(i===0){n("  none")}})}function getUrlPrefixes(){var e=Object.create(null);forEach(mUrlPrefixes,function(r,t){e[r]=t.url});return e}function unloadResources(e,r,t,n){var o=[],i,a;if(r==null){r=true}if(r){for(i in mModules){a=mModules[i];if(a&&a.group===e){o.push(i)}}}else{if(mModules[e]){o.push(e)}}o.forEach(function(e){var r=mModules[e];if(r&&n&&e.match(/\.js$/)){setGlobalProperty(urnToUI5(e),undefined)}if(r&&(t||r.state===PRELOADED)){delete mModules[e]}})}function getModuleContent(e,r){if(e){e=getMappedName(e)}else{e=guessResourceName(r)}var t=e&&mModules[e];if(t){t.state=LOADED;return t.data}else{return undefined}}function getAllModules(){var e=Object.create(null);forEach(mModules,function(r,t){e[r]={state:t.state,ui5:urnToUI5(r)}});return e}function loadJSResourceAsync(e,r){e=getMappedName(e);var t=requireModule(null,e,true).then(unwrapExport);return r?t.catch(noop):t}var mUI5ConfigHandlers={baseUrl:function(e){registerResourcePath("",e)},paths:registerResourcePath,shim:function(e,r){if(Array.isArray(r)){r={deps:r}}mShims[e+".js"]=r},amd:function(e){e=!!e;if(bExposeAsAMDLoader!==e){bExposeAsAMDLoader=e;if(e){vOriginalDefine=__global.define;vOriginalRequire=__global.require;__global.define=amdDefine;__global.require=amdRequire;bGlobalAsyncMode=true}else{__global.define=vOriginalDefine;__global.require=vOriginalRequire}}},async:function(e){if(bGlobalAsyncMode&&!e){throw new Error("Changing the ui5loader config from async to sync is not supported. Only a change from sync to async is allowed.")}bGlobalAsyncMode=!!e},bundles:function(e,r){e+=".js";r.forEach(function(r){Module.get(r+".js").group=e})},bundlesUI5:function(e,r){r.forEach(function(r){Module.get(r).group=e})},debugSources:function(e){bDebugSources=!!e},depCache:function(e,r){mDepCache[e+".js"]=r.map(function(e){return e+".js"})},depCacheUI5:function(e,r){mDepCache[e]=r},ignoreBundledResources:function(e){if(e==null||typeof e==="function"){fnIgnorePreload=e}},map:function(e,r){if(r==null){delete mMaps[e]}else if(typeof r==="string"){mMaps["*"][e]=r}else{mMaps[e]=mMaps[e]||Object.create(null);forEach(r,function(r,t){mMaps[e][r]=t})}},reportSyncCalls:function(e){if(e===0||e===1||e===2){syncCallBehavior=e}},noConflict:function(e){log.warning("Config option 'noConflict' has been deprecated, use option 'amd' instead, if still needed.");mUI5ConfigHandlers.amd(!e)}};var mAMDConfigHandlers={baseUrl:mUI5ConfigHandlers.baseUrl,paths:function(e,r){registerResourcePath(e,resolveURL(r,getResourcePath("")+"/"))},map:mUI5ConfigHandlers.map,shim:mUI5ConfigHandlers.shim};function handleConfigObject(e,r){function t(e,t){var n=r[e];if(typeof n==="function"){if(n.length===1){n(t)}else if(t!=null){forEach(t,n)}}else{log.warning("configuration option "+e+" not supported (ignored)")}}if(e.baseUrl){t("baseUrl",e.baseUrl)}forEach(e,function(e,r){if(e!=="baseUrl"){t(e,r)}})}function ui5Config(e){if(e===undefined){return{amd:bExposeAsAMDLoader,async:bGlobalAsyncMode,noConflict:!bExposeAsAMDLoader}}handleConfigObject(e,mUI5ConfigHandlers)}function amdConfig(e){if(e===undefined){return undefined}handleConfigObject(e,mAMDConfigHandlers)}ui5Require.preload=preload;ui5Require.load=function(e,r,t){};var privateAPI={amdDefine:amdDefine,amdRequire:amdRequire,config:ui5Config,declareModule:function(e){declareModule(normalize(e))},defineModuleSync:defineModuleSync,dump:dumpInternals,getAllModules:getAllModules,getModuleContent:getModuleContent,getModuleState:function(e){return mModules[e]?mModules[e].state:INITIAL},getResourcePath:getResourcePath,getSyncCallBehavior:getSyncCallBehavior,getUrlPrefixes:getUrlPrefixes,loadJSResourceAsync:loadJSResourceAsync,resolveURL:resolveURL,toUrl:toUrl,unloadResources:unloadResources};Object.defineProperties(privateAPI,{logger:{get:function(){return log},set:function(e){log=e}},measure:{get:function(){return measure},set:function(e){measure=e}},assert:{get:function(){return assert},set:function(e){assert=e}},translate:{get:function(){return translate},set:function(e){translate=e}},callbackInMicroTask:{get:function(){return simulateAsyncCallback===executeInMicroTask},set:function(e){simulateAsyncCallback=e?executeInMicroTask:executeInSeparateTask}}});__global.sap=__global.sap||{};sap.ui=sap.ui||{};sap.ui.loader={config:ui5Config,_:privateAPI};amdRequire.config=amdConfig;sap.ui.define=ui5Define;sap.ui.predefine=predefine;sap.ui.require=ui5Require;sap.ui.requireSync=requireSync})(window);
//@ui5-bundle-raw-include ui5loader-autoconfig.js
/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
(function(){"use strict";var r=window.sap&&window.sap.ui&&window.sap.ui.loader,e=window["sap-ui-config"]||{},i,t,a,s,u,p,o,d=false;function n(r,e){var a=r&&r.getAttribute("src"),s=e.exec(a);if(s){i=s[1]||"";p=r;o=a;t=/sap-ui-core-nojQuery\.js(?:[?#]|$)/.test(a);return true}}function y(r){return r&&r[r.length-1]!=="/"?r+"/":r}if(r==null){throw new Error("ui5loader-autoconfig.js: ui5loader is needed, but could not be found")}if(!n(document.querySelector("SCRIPT[src][id=sap-ui-bootstrap]"),/^((?:[^?#]*\/)?resources\/)/)){s=/^([^?#]*\/)?(?:sap-ui-(?:core|custom|boot|merged)(?:-[^?#/]*)?|jquery.sap.global|ui5loader(?:-autoconfig)?)\.js(?:[?#]|$)/;a=document.scripts;for(u=0;u<a.length;u++){if(n(a[u],s)){break}}}if(typeof e==="object"&&typeof e.resourceRoots==="object"&&typeof e.resourceRoots[""]==="string"){i=e.resourceRoots[""]}if(i==null){throw new Error("ui5loader-autoconfig.js: could not determine base URL. No known script tag and no configuration found!")}(function(){var r;try{r=window.localStorage.getItem("sap-ui-reboot-URL")}catch(r){}if(/sap-bootstrap-debug=(true|x|X)/.test(location.search)){debugger}if(r){var e=y(i)+"sap/ui/core/support/debugReboot.js";document.write('<script src="'+e+'"><\/script>');var t=new Error("This is not a real error. Aborting UI5 bootstrap and rebooting from: "+r);t.name="Restart";throw t}})();(function(){var e=/(?:^|\?|&)sap-ui-debug=([^&]*)(?:&|$)/.exec(window.location.search),t=e&&decodeURIComponent(e[1]);try{t=t||window.localStorage.getItem("sap-ui-debug")}catch(r){}t=t||p&&p.getAttribute("data-sap-ui-debug");if(typeof t==="string"){if(/^(?:false|true|x|X)$/.test(t)){t=t!=="false"}}else{t=!!t}if(/-dbg\.js([?#]|$)/.test(o)){window["sap-ui-loaddbg"]=true;t=t||true}window["sap-ui-debug"]=t;window["sap-ui-optimized"]=window["sap-ui-optimized"]||/\.location/.test(l)&&!/oBootstrapScript/.test(l);if(window["sap-ui-optimized"]&&t){window["sap-ui-loaddbg"]=true;if(t===true&&!window["sap-ui-debug-no-reboot"]){var a;if(o!=null){a=o.replace(/\/(?:sap-ui-cachebuster\/)?([^\/]+)\.js/,"/$1-dbg.js")}else{a=y(i)+"sap-ui-core.js"}r.config({amd:false});window["sap-ui-optimized"]=false;if(r.config().async){var s=document.createElement("script");s.src=a;document.head.appendChild(s)}else{document.write('<script src="'+a+'"><\/script>')}var u=new Error("This is not a real error. Aborting UI5 bootstrap and restarting from: "+a);u.name="Restart";throw u}}function d(r){if(!/\/\*\*\/$/.test(r)){r=r.replace(/\/$/,"/**/")}return r.replace(/\*\*\/|\*|[[\]{}()+?.\\^$|]/g,function(r){switch(r){case"**/":return"(?:[^/]+/)*";case"*":return"[^/]*";default:return"\\"+r}})}var n;if(typeof t==="string"){var c="^(?:"+t.split(/,/).map(d).join("|")+")",h=new RegExp(c);n=function(r){return h.test(r)};r._.logger.debug("Modules that should be excluded from preload: '"+c+"'")}else if(t===true){n=function(){return true};r._.logger.debug("All modules should be excluded from preload")}r.config({debugSources:!!window["sap-ui-loaddbg"],ignoreBundledResources:n})})();function l(r,i,t){var a=window.location.search.match(new RegExp("(?:^\\??|&)sap-ui-"+r+"=([^&]*)(?:&|$)"));if(a&&(t==null||t.test(a[1]))){return a[1]}var s=p&&p.getAttribute("data-sap-ui-"+r.toLowerCase());if(s!=null&&(t==null||t.test(s))){return s}if(Object.prototype.hasOwnProperty.call(e,r)&&(t==null||t.test(e[r]))){return e[r]}if(r.slice(0,3)!=="xx-"){return l("xx-"+r,i,t)}return i}function c(r,e){return/^(?:true|x|X)$/.test(l(r,e,/^(?:true|x|X|false)$/))}if(c("async",false)){r.config({async:true})}d=c("amd",!c("noLoaderConflict",true));r.config({baseUrl:i,amd:d,map:{"*":{blanket:"sap/ui/thirdparty/blanket",crossroads:"sap/ui/thirdparty/crossroads",d3:"sap/ui/thirdparty/d3",handlebars:"sap/ui/thirdparty/handlebars",hasher:"sap/ui/thirdparty/hasher",IPv6:"sap/ui/thirdparty/IPv6",jquery:"sap/ui/thirdparty/jquery",jszip:"sap/ui/thirdparty/jszip",less:"sap/ui/thirdparty/less",OData:"sap/ui/thirdparty/datajs",punycode:"sap/ui/thirdparty/punycode",SecondLevelDomains:"sap/ui/thirdparty/SecondLevelDomains",sinon:"sap/ui/thirdparty/sinon",signals:"sap/ui/thirdparty/signals",URI:"sap/ui/thirdparty/URI",URITemplate:"sap/ui/thirdparty/URITemplate",esprima:"sap/ui/documentation/sdk/thirdparty/esprima"}},shim:{"sap/ui/thirdparty/bignumber":{amd:true,exports:"BigNumber"},"sap/ui/thirdparty/blanket":{amd:true,exports:"blanket"},"sap/ui/thirdparty/caja-html-sanitizer":{amd:false,exports:"html"},"sap/ui/thirdparty/crossroads":{amd:true,exports:"crossroads",deps:["sap/ui/thirdparty/signals"]},"sap/ui/thirdparty/d3":{amd:true,exports:"d3"},"sap/ui/thirdparty/datajs":{amd:true,exports:"OData"},"sap/ui/thirdparty/es6-promise":{amd:true,exports:"ES6Promise"},"sap/ui/thirdparty/flexie":{amd:false,exports:"Flexie"},"sap/ui/thirdparty/handlebars":{amd:true,exports:"Handlebars"},"sap/ui/thirdparty/hasher":{amd:true,exports:"hasher",deps:["sap/ui/thirdparty/signals"]},"sap/ui/thirdparty/IPv6":{amd:true,exports:"IPv6"},"sap/ui/thirdparty/iscroll-lite":{amd:false,exports:"iScroll"},"sap/ui/thirdparty/iscroll":{amd:false,exports:"iScroll"},"sap/ui/thirdparty/jquery":{amd:true,exports:"jQuery",deps:["sap/ui/thirdparty/jquery-compat"]},"sap/ui/thirdparty/jqueryui/jquery-ui-datepicker":{deps:["sap/ui/thirdparty/jqueryui/jquery-ui-core"],exports:"jQuery"},"sap/ui/thirdparty/jqueryui/jquery-ui-draggable":{deps:["sap/ui/thirdparty/jqueryui/jquery-ui-mouse"],exports:"jQuery"},"sap/ui/thirdparty/jqueryui/jquery-ui-droppable":{deps:["sap/ui/thirdparty/jqueryui/jquery-ui-mouse","sap/ui/thirdparty/jqueryui/jquery-ui-draggable"],exports:"jQuery"},"sap/ui/thirdparty/jqueryui/jquery-ui-effect":{deps:["sap/ui/thirdparty/jquery"],exports:"jQuery"},"sap/ui/thirdparty/jqueryui/jquery-ui-mouse":{deps:["sap/ui/thirdparty/jqueryui/jquery-ui-core","sap/ui/thirdparty/jqueryui/jquery-ui-widget"],exports:"jQuery"},"sap/ui/thirdparty/jqueryui/jquery-ui-position":{deps:["sap/ui/thirdparty/jquery"],exports:"jQuery"},"sap/ui/thirdparty/jqueryui/jquery-ui-resizable":{deps:["sap/ui/thirdparty/jqueryui/jquery-ui-mouse"],exports:"jQuery"},"sap/ui/thirdparty/jqueryui/jquery-ui-selectable":{deps:["sap/ui/thirdparty/jqueryui/jquery-ui-mouse"],exports:"jQuery"},"sap/ui/thirdparty/jqueryui/jquery-ui-sortable":{deps:["sap/ui/thirdparty/jqueryui/jquery-ui-mouse"],exports:"jQuery"},"sap/ui/thirdparty/jqueryui/jquery-ui-widget":{deps:["sap/ui/thirdparty/jquery"],exports:"jQuery"},"sap/ui/thirdparty/jquery-mobile-custom":{amd:true,deps:["sap/ui/thirdparty/jquery","sap/ui/Device"],exports:"jQuery.mobile"},"sap/ui/thirdparty/jszip":{amd:true,exports:"JSZip"},"sap/ui/thirdparty/less":{amd:true,exports:"less"},"sap/ui/thirdparty/mobify-carousel":{amd:false,exports:"Mobify"},"sap/ui/thirdparty/qunit-2":{amd:false,exports:"QUnit"},"sap/ui/thirdparty/punycode":{amd:true,exports:"punycode"},"sap/ui/thirdparty/RequestRecorder":{amd:true,exports:"RequestRecorder",deps:["sap/ui/thirdparty/URI","sap/ui/thirdparty/sinon"]},"sap/ui/thirdparty/require":{exports:"define"},"sap/ui/thirdparty/SecondLevelDomains":{amd:true,exports:"SecondLevelDomains"},"sap/ui/thirdparty/signals":{amd:true,exports:"signals"},"sap/ui/thirdparty/sinon":{amd:true,exports:"sinon"},"sap/ui/thirdparty/sinon-4":{amd:true,exports:"sinon"},"sap/ui/thirdparty/sinon-server":{amd:true,exports:"sinon"},"sap/ui/thirdparty/unorm":{amd:false,exports:"UNorm"},"sap/ui/thirdparty/unormdata":{exports:"UNorm",deps:["sap/ui/thirdparty/unorm"]},"sap/ui/thirdparty/URI":{amd:true,exports:"URI"},"sap/ui/thirdparty/URITemplate":{amd:true,exports:"URITemplate",deps:["sap/ui/thirdparty/URI"]},"sap/ui/thirdparty/vkbeautify":{amd:false,exports:"vkbeautify"},"sap/ui/thirdparty/zyngascroll":{amd:false,exports:"Scroller"},"sap/ui/demokit/js/esprima":{amd:true,exports:"esprima"},"sap/ui/documentation/sdk/thirdparty/esprima":{amd:true,exports:"esprima"},"sap/viz/libs/canvg":{deps:["sap/viz/libs/rgbcolor"]},"sap/viz/libs/rgbcolor":{},"sap/viz/libs/sap-viz":{deps:["sap/viz/library","sap/ui/thirdparty/jquery","sap/ui/thirdparty/d3","sap/viz/libs/canvg"]},"sap/viz/libs/sap-viz-info-charts":{deps:["sap/viz/libs/sap-viz-info-framework"]},"sap/viz/libs/sap-viz-info-framework":{deps:["sap/ui/thirdparty/jquery","sap/ui/thirdparty/d3"]},"sap/viz/ui5/container/libs/sap-viz-controls-vizcontainer":{deps:["sap/viz/libs/sap-viz","sap/viz/ui5/container/libs/common/libs/rgbcolor/rgbcolor_static"]},"sap/viz/ui5/controls/libs/sap-viz-vizframe/sap-viz-vizframe":{deps:["sap/viz/libs/sap-viz-info-charts"]},"sap/viz/ui5/controls/libs/sap-viz-vizservices/sap-viz-vizservices":{deps:["sap/viz/libs/sap-viz-info-charts"]},"sap/viz/resources/chart/templates/standard_fiori/template":{deps:["sap/viz/libs/sap-viz-info-charts"]}}});var h=r._.defineModuleSync;h("ui5loader.js",null);h("ui5loader-autoconfig.js",null);if(t&&typeof jQuery==="function"){h("sap/ui/thirdparty/jquery.js",jQuery);if(jQuery.ui&&jQuery.ui.position){h("sap/ui/thirdparty/jqueryui/jquery-ui-position.js",jQuery)}}var m=p&&p.getAttribute("data-sap-ui-main");if(m){sap.ui.require(m.trim().split(/\s*,\s*/))}})();
sap.ui.requireSync("sap/ui/core/Core");
// as this module contains the Core, we ensure that the Core has been booted
sap.ui.getCore().boot && sap.ui.getCore().boot();
