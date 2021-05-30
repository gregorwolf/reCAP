/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./ComboBoxTextField","./SuggestionsPopover","sap/ui/core/SeparatorItem","sap/ui/core/InvisibleText","sap/ui/base/ManagedObject","sap/base/Log","./library","sap/ui/Device","sap/ui/dom/containsOrEquals","sap/ui/events/KeyCodes","sap/ui/thirdparty/jquery","sap/m/inputUtils/highlightDOMElements","sap/m/inputUtils/ListHelpers"],function(t,e,i,s,o,n,r,a,u,p,h,l,g){"use strict";var d=r.PlacementType;var c=["value","enabled","name","placeholder","editable","textAlign","textDirection","valueState","valueStateText"];var f=t.extend("sap.m.ComboBoxBase",{metadata:{library:"sap.m",abstract:true,defaultAggregation:"items",properties:{showSecondaryValues:{type:"boolean",group:"Misc",defaultValue:false}},aggregations:{items:{type:"sap.ui.core.Item",multiple:true,singularName:"item",bindable:"bindable"},picker:{type:"sap.ui.core.PopupInterface",multiple:false,visibility:"hidden"}},events:{loadItems:{}},dnd:{draggable:false,droppable:true}}});f.prototype.oncompositionend=function(e){t.prototype.oncompositionend.apply(this,arguments);if(!a.browser.firefox){this.handleInputValidation(e,this.isComposingCharacter())}};f.prototype.updateItems=function(t){this.bItemsUpdated=false;this.destroyItems();this.updateAggregation("items");this.bItemsUpdated=true;if(this.hasLoadItemsEventListeners()){this.onItemsLoaded()}};f.prototype.setFilterFunction=function(t){if(t===null||t===undefined){this.fnFilter=null;return this}if(typeof t!=="function"){n.warning("Passed filter is not a function and the default implementation will be used")}else{this.fnFilter=t}return this};f.prototype.highlightList=function(t){var e=[];e=this._getList().$().find(".sapMSLIInfo, .sapMSLITitleOnly");l(e,t)};f.prototype._decoratePopupInput=function(t){if(t){this.setTextFieldHandler(t)}return t};f.prototype.setTextFieldHandler=function(t){var e=this,i=t._handleEvent;t._handleEvent=function(t){i.apply(this,arguments);if(/keydown|sapdown|sapup|saphome|sapend|sappagedown|sappageup|input/.test(t.type)){e._handleEvent(t)}}};f.prototype.refreshItems=function(){this.bItemsUpdated=false;this.refreshAggregation("items")};f.prototype.loadItems=function(t,e){var i=typeof t==="function";if(this.hasLoadItemsEventListeners()&&this.getItems().length===0){this._bOnItemsLoadedScheduled=false;if(i){e=h.extend({action:t,busyIndicator:true,busyIndicatorDelay:300},e);this.aMessageQueue.push(e);if(this.iLoadItemsEventInitialProcessingTimeoutID===-1&&e.busyIndicator){this.iLoadItemsEventInitialProcessingTimeoutID=setTimeout(function t(){this.setInternalBusyIndicatorDelay(0);this.setInternalBusyIndicator(true)}.bind(this),e.busyIndicatorDelay)}}if(!this.bProcessingLoadItemsEvent){this.bProcessingLoadItemsEvent=true;this.fireLoadItems()}}else if(i){t.call(this)}};f.prototype.onItemsLoaded=function(){this.bProcessingLoadItemsEvent=false;clearTimeout(this.iLoadItemsEventInitialProcessingTimeoutID);if(this.bInitialBusyIndicatorState!==this.getBusy()){this.setInternalBusyIndicator(this.bInitialBusyIndicatorState)}if(this.iInitialBusyIndicatorDelay!==this.getBusyIndicatorDelay()){this.setInternalBusyIndicatorDelay(this.iInitialBusyIndicatorDelay)}for(var t=0,e,i,s;t<this.aMessageQueue.length;t++){e=this.aMessageQueue.shift();t--;s=t+1===this.aMessageQueue.length;i=s?null:this.aMessageQueue[t+1];if(typeof e.action==="function"){if(e.name==="input"&&!s&&i.name==="input"){continue}e.action.call(this)}}};f.prototype.hasLoadItemsEventListeners=function(){return this.hasListeners("loadItems")};f.prototype._scheduleOnItemsLoadedOnce=function(){if(!this._bOnItemsLoadedScheduled&&!this.isBound("items")&&this.hasLoadItemsEventListeners()&&this.bProcessingLoadItemsEvent){this._bOnItemsLoadedScheduled=true;setTimeout(this.onItemsLoaded.bind(this),0)}};f.prototype.getPickerInvisibleTextId=function(){return s.getStaticId("sap.m","COMBOBOX_AVAILABLE_OPTIONS")};f.prototype._getGroupHeaderInvisibleText=function(){if(!this._oGroupHeaderInvisibleText){this._oGroupHeaderInvisibleText=new s;this._oGroupHeaderInvisibleText.toStatic()}return this._oGroupHeaderInvisibleText};f.prototype._isListInSuggestMode=function(){return this._getList().getItems().some(function(t){return!t.getVisible()&&g.getItemByListItem(this.getItems(),t).getEnabled()},this)};f.prototype.getSelectable=function(t){return t._bSelectable};f.prototype._setItemsShownWithFilter=function(t){this._bItemsShownWithFilter=t};f.prototype._getItemsShownWithFilter=function(){return this._bItemsShownWithFilter};f.prototype.init=function(){t.prototype.init.apply(this,arguments);this.setPickerType(a.system.phone?"Dialog":"Dropdown");this._setItemsShownWithFilter(false);this.bItemsUpdated=false;this.bOpenedByKeyboardOrButton=false;this._bShouldClosePicker=false;this.bProcessingLoadItemsEvent=false;this.iLoadItemsEventInitialProcessingTimeoutID=-1;this.aMessageQueue=[];this.bInitialBusyIndicatorState=this.getBusy();this.iInitialBusyIndicatorDelay=this.getBusyIndicatorDelay();this._bOnItemsLoadedScheduled=false;this._bDoTypeAhead=true;this.getIcon().addEventDelegate({onmousedown:function(t){this._bShouldClosePicker=this.isOpen()}},this);this.getIcon().attachPress(this._handlePopupOpenAndItemsLoad.bind(this,true,this));this.fnFilter=null};f.prototype.onBeforeRendering=function(){var e=this.isOpen(),i=e?this._getSuggestionsPopover()._getValueStateHeader().getText():null,s=e?this._getSuggestionsPopover()._getValueStateHeader().getValueState():null;t.prototype.onBeforeRendering.apply(this,arguments);if(e&&(this.getValueStateText()&&i!==this.getValueStateText()||this.getValueState()!==s||this.getFormattedValueStateText())){this._updateSuggestionsPopoverValueState()}};f.prototype._handlePopupOpenAndItemsLoad=function(t,e){var i;if(!this.getEnabled()||!this.getEditable()){return}if(t&&this._getItemsShownWithFilter()){this._bShouldClosePicker=false;this.toggleIconPressedStyle(true);this.bOpenedByKeyboardOrButton=false;this.clearFilter();this._setItemsShownWithFilter(false);return}if(this._bShouldClosePicker){this._bShouldClosePicker=false;this.close();return}this.loadItems();this.bOpenedByKeyboardOrButton=t;if(this.isPlatformTablet()){this.syncPickerContent();i=this.getPicker();i.setInitialFocus(i)}if(e){i=this.getPicker();i&&i.setInitialFocus(e)}this.open()};f.prototype.exit=function(){t.prototype.exit.apply(this,arguments);if(this._getGroupHeaderInvisibleText()){this._getGroupHeaderInvisibleText().destroy();this._oGroupHeaderInvisibleText=null}if(this._oSuggestionPopover){this._oSuggestionPopover.destroy();this._oSuggestionPopover=null}clearTimeout(this.iLoadItemsEventInitialProcessingTimeoutID);this.aMessageQueue=null;this.fnFilter=null};f.prototype.onsapshow=function(t){if(!this.getEnabled()||!this.getEditable()){return}t.setMarked();if(t.keyCode===p.F4){this.onF4(t)}if(this._getItemsShownWithFilter()){this.loadItems(this._handlePopupOpenAndItemsLoad.bind(this,true));return}if(this.isOpen()){this.close();return}this.selectText(0,this.getValue().length);this.loadItems();this.bOpenedByKeyboardOrButton=true;this.open()};f.prototype.onF4=function(t){t.preventDefault()};f.prototype.onsapescape=function(e){if(this.getEnabled()&&this.getEditable()&&this.isOpen()){e.setMarked();e.preventDefault();this.close()}else{t.prototype.onsapescape.apply(this,arguments)}};f.prototype.onsaphide=f.prototype.onsapshow;f.prototype.onsapfocusleave=function(e){if(!e.relatedControlId){t.prototype.onsapfocusleave.apply(this,arguments);return}var i=sap.ui.getCore().byId(e.relatedControlId);if(i===this){return}var s=this.getPicker(),o=i&&i.getFocusDomRef();if(s&&u(s.getFocusDomRef(),o)){return}t.prototype.onsapfocusleave.apply(this,arguments)};f.prototype.getPopupAnchorDomRef=function(){return this.getDomRef()};f.prototype.addContent=function(t){};f.prototype.getList=function(){n.warning("[Warning]:","You are attempting to use deprecated method 'getList()', please refer to SAP note 2746748.",this);return this._getList()};f.prototype._getList=function(){var t=this._oSuggestionPopover&&this._oSuggestionPopover.getItemsContainer();if(this.bIsDestroyed||!t){return null}return t};f.prototype.setPickerType=function(t){this._sPickerType=t};f.prototype.getPickerType=function(){return this._sPickerType};f.prototype._updateSuggestionsPopoverValueState=function(){var t=this._getSuggestionsPopover();if(!t){return}var e=this.getValueState(),i=this.getValueState()!==t._getValueStateHeader().getValueState(),s=this.getFormattedValueStateText(),o=this.getValueStateText(),n=s||i;if(t.isOpen()&&!n){this.setFormattedValueStateText(t._getValueStateHeader().getFormattedText())}t.updateValueState(e,s||o,this.getShowValueStateMessage())};f.prototype.shouldValueStateMessageBeOpened=function(){var e=t.prototype.shouldValueStateMessageBeOpened.apply(this,arguments);return e&&!this.isOpen()};f.prototype.onPropertyChange=function(t,e){var i=t.getParameter("newValue"),s=t.getParameter("name"),o="set"+s.charAt(0).toUpperCase()+s.slice(1),n=e&&e.srcControl||this.getPickerTextField();if(this.getInputForwardableProperties().indexOf(s)>-1&&n&&typeof n[o]==="function"){n[o](i)}};f.prototype.getInputForwardableProperties=function(){return c};f.prototype.isPickerDialog=function(){return this.getPickerType()==="Dialog"};f.prototype.isPlatformTablet=function(){var t=!a.system.combi,e=a.system.tablet&&t;return e};f.prototype.getDropdownSettings=function(){return{showArrow:false,placement:d.VerticalPreferredBottom,offsetX:0,offsetY:0,bounce:false,ariaLabelledBy:this.getPickerInvisibleTextId()||undefined}};f.prototype._configureList=function(){};f.prototype.createPicker=function(t){var e=this.getAggregation("picker");if(e){return e}this._oSuggestionPopover=this._createSuggestionsPopover();e=this._oSuggestionPopover.getPopover();this.setAggregation("picker",e,true);this.configPicker(e);return e};f.prototype.configPicker=function(t){};f.prototype._hasShowSelectedButton=function(){return false};f.prototype._createSuggestionsPopover=function(){var t=new e(this);t.decorateParent(this);t.createSuggestionPopup(this,{showSelectedButton:this._hasShowSelectedButton()});this._decoratePopupInput(t.getInput());t.initContent(this.getId());this.forwardEventHandlersToSuggPopover(t);this._configureList(t.getItemsContainer());return t};f.prototype.forwardEventHandlersToSuggPopover=function(t){t.setOkPressHandler(this._handleOkPress.bind(this));t.setCancelPressHandler(this._handleCancelPress.bind(this));t.setInputLabels(this.getLabels.bind(this))};f.prototype._handleOkPress=function(){var t=this,e=t.getPickerTextField();t.updateDomValue(e.getValue());t.onChange();t.close()};f.prototype._handleCancelPress=function(){this.close();this.revertSelection()};f.prototype.setSelectable=function(t,e){if(this.indexOfItem(t)<0){return}t._bSelectable=e;var i=g.getListItem(t);if(i){i.setVisible(e)}};f.prototype.onBeforeOpen=function(){this._updateSuggestionsPopoverValueState();if(!this._getItemsShownWithFilter()){this.toggleIconPressedStyle(true)}};f.prototype.onBeforeClose=function(){this.bOpenedByKeyboardOrButton=false;this._setItemsShownWithFilter(false);this._updateSuggestionsPopoverValueState()};f.prototype.getPicker=function(){var t=this.getAggregation("picker");if(t&&!t.bIsDestroyed&&!this.bIsDestroyed){return t}return null};f.prototype._getSuggestionsPopover=function(){return this._oSuggestionPopover};f.prototype.getValueStateLinks=function(){var t=this.getPicker()&&this.getPicker().getCustomHeader()&&typeof this.getPicker().getCustomHeader().getFormattedText==="function",e=t&&this.getPicker().getCustomHeader().getFormattedText(),i=e&&e.getControls();return i||[]};f.prototype.getPickerTextField=function(){var t=this._getSuggestionsPopover();return t?t.getInput():null};f.prototype.getPickerTitle=function(){var t=this.getPicker(),e=t&&t.getCustomHeader();if(this.isPickerDialog()&&e){return e.getContentMiddle()[0]}return null};f.prototype.revertSelection=function(){};f.prototype.hasContent=function(){return this.getItems().length>0};f.prototype.syncPickerContent=function(){};f.prototype.open=function(){var t=this.getPicker();if(t){t.open()}return this};f.prototype.getVisibleItems=function(){return g.getVisibleItems(this.getItems())};f.prototype.isItemSelected=function(){};f.prototype.getKeys=function(t){t=t||this.getItems();for(var e=0,i=[];e<t.length;e++){i[e]=t[e].getKey()}return i};f.prototype.findItem=function(t,e){var i="get"+t.charAt(0).toUpperCase()+t.slice(1);for(var s=0,o=this.getItems();s<o.length;s++){if(o[s][i]()===e){return o[s]}}return null};f.prototype.getItemByText=function(t){return this.findItem("text",t)};f.prototype.clearFilter=function(){this.getItems().forEach(function(t){var e=g.getListItem(t);if(e){e.setVisible(t.getEnabled()&&this.getSelectable(t))}},this)};f.prototype.onItemChange=function(t){};f.prototype.clearSelection=function(){};f.prototype.setInternalBusyIndicator=function(t){this.bInitialBusyIndicatorState=this.getBusy();return this.setBusy.apply(this,arguments)};f.prototype.setInternalBusyIndicatorDelay=function(t){this.iInitialBusyIndicatorDelay=this.getBusyIndicatorDelay();return this.setBusyIndicatorDelay.apply(this,arguments)};f.prototype.addItem=function(t){this.addAggregation("items",t);if(t){t.attachEvent("_change",this.onItemChange,this)}if(this._getList()){this._getList().addItem(this._mapItemToListItem(t))}return this};f.prototype.insertItem=function(t,e){this.insertAggregation("items",t,e,true);if(t){t.attachEvent("_change",this.onItemChange,this)}if(this._getList()){this._getList().insertItem(this._mapItemToListItem(t),e)}this._scheduleOnItemsLoadedOnce();return this};f.prototype.getItemAt=function(t){return this.getItems()[+t]||null};f.prototype.getFirstItem=function(){return this.getItems()[0]||null};f.prototype.getLastItem=function(){var t=this.getItems();return t[t.length-1]||null};f.prototype.getEnabledItems=function(t){return g.getEnabledItems(t||this.getItems())};f.prototype.getItemByKey=function(t){return this.findItem("key",t)};f.prototype.addItemGroup=function(t,e,s){e=e||new i({text:o.escapeSettingsValue(t.text)||o.escapeSettingsValue(t.key)});this.addAggregation("items",e,s);if(this._getList()&&e.isA("sap.ui.core.SeparatorItem")){this._getList().addItem(this._mapItemToListItem(e))}return e};f.prototype.isOpen=function(){var t=this.getPicker();return!!(t&&t.isOpen())};f.prototype.close=function(){var t=this.getPicker();if(t){t.close()}return this};f.prototype.removeItem=function(t){t=this.removeAggregation("items",t);if(t){t.detachEvent("_change",this.onItemChange,this)}return t};f.prototype.removeAllItems=function(){var t=this.removeAllAggregation("items");this.clearSelection();for(var e=0;e<t.length;e++){t[e].detachEvent("_change",this.onItemChange,this)}return t};f.prototype.intersectItems=function(t,e){return t.filter(function(t){return e.map(function(t){return t.getId()}).indexOf(t.getId())!==-1})};f.prototype.showItems=function(t){var e=this.fnFilter,i=function(){if(!this.getItems().length){return}this.detachLoadItems(i);this.setFilterFunction(t||function(){return true});this.applyShowItemsFilters();this._handlePopupOpenAndItemsLoad(false,this);this.setFilterFunction(e)}.bind(this);if(!this.getEnabled()||!this.getEditable()){return}this._setItemsShownWithFilter(true);this.attachLoadItems(i);this.loadItems(i)};f.prototype.applyShowItemsFilters=function(){};return f});