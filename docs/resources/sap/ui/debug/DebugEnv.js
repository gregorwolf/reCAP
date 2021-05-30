/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define("sap/ui/debug/DebugEnv",["sap/ui/base/Interface","./ControlTree","./LogViewer","./PropertyList","sap/base/Log","sap/ui/thirdparty/jquery"],function(t,e,i,o,r,s){"use strict";var n=function(){};n.prototype.startPlugin=function(t,e){this.oCore=t;this.oWindow=window;try{this.bRunsEmbedded=typeof window.top.testfwk==="undefined";r.info("Starting DebugEnv plugin ("+(this.bRunsEmbedded?"embedded":"testsuite")+")");if(!this.bRunsEmbedded||t.getConfiguration().getInspect()){this.init(e)}if(!this.bRunsEmbedded||t.getConfiguration().getTrace()){this.initLogger(r,e)}}catch(t){r.warning("DebugEnv plugin can not be started outside the Testsuite.")}};n.prototype.stopPlugin=function(){r.info("Stopping DebugEnv plugin.");this.oCore=null};n.prototype.init=function(t){this.oControlTreeWindow=this.bRunsEmbedded?this.oWindow:top.document.getElementById("sap-ui-ControlTreeWindow")||top.frames["sap-ui-ControlTreeWindow"]||top;this.oPropertyListWindow=this.bRunsEmbedded?this.oWindow:top.document.getElementById("sap-ui-PropertyListWindow")||top.frames["sap-ui-PropertyListWindow"]||top;var i=sap.ui.getCore().getConfiguration().getRTL();var r=this.oControlTreeWindow.querySelector("#sap-ui-ControlTreeRoot"),s=this.oPropertyListWindow.querySelector("#sap-ui-PropertyWindowRoot");if(!r){r=this.oControlTreeWindow.document.createElement("DIV");r.setAttribute("id","sap-ui-ControlTreeRoot");r.setAttribute("tabindex",-1);r.style.position="absolute";r.style.fontFamily="Arial";r.style.fontSize="8pt";r.style.backgroundColor="white";r.style.color="black";r.style.border="1px solid gray";r.style.overflow="auto";r.style.zIndex="999999";r.style.top="1px";if(i){r.style.left="1px"}else{r.style.right="1px"}r.style.height="49%";r.style.width="200px";this.oControlTreeWindow.document.body.appendChild(r)}else{r.innerHTML=""}this.oControlTreeRoot=r;if(!s){s=this.oPropertyListWindow.document.createElement("DIV");s.setAttribute("id","sap-ui-PropertyWindowRoot");s.setAttribute("tabindex",-1);s.style.position="absolute";s.style.fontFamily="Arial";s.style.fontSize="8pt";s.style.backgroundColor="white";s.style.color="black";s.style.border="1px solid gray";s.style.overflow="auto";s.style.zIndex="99999";s.style.width="196px";s.style.height="49%";if(i){s.style.left="1px"}else{s.style.right="1px"}s.style.bottom="1px";this.oPropertyListWindow.document.body.appendChild(s)}else{s.innerHTML=""}this.oPropertyWindowRoot=s;this.oControlTree=new e(this.oCore,this.oWindow,r,this.bRunsEmbedded);this.oPropertyList=new o(this.oCore,this.oWindow,s);this.oControlTree.attachEvent(e.M_EVENTS.SELECT,this.oPropertyList.update,this.oPropertyList);if(!t){this.oControlTree.renderDelayed()}window.addEventListener("unload",function(t){this.oControlTree.exit();this.oPropertyList.exit()}.bind(this))};n.prototype.initLogger=function(t,e){this.oLogger=t;this.oLogger.setLogEntriesLimit(Infinity);if(!this.bRunsEmbedded){this.oTraceWindow=top.document.getElementById("sap-ui-TraceWindow");if(this.oTraceWindow){this.oTraceViewer=top.oLogViewer=new i(this.oTraceWindow,"sap-ui-TraceWindowRoot")}else{this.oTraceWindow=top.frames["sap-ui-TraceWindow"];this.oTraceViewer=this.oTraceWindow.oLogViewer=new i(this.oTraceWindow,"sap-ui-TraceWindowRoot")}this.oTraceViewer.sLogEntryClassPrefix="lvl";this.oTraceViewer.lock()}else{this.oTraceWindow=this.oWindow;this.oTraceViewer=new i(this.oTraceWindow,"sap-ui-TraceWindowRoot")}this.oLogger.addLogListener(this.oTraceViewer);this.oCore.attachUIUpdated(this.enableLogViewer,this);if(!e){var o=this;this.oTimer=setTimeout(function(){o.enableLogViewer()},0)}};n.prototype.enableLogViewer=function(){if(this.oTimer){clearTimeout(this.oTimer);this.oTimer=undefined}this.oCore.detachUIUpdated(this.enableLogViewer,this);if(this.oTraceViewer){this.oTraceViewer.unlock()}};n.prototype.isRunningEmbedded=function(){return this.bRunsEmbedded};n.prototype.isControlTreeShown=function(){return s(this.oControlTreeRoot).css("visibility")==="visible"||s(this.oControlTreeRoot).css("visibility")==="inherit"};n.prototype.showControlTree=function(){if(!this.oControlTreeRoot){this.init(false)}s(this.oControlTreeRoot).css("visibility","visible")};n.prototype.hideControlTree=function(){s(this.oControlTreeRoot).css("visibility","hidden")};n.prototype.isTraceWindowShown=function(){var t=this.oTraceWindow&&this.oTraceWindow.document.getElementById("sap-ui-TraceWindowRoot");return t&&(s(t).css("visibility")==="visible"||s(t).css("visibility")==="inherit")};n.prototype.showTraceWindow=function(){if(!this.oTraceWindow){this.initLogger(r,false)}var t=this.oTraceWindow&&this.oTraceWindow.document.getElementById("sap-ui-TraceWindowRoot");if(t){s(t).css("visibility","visible")}};n.prototype.hideTraceWindow=function(){var t=this.oTraceWindow&&this.oTraceWindow.document.getElementById("sap-ui-TraceWindowRoot");if(t){s(t).css("visibility","hidden")}};n.prototype.isPropertyListShown=function(){return s(this.oPropertyWindowRoot).css("visibility")==="visible"||s(this.oPropertyWindowRoot).css("visibility")==="inherit"};n.prototype.showPropertyList=function(){if(!this.oPropertyWindowRoot){this.init(false)}s(this.oPropertyWindowRoot).css("visibility","visible")};n.prototype.hidePropertyList=function(){s(this.oPropertyWindowRoot).css("visibility","hidden")};(function(){var e=new n;sap.ui.getCore().registerPlugin(e);var i=new t(e,["isRunningEmbedded","isControlTreeShown","showControlTree","hideControlTree","isTraceWindowShown","showTraceWindow","hideTraceWindow","isPropertyListShown","showPropertyList","hidePropertyList"]);n.getInstance=function(){return i}})();return n},true);