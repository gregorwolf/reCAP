/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Control","sap/ui/core/Core","sap/ui/core/delegate/ItemNavigation","./IconTabBarDragAndDropUtil","sap/ui/core/library","./IconTabBarSelectListRenderer","sap/ui/thirdparty/jquery"],function(e,t,o,i,r,n,a,s){"use strict";var g=n.dnd.DropPosition;var l=t.extend("sap.m.IconTabBarSelectList",{metadata:{library:"sap.m",aggregations:{items:{type:"sap.m.IconTab",multiple:true,singularName:"item",dnd:true}},events:{selectionChange:{parameters:{selectedItem:{type:"sap.m.IconTabFilter"}}}}}});l.prototype.init=function(){this._oItemNavigation=new i;this._oItemNavigation.setCycling(false);this.addEventDelegate(this._oItemNavigation);this._oItemNavigation.setPageSize(10);this._oIconTabHeader=null;this._oTabFilter=null};l.prototype.exit=function(){this._oItemNavigation.destroy();this._oItemNavigation=null;this._oIconTabHeader=null;this._oTabFilter=null};l.prototype.onBeforeRendering=function(){if(!this._oIconTabHeader){return}this.destroyDragDropConfig();this._setsDragAndConfiguration()};l.prototype.onAfterRendering=function(){this._initItemNavigation();this.getItems().forEach(function(e){if(e._onAfterParentRendering){e._onAfterParentRendering()}})};l.prototype._setsDragAndConfiguration=function(){if(this._oIconTabHeader.getEnableTabReordering()&&!this.getDragDropConfig().length){r.setDragDropAggregations(this,"Vertical",this._oIconTabHeader._getDropPosition())}};l.prototype._initItemNavigation=function(){var e=this.getItems(),t=[],o=this._oIconTabHeader.oSelectedItem,i=-1,r,n;for(n=0;n<e.length;n++){r=e[n];if(r.isA("sap.m.IconTabFilter")){var a=r._getAllSubFiltersDomRefs();t=t.concat(r.getDomRef(),a)}if(o&&this.getSelectedItem()&&this.getSelectedItem()._getRealTab()===o){i=n}}if(o&&t.indexOf(o.getDomRef())!==-1){i=t.indexOf(o.getDomRef())}this._oItemNavigation.setRootDomRef(this.getDomRef()).setItemDomRefs(t).setSelectedIndex(i)};l.prototype.getVisibleItems=function(){return this.getItems().filter(function(e){return e.getVisible()})};l.prototype.getVisibleTabFilters=function(){return this.getVisibleItems().filter(function(e){return e.isA("sap.m.IconTabFilter")})};l.prototype.setSelectedItem=function(e){this._selectedItem=e};l.prototype.getSelectedItem=function(){return this._selectedItem};l.prototype._getIconTabHeader=function(){return this._oIconTabHeader};l.prototype.ontap=function(e){var t=e.srcControl;if(!t){return}if(!t.isA("sap.m.IconTabFilter")){return}if(this._oIconTabHeader._isUnselectable(t)){return}e.preventDefault();if(t!=this.getSelectedItem()){this.fireSelectionChange({selectedItem:t})}};l.prototype.onsapenter=l.prototype.ontap;l.prototype.onsapspace=l.prototype.ontap;l.prototype.checkIconOnly=function(){this._bIconOnly=this.getVisibleTabFilters().every(function(e){return!e.getText()&&!e.getCount()});return this._bIconOnly};l.prototype._handleDragAndDrop=function(e){var t=e.getParameter("dropPosition"),o=e.getParameter("draggedControl"),i=e.getParameter("droppedControl"),n=i._getRealTab().getParent(),a=this._oIconTabHeader.getMaxNestingLevel();if(this._oTabFilter._isOverflow()){n=this._oIconTabHeader}if(t===g.On){n=i._getRealTab()}r.handleDrop(n,t,o._getRealTab(),i._getRealTab(),true,a);this._oIconTabHeader._setItemsForStrip();this._oIconTabHeader._initItemNavigation();this._oTabFilter._setSelectListItems();this._initItemNavigation();i._getRealTab().getParent().$().trigger("focus")};l.prototype.ondragrearranging=function(e){if(!this._oIconTabHeader.getEnableTabReordering()){return}var t=e.srcControl,o=e.keyCode,i=this.indexOfItem(t),n=this;r.moveItem.call(n,t,o,n.getItems().length-1);this._initItemNavigation();t.$().trigger("focus");if(i===this.indexOfItem(t)){return}n=t._getRealTab().getParent();if(this._oTabFilter._isOverflow()&&t._getRealTab()._getNestedLevel()===1){this._oIconTabHeader._moveTab(t._getRealTab(),o,this._oIconTabHeader.getItems().length-1)}else{r.moveItem.call(n,t._getRealTab(),o,n.getItems().length-1)}};l.prototype.onsaphomemodifiers=l.prototype.ondragrearranging;l.prototype.onsapendmodifiers=l.prototype.ondragrearranging;l.prototype.onsapincreasemodifiers=l.prototype.ondragrearranging;l.prototype.onsapdecreasemodifiers=l.prototype.ondragrearranging;return l});