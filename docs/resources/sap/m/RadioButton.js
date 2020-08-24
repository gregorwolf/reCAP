/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Control","sap/ui/core/Core","sap/ui/core/EnabledPropagator","sap/ui/core/message/MessageMixin","sap/m/RadioButtonGroup","sap/m/Label","sap/ui/core/library","sap/base/strings/capitalize","./RadioButtonRenderer"],function(e,t,a,r,i,o,s,n,u,p){"use strict";var l=n.TextAlign;var d=n.ValueState;var c=n.TextDirection;var h=t.extend("sap.m.RadioButton",{metadata:{interfaces:["sap.ui.core.IFormContent"],library:"sap.m",properties:{enabled:{type:"boolean",group:"Behavior",defaultValue:true},selected:{type:"boolean",group:"Data",defaultValue:false},groupName:{type:"string",group:"Behavior",defaultValue:"sapMRbDefaultGroup"},text:{type:"string",group:"Appearance",defaultValue:null},textDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:c.Inherit},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:""},useEntireWidth:{type:"boolean",group:"Appearance",defaultValue:false},activeHandling:{type:"boolean",group:"Appearance",defaultValue:true},editable:{type:"boolean",group:"Behavior",defaultValue:true},valueState:{type:"sap.ui.core.ValueState",group:"Data",defaultValue:d.None},textAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:l.Begin},editableParent:{type:"boolean",group:"Behavior",defaultValue:true,visibility:"hidden"},valueStateText:{type:"string",group:"Misc",defaultValue:null,visibility:"hidden"}},events:{select:{parameters:{selected:{type:"boolean"}}}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},dnd:{draggable:true,droppable:false},designtime:"sap/m/designtime/RadioButton.designtime"}});r.call(h.prototype);i.call(h.prototype);h.prototype._groupNames={};var f={HOME:"first",END:"last",NEXT:"next",PREV:"prev"};h.prototype.onBeforeRendering=function(){this._updateGroupName();this._updateLabelProperties()};h.prototype.exit=function(){var e=this.getGroupName(),t=this._groupNames[e],a=t&&t.indexOf(this);this._iTabIndex=null;if(this._oLabel){this._oLabel.destroy();this._oLabel=null}if(a>=-1){t.splice(a,1)}};h.prototype.ontap=function(e){if(!this.getEnabled()||!this.getEditable()){return}var t=this.getParent();if(t instanceof o&&(!t.getEnabled()||!t.getEditable())){return}e&&e.setMarked();this.applyFocusInfo();if(!this.getSelected()){this.setSelected(true);var a=this;setTimeout(function(){a.fireSelect({selected:true})},0)}};h.prototype.ontouchstart=function(e){e.setMarked();if(this.getEnabled()&&this.getActiveHandling()){this.addStyleClass("sapMRbBTouched")}};h.prototype.ontouchend=function(){this.removeStyleClass("sapMRbBTouched")};h.prototype.onsapnext=function(e){this._keyboardHandler(f.NEXT,true);e.setMarked();return this};h.prototype.onsapnextmodifiers=function(e){this._keyboardHandler(f.NEXT,!e.ctrlKey);e.setMarked();return this};h.prototype.onsapprevious=function(e){this._keyboardHandler(f.PREV,true);e.setMarked();return this};h.prototype.onsappreviousmodifiers=function(e){this._keyboardHandler(f.PREV,!e.ctrlKey);e.setMarked();return this};h.prototype.onsaphome=function(e){this._keyboardHandler(f.HOME,true);e.setMarked();return this};h.prototype.onsaphomemodifiers=function(e){this._keyboardHandler(f.HOME,!e.ctrlKey);e.setMarked();return this};h.prototype.onsapend=function(e){this._keyboardHandler(f.END,true);e.setMarked();return this};h.prototype.onsapendmodifiers=function(e){this._keyboardHandler(f.END,!e.ctrlKey);e.setMarked();return this};h.prototype._keyboardHandler=function(e,t){if(this.getParent()instanceof o){return}var a=this._getNextFocusItem(e);a.focus();if(t&&!a.getSelected()&&a.getEditable()&&a.getEnabled()){a.setSelected(true);setTimeout(function(){a.fireSelect({selected:true})},0)}};h.prototype.getAccessibilityInfo=function(){var e=a.getLibraryResourceBundle("sap.m");return{role:"radio",type:e.getText("ACC_CTR_TYPE_RADIO"),description:(this.getText()||"")+(this.getSelected()?" "+e.getText("ACC_CTR_STATE_CHECKED"):""),enabled:this.getEnabled(),editable:this.getEditable()}};h.prototype.getFormDoNotAdjustWidth=function(){return this.getText()?false:true};h.prototype._getNextFocusItem=function(e){var t=this._groupNames[this.getGroupName()].filter(function(e){return e.getDomRef()&&e.getEnabled()});var a=t.indexOf(this),r=a,i=t.length;switch(e){case f.NEXT:r=a===i-1?a:a+1;break;case f.PREV:r=a===0?0:r-1;break;case f.HOME:r=0;break;case f.END:r=i-1;break}return t[r]||this};h.prototype.onsapselect=function(e){e.preventDefault();this.ontap(e)};h.prototype.setTabIndex=function(e){var t=this.getFocusDomRef();this._iTabIndex=e;if(t){t.setAttribute("tabindex",e)}return this};h.prototype.setValueStateText=function(e){return this.setProperty("valueStateText",e)};h.prototype.setSelected=function(e){var t=this.getGroupName(),a=this._groupNames[t],r=a&&a.length;this.setProperty("selected",e);this._updateGroupName();if(!!e&&t&&t!==""){for(var i=0;i<r;i++){var o=a[i];if(o instanceof h&&o!==this&&o.getSelected()){o.fireSelect({selected:false});o.setSelected(false)}}}return this};h.prototype._updateLabelProperties=function(){var e=this._getLabel();var t=this.getText();var a=this.getUseEntireWidth();this.toggleStyleClass("sapMRbHasLabel",!!t);e.setText(t).setWidth(!a?this.getWidth():"auto").setTextDirection(this.getTextDirection()).setTextAlign(this.getTextAlign())};h.prototype._getLabel=function(){if(!this._oLabel){this._oLabel=new s(this.getId()+"-label");this._oLabel.addStyleClass("sapMRbBLabel").setParent(this,null,true)}return this._oLabel};h.prototype._updateGroupName=function(){var e=this.getGroupName();for(var t in this._groupNames){var a=this._groupNames[t];if(t!==e&&a.indexOf(this)!==-1){a.splice(a.indexOf(this),1)}}var r=this._groupNames[e];if(!r){r=this._groupNames[e]=[]}if(r.indexOf(this)===-1){r.push(this)}};["editableParent"].forEach(function(e){h.prototype["_set"+u(e)]=function(t){return this.setProperty(e,t,true)}});return h});