/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./PluginBase","sap/ui/core/Core","sap/ui/core/InvisibleText","sap/ui/Device","sap/ui/thirdparty/jquery","sap/ui/dom/jquery/control","sap/ui/dom/jquery/Aria"],function(e,t,i,n,o){"use strict";var s=e.extend("sap.m.plugins.ColumnResizer",{metadata:{library:"sap.m",properties:{},events:{columnResize:{allowPreventDefault:true,parameters:{column:{type:"sap.ui.core.Element"},width:{type:"sap.ui.core.CSSSize"}}}}}});var a={};var r=false;var l="sapMPluginsColumnResizer";var u=t.getConfiguration().getRTL();var h=u?"right":"left";var d=u?"left":"right";var c=u?-1:1;s.getPlugin=e.getPlugin;s.prototype.init=function(){this._iHoveredColumnIndex=-1;this._aPositions=[];this._oHandle=null};s.prototype.onActivate=function(e){e.addEventDelegate(this,this);if(e.isActive()){this.onAfterRendering()}};s.prototype.onDeactivate=function(e){e.removeEventDelegate(this,this);this.onBeforeRendering();this._oHandle=null};s.prototype.onBeforeRendering=function(){if(this._$Container){this._$Container.removeClass(l+"Container").off("."+l);this._$Container.find(this.getConfig("resizable")).removeClass(l+"Resizable");this._updateAriaDescribedBy("remove")}};s.prototype.onAfterRendering=function(){this._$Container=this.getControl().$(this.getConfig("container"));n.system.desktop&&this._$Container.on("mousemove."+l,this._onmousemove.bind(this));this._$Container.addClass(l+"Container").on("mouseleave."+l,this._onmouseleave.bind(this));this._aResizables=this._$Container.find(this.getConfig("resizable")).addClass(l+"Resizable").get();this._updateAriaDescribedBy("add");this._invalidatePositions()};s.prototype._updateAriaDescribedBy=function(e){this._aResizables&&this._aResizables.forEach(function(t){var n=o(t).control(0,true);var s=n&&n.getFocusDomRef();o(s)[e+"AriaDescribedBy"](i.getStaticId("sap.m","COLUMNRESIZER_RESIZABLE"))})};s.prototype.ontouchstart=function(e){if(this.getConfig("allowTouchResizing")&&o(e.target).closest(this._aResizables)[0]){this._onmousemove(e)}else if(this._iHoveredColumnIndex==-1&&this._oHandle&&this._oHandle.style[h]){this._onmousemove(e);if(this._iHoveredColumnIndex==-1){this._oHandle.style[h]="";this._oAlternateHandle.style[h]=""}}r=this._iHoveredColumnIndex>-1;if(!r){return}this._startResizeSession(this._iHoveredColumnIndex);a.iTouchStartX=e.targetTouches[0].clientX;a.fHandleX=parseFloat(this._oHandle.style[h]);this._$Container.addClass(l+"Resizing");o(document).on("touchend."+l+" mouseup."+l,this._ontouchend.bind(this))};s.prototype.ontouchmove=function(e){if(!r){return}this._setSessionDistanceX(e.targetTouches[0].clientX-a.iTouchStartX);this._oHandle.style[h]=a.fHandleX+a.iDistanceX+"px"};s.prototype._onmousemove=function(e){if(r){return}this._setPositions();var t=e.targetTouches?e.targetTouches[0].clientX:e.clientX;var i=this._getHoveredColumnIndex(t);this._displayHandle(i)};s.prototype._onmouseleave=function(){this._invalidatePositions()};s.prototype._ontouchend=function(){this._setColumnWidth();this._cancelResizing(true)};s.prototype.onsapescape=function(){if(r){this._cancelResizing()}};s.prototype.onsaprightmodifiers=function(e){this._onLeftRightModifiersKeyDown(e,16)};s.prototype.onsapleftmodifiers=function(e){this._onLeftRightModifiersKeyDown(e,-16)};s.prototype.ondblclick=function(e){var t=e.clientX,i=this._getHoveredColumnIndex(t);if(i==-1){return}this._startResizeSession(i);this._setSessionDistanceX(this._calculateAutoColumnDistanceX());this._setColumnWidth();this._endResizeSession()};s.prototype._getHoveredColumnIndex=function(e){return this._aPositions.findIndex(function(t){return Math.abs(t-e)<=(this._oAlternateHandle||window.matchMedia("(hover:none)").matches?20:3)},this)};s.prototype._calculateAutoColumnDistanceX=function(){var e=this.getConfig("columnRelatedCells",this._$Container,a.oCurrentColumn.getId());if(!e||!e.length){return}var t=o("<div></div>").addClass(l+"SizeDetector").addClass(this.getConfig("cellPaddingStyleClass"));var i=e.children().clone().removeAttr("id");this._$Container.append(t);var n=Math.round(t.append(i)[0].getBoundingClientRect().width);var s=n-a.fCurrentColumnWidth;t.remove();return s};s.prototype._invalidatePositions=function(){window.setTimeout(function(){this._bPositionsInvalid=true}.bind(this))};s.prototype._displayHandle=function(e,t){if(this._iHoveredColumnIndex==e){return}if(!this._oHandle){this._oHandle=document.createElement("div");this._oHandle.className=l+"Handle";if(t||window.matchMedia("(hover:none)").matches){var i=document.createElement("div");i.className=l+"HandleCircle";i.style.top=this._aResizables[e].offsetHeight-8+"px";this._oHandle.appendChild(i);this._oAlternateHandle=this._oHandle.cloneNode(true)}}if(!this._oHandle.parentNode){this._$Container.append(this._oHandle);if(t){this._$Container.append(this._oAlternateHandle)}}this._oHandle.style[h]=e>-1?(this._aPositions[e]-this._fContainerX)*c+"px":"";if(t){this._oAlternateHandle.style[h]=--e>-1?(this._aPositions[e]-this._fContainerX)*c+"px":""}else{if(this._oAlternateHandle){this._oAlternateHandle.style[h]=""}this._iHoveredColumnIndex=e}};s.prototype._cancelResizing=function(e){this._$Container.removeClass(l+"Resizing");if(a.iDistanceX||!e){this._oHandle.style[h]=""}else{setTimeout(function(){this._oHandle.style[h]=""}.bind(this),300)}this._iHoveredColumnIndex=-1;o(document).off("."+l);this._endResizeSession();r=false};s.prototype._getColumnMinWidth=function(e){return e?48:0};s.prototype._startResizeSession=function(e){a.$CurrentColumn=o(this._aResizables[e]);a.oCurrentColumn=a.$CurrentColumn.control(0,true);a.fCurrentColumnWidth=a.$CurrentColumn.width();a.iMaxDecrease=this._getColumnMinWidth(a.oCurrentColumn)-a.fCurrentColumnWidth;a.iEmptySpace=this.getConfig("emptySpace",this.getControl());if(a.iEmptySpace!=-1){a.$NextColumn=o(this._aResizables[e+1]);a.oNextColumn=a.$NextColumn.control(0,true);a.fNextColumnWidth=a.$NextColumn.width()||0;a.iMaxIncrease=a.iEmptySpace+a.fNextColumnWidth-this._getColumnMinWidth(a.oNextColumn)}else{a.iMaxIncrease=window.innerWidth}};s.prototype._setSessionDistanceX=function(e){a.iDistanceX=(e>0?Math.min(e,a.iMaxIncrease):Math.max(e,a.iMaxDecrease))*c};s.prototype._setColumnWidth=function(){if(!a.iDistanceX){return}var e=a.fCurrentColumnWidth+a.iDistanceX+"px";if(!this._fireColumnResize(a.oCurrentColumn,e)){return}a.oCurrentColumn.setWidth(e);if(a.oNextColumn&&(a.iEmptySpace<3||a.iDistanceX>a.iEmptySpace)){e=a.fNextColumnWidth-a.iDistanceX+a.iEmptySpace+"px";if(this._fireColumnResize(a.oNextColumn,e)){a.oNextColumn.setWidth(e)}}this.getConfig("fixAutoWidthColumns")&&this._aResizables.forEach(function(e){var t=o(e),i=t.control(0,true),n=i.getWidth();if(n&&n.toLowerCase()!="auto"){return}n=t.css("width");if(n&&this._fireColumnResize(i,n)){i.setWidth(n)}},this)};s.prototype._fireColumnResize=function(e,t){return this.fireColumnResize({column:e,width:t})};s.prototype._onLeftRightModifiersKeyDown=function(e,t){if(!e.shiftKey){return}var i=o(e.target).closest(this._aResizables)[0],n=this._aResizables.indexOf(i);if(n===-1){return}this._startResizeSession(n);this._setSessionDistanceX(t);this._setColumnWidth();this._endResizeSession()};s.prototype._endResizeSession=function(){a={}};s.prototype._setPositions=function(){if(!this._bPositionsInvalid){return this._aPositions}this._bPositionsInvalid=false;this._fContainerX=this._$Container[0].getBoundingClientRect()[h];this._aPositions=this._aResizables.map(function(e,t,i){return e.getBoundingClientRect()[d]-(++t==i.length?1.25*c:0)},this)};s.prototype.startResizing=function(e){var t=this._aResizables.indexOf(e);this._setPositions();this._displayHandle(t,true)};e.setConfigs({"sap.m.Table":{container:"listUl",resizable:".sapMListTblHeaderCell:not([aria-hidden=true])",focusable:".sapMColumnHeaderFocusable",cellPaddingStyleClass:"sapMListTblCell",fixAutoWidthColumns:true,onActivate:function(e){this._vOrigFixedLayout=e.getFixedLayout();if(!e.bActiveHeaders){e.bFocusableHeaders=true;this.allowTouchResizing=window.matchMedia("(hover:none)").matches}e.setFixedLayout("Strict")},onDeactivate:function(e){e.bFocusableHeaders=false;e.setFixedLayout(this._vOrigFixedLayout);if(this._vOrigFixedLayout=="Strict"){e.rerender()}delete this._vOrigFixedLayout;delete this.allowTouchResizing},emptySpace:function(e){var t=e.getDomRef("tblHeadDummyCell");return t?t.clientWidth:0},columnRelatedCells:function(e,t){return e.find(".sapMListTblCell[data-sap-ui-column='"+t+"']")}}},s);return s});