/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./List","./library","sap/ui/model/ChangeReason","sap/ui/model/Filter","./FacetFilterListRenderer","./FacetFilterItem","sap/base/Log","sap/ui/model/FilterOperator","sap/ui/model/FilterType"],function(e,t,i,s,o,r,a,n,l){"use strict";var c=t.ListMode;var h=t.FacetFilterListDataType;var u=e.extend("sap.m.FacetFilterList",{metadata:{library:"sap.m",properties:{title:{type:"string",group:"Appearance",defaultValue:null},wordWrap:{type:"boolean",group:"Appearance",defaultValue:false},multiSelect:{type:"boolean",group:"Behavior",defaultValue:true,deprecated:true},active:{type:"boolean",group:"Behavior",defaultValue:true},enableCaseInsensitiveSearch:{type:"boolean",group:"Behavior",defaultValue:false,deprecated:false},allCount:{type:"int",group:"Appearance",defaultValue:null},sequence:{type:"int",group:"Behavior",defaultValue:-1},key:{type:"string",group:"Identification",defaultValue:null},showRemoveFacetIcon:{type:"boolean",group:"Misc",defaultValue:true},retainListSequence:{type:"boolean",group:"Misc",defaultValue:false},dataType:{type:"sap.m.FacetFilterListDataType",group:"Misc",defaultValue:h.String}},events:{listOpen:{allowPreventDefault:true},listClose:{parameters:{selectedItems:{type:"sap.m.FacetFilterItem[]"},allSelected:{type:"boolean"},selectedKeys:{type:"object"}}},search:{allowPreventDefault:true,parameters:{term:{type:"string"}}}}}});u.prototype.setTitle=function(e){this.setProperty("title",e,true);this._updateFacetFilterButtonText();return this};u.prototype.setMultiSelect=function(e){this.setProperty("multiSelect",e,true);var t=e?c.MultiSelect:c.SingleSelectMaster;this.setMode(t);return this};u.prototype.setMode=function(t){if(t===c.MultiSelect||t===c.SingleSelectMaster){e.prototype.setMode.call(this,t);this.setProperty("multiSelect",t===c.MultiSelect?true:false,true)}return this};u.prototype._applySearch=function(){var e=this._getSearchValue();if(e===null){return}this._bSearchEventDefaultBehavior&&this._search(e,true);this._updateSelectAllCheckBox()};u.prototype.getSelectedItems=function(){var t=[];var i={};var s=e.prototype.getSelectedItems.apply(this,arguments);s.forEach(function(e){t.push(new r({text:e.getText(),key:e.getKey(),selected:true}));i[e.getKey()]=true});var o=this.getSelectedKeys();var a=Object.getOwnPropertyNames(o);if(s.length<a.length){a.forEach(function(e){if(!i[e]){t.push(new r({text:o[e],key:e,selected:true}))}})}return t};u.prototype.getSelectedItem=function(){var t=e.prototype.getSelectedItem.apply(this,arguments);var i=Object.getOwnPropertyNames(this.getSelectedKeys());if(!t&&i.length>0){t=new r({text:this.getSelectedKeys()[i[0]],key:i[0],selected:true})}return t};u.prototype.removeSelections=function(t){if(this._allowRemoveSelections){t?this.setSelectedKeys():e.prototype.removeSelections.call(this,t)}return this};u.prototype.getSelectedKeys=function(){var e={};var t=this._oSelectedKeys;Object.getOwnPropertyNames(t).forEach(function(i){e[i]=t[i]});return e};u.prototype.setSelectedKeys=function(t){this._oSelectedKeys={};var i=false;t&&Object.getOwnPropertyNames(t).forEach(function(e){this._addSelectedKey(e,t[e]);i=true},this);if(i){if(this.getMode()===c.MultiSelect){this.setActive(true)}this._selectItemsByKeys()}else{e.prototype.removeSelections.call(this)}};u.prototype._getNonGroupItems=function(){var e=[];this.getItems().forEach(function(t){if(t.getMode()!==c.None){e.push(t)}});return e};u.prototype.removeSelectedKey=function(e,t){if(this._removeSelectedKey(e,t)){this._getNonGroupItems().forEach(function(t){var i=t.getKey()||t.getText();e===i&&t.setSelected(false)})}};u.prototype.removeSelectedKeys=function(){this._oSelectedKeys={};e.prototype.removeSelections.call(this,true)};u.prototype.removeItem=function(t){var i=e.prototype.removeItem.apply(this,arguments);if(!this._filtering){i&&i.getSelected()&&this.removeSelectedKey(i.getKey(),i.getText());return i}};u.prototype.init=function(){this._firstTime=true;this._bSearchEventDefaultBehavior=true;this._saveBindInfo;this._oSelectedKeys={};e.prototype.init.call(this);this.setMode(c.MultiSelect);this.setIncludeItemInSelection(true);this.setGrowing(true);this.setRememberSelections(false);this._searchValue="";this.attachUpdateFinished(function(e){var t=e.getParameter("reason");t=t?t.toLowerCase():t;if(t==="change"){var s=this.getBinding("items"),o=s?s.getModel():null;if(o&&o.getProperty(s.getPath())){this._iAllItemsCount=o.getProperty(s.getPath()).length||0}this._oSelectedKeys={};this._getNonGroupItems().forEach(function(e){if(e.getSelected()){this._addSelectedKey(e.getKey(),e.getText())}},this)}if(t!==i.Filter.toLowerCase()){this._selectItemsByKeys()}this._updateFacetFilterButtonText();this._updateSelectAllCheckBox()});this._allowRemoveSelections=true;this._bOriginalActiveState;this._iAllItemsCount};u.prototype._resetItemsBinding=function(){if(this.isBound("items")){this._setSearchValue("");this._allowRemoveSelections=false;e.prototype._resetItemsBinding.apply(this,arguments);this._allowRemoveSelections=true}};u.prototype._fireListCloseEvent=function(){var e=this.getSelectedItems();var t=this.getSelectedKeys();var i=e.length===0;this._firstTime=true;this.fireListClose({selectedItems:e,selectedKeys:t,allSelected:i})};u.prototype._updateActiveState=function(){var e=sap.ui.getCore().byId(this.getAssociation("allcheckbox"));if(Object.getOwnPropertyNames(this._oSelectedKeys).length>0||e&&e.getSelected()){this.setActive(true)}};u.prototype._handleSearchEvent=function(e){var t=e.getParameters()["query"];if(t===undefined){t=e.getParameters()["newValue"]}this._bSearchEventDefaultBehavior=this.fireSearch({term:t,clearButtonPressed:e.getParameters()["clearButtonPressed"]});this._bSearchEventDefaultBehavior?this._search(t):this._setSearchValue(t);this._updateSelectAllCheckBox()};u.prototype._search=function(e,t){var i,o,r,c,h,u,p,d,f=0,g=this.getBinding("items"),y=this.getBindingInfo("items");function S(e){return e instanceof sap.ui.model.odata.ODataModel||e instanceof sap.ui.model.odata.v2.ODataModel||e instanceof sap.ui.model.odata.v4.ODataModel}if(t||e!==this._searchValue){this._searchValue=e;if(y&&y.binding){i=y.binding.aFilters;if(i.length>0){f=i[0].aFilters.length;if(this._firstTime){this._saveBindInfo=i[0].aFilters[0][0];this._firstTime=false}}}if(g){if(e||f>0){d=y.template?y.template:y.factory();o=d.getBindingInfo("text").parts;h=o[0].path;if(h||h===""){r=[];o.forEach(function(t){r.push(new s(t.path,n.Contains,e))});if(this.getEnableCaseInsensitiveSearch()&&S(g.getModel())){r.forEach(function(e){e.bCaseSensitive=false})}p=new s(r,false);if(f>1){u=new s([p,this._saveBindInfo],true)}else{if(this._saveBindInfo>""&&c.sPath!=this._saveBindInfo.sPath){u=new s([p,this._saveBindInfo],true)}else{if(e==""){u=[]}else{u=new s([p],true)}}}g.filter(u,l.Control)}}else{g.filter([],l.Control)}}else{a.warning("No filtering performed","The list must be defined with a binding for search to work",this)}}};u.prototype._getSearchValue=function(){return this._searchValue};u.prototype._updateSelectAllCheckBox=function(){var e=this._getNonGroupItems(),t=e.length,i,s,o;function r(e){return e.getSelected()}if(this.getMultiSelect()){i=sap.ui.getCore().byId(this.getAssociation("allcheckbox"));s=t>0&&t===e.filter(r).length;o=this.getActive()&&s;i&&i.setSelected(o)}};u.prototype._addSelectedKey=function(e,t){if(!e&&!t){a.error("Both sKey and sText are not defined. At least one must be defined.");return}if(this.getMode()===c.SingleSelectMaster){this.removeSelectedKeys()}if(!e){e=t}this._oSelectedKeys[e]=t||e};u.prototype._removeSelectedKey=function(e,t){if(!e&&!t){a.error("Both sKey and sText are not defined. At least one must be defined.");return false}if(!e){e=t}delete this._oSelectedKeys[e];return true};u.prototype._setSearchValue=function(e){this._searchValue=e};u.prototype._isItemSelected=function(e){return!!this._oSelectedKeys[e&&(e.getKey()||e.getText())]};u.prototype._updateFacetFilterButtonText=function(){if(this.getParent()&&this.getParent()._setButtonText){this.getParent()._setButtonText(this)}};u.prototype._selectItemsByKeys=function(){this._getNonGroupItems().forEach(function(e){e.setSelected(this._isItemSelected(e))},this);this._updateFacetFilterButtonText()};u.prototype._handleSelectAllClick=function(e){var t,i,s=this._getNonGroupItems(),o=s.length;s.forEach(function(t){if(e){this._addSelectedKey(t.getKey(),t.getText())}else{this._removeSelectedKey(t.getKey(),t.getText())}t.setSelected(e,true)},this);function r(e){return e.getSelected()}if(this.getMode()===c.MultiSelect){i=o>0&&o===s.filter(r).length;t=this._getOriginalActiveState()||e&&i;this.setActive(t)}setTimeout(this._updateSelectAllCheckBox.bind(this),0)};u.prototype.onItemTextChange=function(e,t){var i=e.getKey();if(this._oSelectedKeys[i]&&t&&!this._filtering){this._oSelectedKeys[i]=t}};u.prototype.onItemSelectedChange=function(t,i){var s;if(i){this._addSelectedKey(t.getKey(),t.getText())}else{this._removeSelectedKey(t.getKey(),t.getText())}e.prototype.onItemSelectedChange.apply(this,arguments);if(this.getMode()===c.MultiSelect){s=this._getOriginalActiveState()||i||this.getSelectedItems().length>1;this.setActive(s)}!this.getDomRef()&&this.getParent()&&this.getParent().getDomRef()&&this.getParent().invalidate();setTimeout(this._updateSelectAllCheckBox.bind(this),0)};u.prototype.updateItems=function(t){var s=document.activeElement;this._filtering=t===i.Filter;e.prototype.updateItems.apply(this,arguments);this._filtering=false;if(s&&s.getAttribute("id")!==document.activeElement.getAttribute("id")){this.focus()}if(!this.getGrowing()||t===i.Filter){this._selectItemsByKeys()}};u.prototype._getOriginalActiveState=function(){return this._bOriginalActiveState};u.prototype._preserveOriginalActiveState=function(){this._bOriginalActiveState=this.getActive()};u.prototype._showBusyIndicator=function(){e.prototype._showBusyIndicator.apply(this,arguments);this.fireEvent("listItemsChange")};u.prototype._hideBusyIndicator=function(){e.prototype._hideBusyIndicator.apply(this,arguments);this.fireEvent("listItemsChange")};return u});