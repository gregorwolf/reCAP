/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/Device","sap/ui/core/LocaleData","sap/ui/core/delegate/ItemNavigation","sap/ui/unified/calendar/CalendarUtils","sap/ui/unified/calendar/CalendarDate","sap/ui/unified/DateRange","sap/ui/unified/DateTypeRange","sap/ui/unified/library","sap/ui/core/format/DateFormat","sap/ui/core/library","sap/ui/core/Locale","./MonthRenderer","sap/ui/dom/containsOrEquals","sap/ui/events/KeyCodes","sap/ui/thirdparty/jquery"],function(e,t,a,i,r,s,o,n,l,h,g,d,u,c,p,y){"use strict";var f=g.CalendarType;var D=l.CalendarDayType;var m=e.extend("sap.ui.unified.calendar.Month",{metadata:{library:"sap.ui.unified",properties:{date:{type:"object",group:"Data"},intervalSelection:{type:"boolean",group:"Behavior",defaultValue:false},singleSelection:{type:"boolean",group:"Behavior",defaultValue:true},showHeader:{type:"boolean",group:"Appearance",defaultValue:false},firstDayOfWeek:{type:"int",group:"Appearance",defaultValue:-1},nonWorkingDays:{type:"int[]",group:"Appearance",defaultValue:null},primaryCalendarType:{type:"sap.ui.core.CalendarType",group:"Appearance"},secondaryCalendarType:{type:"sap.ui.core.CalendarType",group:"Appearance"},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},showWeekNumbers:{type:"boolean",group:"Appearance",defaultValue:true}},aggregations:{selectedDates:{type:"sap.ui.unified.DateRange",multiple:true,singularName:"selectedDate"},specialDates:{type:"sap.ui.unified.DateTypeRange",multiple:true,singularName:"specialDate"},disabledDates:{type:"sap.ui.unified.DateRange",multiple:true,singularName:"disabledDate"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},legend:{type:"sap.ui.unified.CalendarLegend",multiple:false}},events:{select:{},focus:{parameters:{date:{type:"object"},otherMonth:{type:"boolean"},restoreOldDate:{type:"boolean"}}},weekNumberSelect:{allowPreventDefault:true,parameters:{weekNumber:{type:"int"},weekDays:{type:"sap.ui.unified.DateRange"}}}}}});m.prototype.init=function(){var e=sap.ui.getCore().getConfiguration().getCalendarType();this.setProperty("primaryCalendarType",e);this.setProperty("secondaryCalendarType",e);this._oFormatYyyymmdd=h.getInstance({pattern:"yyyyMMdd",calendarType:f.Gregorian});this._oFormatLong=h.getInstance({style:"long",calendarType:e});this._mouseMoveProxy=y.proxy(this._handleMouseMove,this);this._iColumns=7;this._aVisibleDays=[]};m.prototype._getAriaRole=function(){return"gridcell"};m.prototype.exit=function(){if(this._oItemNavigation){this.removeDelegate(this._oItemNavigation);this._oItemNavigation.destroy();delete this._oItemNavigation}if(this._sInvalidateMonth){clearTimeout(this._sInvalidateMonth)}this._aVisibleDays=null};m.prototype.getFocusDomRef=function(){return this.getDomRef()&&this._oItemNavigation.getItemDomRefs()[this._oItemNavigation.getFocusedIndex()]};m.prototype.onAfterRendering=function(){v.call(this);M.call(this)};m.prototype.onmouseover=function(e){var t=y(e.target),a=this.getSelectedDates()[0],i,r;if(!this._isMarkingUnfinishedRangeAllowed()){return}if(!t.hasClass("sapUiCalItemText")&&!t.hasClass("sapUiCalItem")){return}if(t.hasClass("sapUiCalItemText")){t=t.parent()}i=parseInt(this._oFormatYyyymmdd.format(a.getStartDate()));r=t.data("sapDay");if(this.hasListeners("datehovered")){this.fireEvent("datehovered",{date1:i,date2:r})}else{this._markDatesBetweenStartAndHoveredDate(i,r)}};m.prototype._markDatesBetweenStartAndHoveredDate=function(e,t){var a,i,r,s;a=this.$().find(".sapUiCalItem");if(e>t){e=e+t;t=e-t;e=e-t}for(s=0;s<a.length;s++){i=y(a[s]);r=i.data("sapDay");if(r>e&&r<t){i.addClass("sapUiCalItemSelBetween")}else{i.removeClass("sapUiCalItemSelBetween")}}};m.prototype.onsapfocusleave=function(e){if(!e.relatedControlId||!c(this.getDomRef(),sap.ui.getCore().byId(e.relatedControlId).getFocusDomRef())){if(this._bMouseMove){this._unbindMousemove(true);var t=this._selectDay(this._getDate());if(!t&&this._oMoveSelectedDate){this._selectDay(this._oMoveSelectedDate)}this._bMoveChange=false;this._bMousedownChange=false;this._oMoveSelectedDate=undefined;b.call(this)}if(this._bMousedownChange){this._bMousedownChange=false;b.call(this)}}};m.prototype.removeAllSelectedDates=function(){this._bDateRangeChanged=true;var e=this.removeAllAggregation("selectedDates");return e};m.prototype.destroySelectedDates=function(){this._bDateRangeChanged=true;var e=this.destroyAggregation("selectedDates");return e};m.prototype.removeAllSpecialDates=function(){this._bDateRangeChanged=true;var e=this.removeAllAggregation("specialDates");return e};m.prototype.destroySpecialDates=function(){this._bDateRangeChanged=true;var e=this.destroyAggregation("specialDates");return e};m.prototype.removeAllDisabledDates=function(){this._bDateRangeChanged=true;var e=this.removeAllAggregation("disabledDates");return e};m.prototype.destroyDisabledDates=function(){this._bDateRangeChanged=true;var e=this.destroyAggregation("disabledDates");return e};m.prototype.setDate=function(e){if(e){var t=s.fromLocalJSDate(e,this.getPrimaryCalendarType());C.call(this,t,false)}return this.setProperty("date",e)};m.prototype._getDate=function(){if(!this._oDate){this._oDate=s.fromLocalJSDate(new Date,this.getPrimaryCalendarType())}return this._oDate};m.prototype.displayDate=function(e){var t=s.fromLocalJSDate(e,this.getPrimaryCalendarType());C.call(this,t,true);return this};m.prototype.setPrimaryCalendarType=function(e){this.setProperty("primaryCalendarType",e);this._oFormatLong=h.getInstance({style:"long",calendarType:e});if(this._oDate){this._oDate=new s(this._oDate,e)}return this};m.prototype.setSecondaryCalendarType=function(e){this._bSecondaryCalendarTypeSet=true;this.setProperty("secondaryCalendarType",e);this._oFormatSecondaryLong=h.getInstance({style:"long",calendarType:e});return this};m.prototype._getSecondaryCalendarType=function(){var e;if(this._bSecondaryCalendarTypeSet){e=this.getSecondaryCalendarType();var t=this.getPrimaryCalendarType();if(e===t){e=undefined}}return e};m.prototype._getLocale=function(){var e=this.getParent();if(e&&e.getLocale){return e.getLocale()}else if(!this._sLocale){this._sLocale=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale().toString()}return this._sLocale};m.prototype._getLocaleData=function(){var e=this.getParent();if(e&&e._getLocaleData){return e._getLocaleData()}else if(!this._oLocaleData){var t=this._getLocale();var i=new d(t);this._oLocaleData=a.getInstance(i)}return this._oLocaleData};m.prototype._getFormatLong=function(){var e=this._getLocale();if(this._oFormatLong.oLocale.toString()!==e){var t=new d(e);this._oFormatLong=h.getInstance({style:"long",calendarType:this.getPrimaryCalendarType()},t);if(this._oFormatSecondaryLong){this._oFormatSecondaryLong=h.getInstance({style:"long",calendarType:this._getSecondaryCalendarType()},t)}}return this._oFormatLong};m.prototype.getIntervalSelection=function(){var e=this.getParent();if(e&&e.getIntervalSelection){return e.getIntervalSelection()}else{return this.getProperty("intervalSelection")}};m.prototype.getSingleSelection=function(){var e=this.getParent();if(e&&e.getSingleSelection){return e.getSingleSelection()}else{return this.getProperty("singleSelection")}};m.prototype.getSelectedDates=function(){var e=this.getParent();if(e&&e.getSelectedDates){return e.getSelectedDates()}else{return this.getAggregation("selectedDates",[])}};m.prototype.getSpecialDates=function(){var e=this.getParent();if(e&&e.getSpecialDates){return e.getSpecialDates()}else{return this.getAggregation("specialDates",[])}};m.prototype.getDisabledDates=function(){var e=this.getParent();if(e&&e.getDisabledDates){return e.getDisabledDates()}else{return this.getAggregation("disabledDates",[])}};m.prototype.getPrimaryCalendarType=function(){var e=this.getParent();if(e&&e.getPrimaryCalendarType){return e.getPrimaryCalendarType()}return this.getProperty("primaryCalendarType")};m.prototype._getShowHeader=function(){var e=this.getParent();if(e&&e._getShowMonthHeader){return e._getShowMonthHeader()}else{return this.getProperty("showHeader")}};m.prototype.getAriaLabelledBy=function(){var e=this.getParent();if(e&&e.getAriaLabelledBy){return e.getAriaLabelledBy()}else{return this.getAssociation("ariaLabelledBy",[])}};m.prototype.getLegend=function(){var e=this.getParent();if(e&&e.getLegend){return e.getLegend()}else{return this.getAssociation("legend",[])}};m.prototype._getFirstDayOfWeek=function(){var e=this.getParent();var t=0;if(e&&e.getFirstDayOfWeek){t=e.getFirstDayOfWeek()}else{t=this.getProperty("firstDayOfWeek")}if(t<0||t>6){var a=this._getLocaleData();t=a.getFirstDayOfWeek()}return t};m.prototype._getNonWorkingDays=function(){var e=this.getParent();var t;if(e&&e.getNonWorkingDays){t=e.getNonWorkingDays()}else{t=this.getProperty("nonWorkingDays")}if(t&&!Array.isArray(t)){t=[]}return t};m.prototype._checkDateSelected=function(e){r._checkCalendarDate(e);var t=0;var a=this.getSelectedDates();var i=e.toUTCJSDate().getTime();var o=this.getPrimaryCalendarType();for(var n=0;n<a.length;n++){var l=a[n];var h=l.getStartDate();var g=0;if(h){h=s.fromLocalJSDate(h,o);g=h.toUTCJSDate().getTime()}var d=l.getEndDate();var u=0;if(d){d=s.fromLocalJSDate(d,o);u=d.toUTCJSDate().getTime()}if(i===g&&!d){t=1;break}else if(i===g&&d){t=2;if(d&&i===u){t=5}break}else if(d&&i===u){t=3;break}else if(d&&i>g&&i<u){t=4;break}if(this.getSingleSelection()){break}}return t};m.prototype._getDateTypes=function(e){r._checkCalendarDate(e);var t,a,i,s=[];var o=this._getSpecialDates();var n=e.toUTCJSDate().getTime();var l=new Date(Date.UTC(0,0,1));for(var h=0;h<o.length;h++){var g=o[h];var d=g.getStartDate();var u=r.MAX_MILLISECONDS;if(d){l.setUTCFullYear(d.getFullYear(),d.getMonth(),d.getDate());u=l.getTime()}var c=g.getEndDate();var p=-r.MAX_MILLISECONDS;if(c){l.setUTCFullYear(c.getFullYear(),c.getMonth(),c.getDate());p=l.getTime()}i=g.getType()===D.NonWorking;if(n===u&&!c||n>=u&&n<=p){if(!i&&!t){t={type:g.getType(),tooltip:g.getTooltip_AsString(),color:g.getColor()};s.push(t)}else if(i&&!a){a={type:g.getType(),tooltip:g.getTooltip_AsString()};s.push(a)}if(t&&a){break}}}return s};m.prototype._checkDateEnabled=function(e){r._checkCalendarDate(e);var t=true;var a=this.getDisabledDates();var i=e.toUTCJSDate().getTime();var o=this.getPrimaryCalendarType();var n=this.getParent();if(n&&n._oMinDate&&n._oMaxDate){if(i<n._oMinDate.valueOf()||i>n._oMaxDate.valueOf()){return false}}for(var l=0;l<a.length;l++){var h=a[l];var g=h.getStartDate();var d=0;if(g){g=s.fromLocalJSDate(g,o);d=g.toUTCJSDate().getTime()}var u=h.getEndDate();var c=0;if(u){u=s.fromLocalJSDate(u,o);c=u.toUTCJSDate().getTime()}if(u){if(i>d&&i<c){t=false;break}}else if(i===d){t=false;break}}return t};m.prototype._handleMouseMove=function(e){if(!this.$().is(":visible")){this._unbindMousemove(true)}var t=y(e.target);if(t.hasClass("sapUiCalItemText")){t=t.parent()}if(this._sLastTargetId&&this._sLastTargetId===t.attr("id")){return}this._sLastTargetId=t.attr("id");if(t.hasClass("sapUiCalItem")){var a=this._getDate();if(c(this.getDomRef(),e.target)){var i=s.fromLocalJSDate(this._oFormatYyyymmdd.parse(t.attr("data-sap-day")),this.getPrimaryCalendarType());if(!i.isSame(a)){if(t.hasClass("sapUiCalItemOtherMonth")){this.fireFocus({date:i.toLocalJSDate(),otherMonth:true})}else{this._oDate=i;var r=this._selectDay(i,true);if(r){this._oMoveSelectedDate=new s(i,this.getPrimaryCalendarType())}this._bMoveChange=true}}}}};m.prototype.onmousedown=function(e){this._oMousedownPosition={clientX:e.clientX,clientY:e.clientY};if(!!e.button||t.support.touch||!this._isWeekSelectionAllowed()||!e.target.classList.contains("sapUiCalWeekNum")){return}var a=y(e.target),i=a.siblings().eq(0).attr("data-sap-day"),r=this._oFormatYyyymmdd.parse(i),o=s.fromLocalJSDate(r,this.getPrimaryCalendarType());this._handleWeekSelection(o,true)};m.prototype.onmouseup=function(e){var a=e.button!==2;if(this._bMouseMove){this._unbindMousemove(true);var i=this._getDate();var r=this._oItemNavigation.getItemDomRefs();for(var s=0;s<r.length;s++){var o=y(r[s]);if(!o.hasClass("sapUiCalItemOtherMonth")){if(o.attr("data-sap-day")===this._oFormatYyyymmdd.format(i.toUTCJSDate(),true)){o.trigger("focus");break}}}if(this._bMoveChange){var n=this._selectDay(i);if(!n&&this._oMoveSelectedDate){this._selectDay(this._oMoveSelectedDate)}this._bMoveChange=false;this._bMousedownChange=false;this._oMoveSelectedDate=undefined;b.call(this)}}if(this._bMousedownChange){this._bMousedownChange=false;b.call(this)}else if(t.support.touch&&a&&this._areMouseEventCoordinatesInThreshold(e.clientX,e.clientY,10)){var l=e.target.classList,h=l.contains("sapUiCalItemText")||l.contains("sapUiCalDayName"),g=l.contains("sapUiCalWeekNum"),d=this._getSelectedDateFromEvent(e);if(g&&this._isWeekSelectionAllowed()){this._handleWeekSelection(d,true)}else if(h&&e.shiftKey&&this._isConsecutiveDaysSelectionAllowed()){this._handleConsecutiveDaysSelection(d)}else if(h){this._selectDay(d,false,false);b.call(this)}}};m.prototype.onsapselect=function(e){if(this.bSpaceButtonPressed){return}var t=this._selectDay(this._getSelectedDateFromEvent(e));if(t){b.call(this)}e.stopPropagation();e.preventDefault()};m.prototype.onkeydown=function(e){if(e.which===p.SPACE){this.bSpaceButtonPressed=true}};m.prototype.onkeyup=function(e){if(e.which===p.SPACE){this.bSpaceButtonPressed=false}};m.prototype.onsapselectmodifiers=function(e){var t=this._getSelectedDateFromEvent(e),a;if(this._isWeekSelectionAllowed()&&e.shiftKey&&e.keyCode===p.SPACE){a=r._getFirstDateOfWeek(t);this._handleWeekSelection(a,false)}else if(this._isConsecutiveDaysSelectionAllowed()&&e.shiftKey&&e.keyCode===p.ENTER){this._handleConsecutiveDaysSelection(t)}e.preventDefault()};m.prototype.onsappageupmodifiers=function(e){var t=new s(this._getDate(),this.getPrimaryCalendarType());var a=t.getYear();if(e.metaKey||e.ctrlKey){t.setYear(a-10)}else{t.setYear(a-1)}this.fireFocus({date:t.toLocalJSDate(),otherMonth:true});e.preventDefault()};m.prototype.onsappagedownmodifiers=function(e){var t=new s(this._getDate(),this.getPrimaryCalendarType());var a=t.getYear();if(e.metaKey||e.ctrlKey){t.setYear(a+10)}else{t.setYear(a+1)}this.fireFocus({date:t.toLocalJSDate(),otherMonth:true});e.preventDefault()};m.prototype._isValueInThreshold=function(e,t,a){var i=e-a,r=e+a;return t>=i&&t<=r};m.prototype._areMouseEventCoordinatesInThreshold=function(e,t,a){return this._oMousedownPosition&&this._isValueInThreshold(this._oMousedownPosition.clientX,e,a)&&this._isValueInThreshold(this._oMousedownPosition.clientY,t,a)?true:false};m.prototype._bindMousemove=function(e){y(window.document).on("mousemove",this._mouseMoveProxy);this._bMouseMove=true;if(e){this.fireEvent("_bindMousemove")}};m.prototype._unbindMousemove=function(e){y(window.document).off("mousemove",this._mouseMoveProxy);this._bMouseMove=undefined;this._sLastTargetId=undefined;if(e){this.fireEvent("_unbindMousemove")}};m.prototype.onThemeChanged=function(){if(this._bNoThemeChange||!this.getDomRef()){return}var e=this.getDomRef().querySelectorAll(".sapUiCalWH:not(.sapUiCalDummy)"),t=this._getLocaleData(),a=this._getFirstWeekDay(),i=t.getDaysStandAlone("abbreviated",this.getPrimaryCalendarType()),r,s;this._bNamesLengthChecked=undefined;this._bLongWeekDays=undefined;for(s=0;s<e.length;s++){r=e[s];r.textContent=i[(s+a)%7]}M.call(this)};m.prototype._handleBorderReached=function(e){var t=e.getParameter("event");var a=0;var i=this._getDate();var r=new s(i,this.getPrimaryCalendarType());if(t.type){switch(t.type){case"sapnext":case"sapnextmodifiers":if(t.keyCode===p.ARROW_DOWN){r.setDate(r.getDate()+7)}else{r.setDate(r.getDate()+1)}break;case"sapprevious":case"sappreviousmodifiers":if(t.keyCode===p.ARROW_UP){r.setDate(r.getDate()-7)}else{r.setDate(r.getDate()-1)}break;case"sappagedown":a=r.getMonth()+1;r.setMonth(a);if(a%12!==r.getMonth()){while(a!==r.getMonth()){r.setDate(r.getDate()-1)}}break;case"sappageup":a=r.getMonth()-1;r.setMonth(a);if(a<0){a=11}if(a!==r.getMonth()){while(a!==r.getMonth()){r.setDate(r.getDate()-1)}}break;default:break}this.fireFocus({date:r.toLocalJSDate(),otherMonth:true});if(this._isMarkingUnfinishedRangeAllowed()){var o=this.getSelectedDates()[0],n=parseInt(this._oFormatYyyymmdd.format(o.getStartDate())),l=parseInt(this._oFormatYyyymmdd.format(r.toLocalJSDate()));this._markDatesBetweenStartAndHoveredDate(n,l)}}};m.prototype.checkDateFocusable=function(e){r._checkJSDateObject(e);var t=this._getDate();var a=s.fromLocalJSDate(e,this.getPrimaryCalendarType());return r._isSameMonthAndYear(a,t)};m.prototype.applyFocusInfo=function(e){return this};m.prototype._getFirstWeekDay=function(){return this._getFirstDayOfWeek()};m.prototype._isMonthNameLong=function(e){var t;var a;for(t=0;t<e.length;t++){a=e[t];if(Math.abs(a.clientWidth-a.scrollWidth)>1){return true}}return false};m.prototype._getVisibleDays=function(e,t){var a,i,r,o,n,l,h;if(!e){return this._aVisibleDays}this._aVisibleDays=[];l=this._getFirstDayOfWeek();n=new s(e,this.getPrimaryCalendarType());n.setDate(1);o=n.getDay()-l;if(o<0){o=7+o}if(o>0){n.setDate(1-o)}i=new s(n);a=(e.getMonth()+1)%12;do{h=i.getYear();r=new s(i,this.getPrimaryCalendarType());if(t&&h<1){r._bBeforeFirstYear=true;this._aVisibleDays.push(r)}else if(h>0&&h<1e4){this._aVisibleDays.push(r)}i.setDate(i.getDate()+1)}while(i.getMonth()!==a||i.getDay()!==l);return this._aVisibleDays};m.prototype._handleMousedown=function(e,a){var i=e.target.classList.contains("sapUiCalWeekNum"),r=!e.button,o=this._getSelectedDateFromEvent(e);if(!r||t.support.touch){return this}if(i){this._isWeekSelectionAllowed()&&this._handleWeekSelection(o,true);return this}else if(e.shiftKey&&this._isConsecutiveDaysSelectionAllowed()){this._handleConsecutiveDaysSelection(o);return this}var n=this._selectDay(a);if(n){this._bMousedownChange=true}if(this._bMouseMove){this._unbindMousemove(true);this._bMoveChange=false;this._oMoveSelectedDate=undefined}else if(n&&this.getIntervalSelection()&&this.$().is(":visible")){this._bindMousemove(true);this._oMoveSelectedDate=new s(a,this.getPrimaryCalendarType())}e.preventDefault();e.setMark("cancelAutoClose")};m.prototype._getSelectedDateFromEvent=function(e){var t=e.target,a,i;if(t.classList.contains("sapUiCalWeekNum")){a=t.nextSibling.getAttribute("data-sap-day")}else{a=t.getAttribute("data-sap-day")||t.parentNode.getAttribute("data-sap-day")}i=this._oFormatYyyymmdd.parse(a);return i?s.fromLocalJSDate(i,this.getPrimaryCalendarType()):null};m.prototype._handleWeekSelection=function(e,t){var a=this._calculateWeekNumber(e),i=this._getLastWeekDate(e),r=this.getSingleSelection(),s=this.getIntervalSelection();if(!r&&!s){this._handleWeekSelectionByMultipleDays(a,e,i)}else if(r&&s){this._handleWeekSelectionBySingleInterval(a,e,i)}t&&this._focusDate(e);return this};m.prototype._handleConsecutiveDaysSelection=function(e){var t=this.getSelectedDates(),a=t.length&&t[t.length-1].getStartDate(),i=a?s.fromLocalJSDate(a):e,r;r=this._areAllDaysBetweenSelected(i,e);this._toggleDaysBetween(i,e,!r);return this};m.prototype._calculateWeekNumber=function(e){var t=this._getLastWeekDate(e);var a=new d(this._getLocale());var i=h.getInstance({pattern:"w",calendarType:this.getPrimaryCalendarType()},a);var r;var s=a.getLanguage()==="en"&&(a.getRegion()==="US"||!a.getRegion());if(e.getMonth()===11&&t.getMonth()===0&&s){r=1}else{r=i.format(e.toLocalJSDate())}return r};m.prototype._isWeekSelectionAllowed=function(){var e=this.getSingleSelection(),t=this.getIntervalSelection(),a=this.getPrimaryCalendarType(),i=this.getFirstDayOfWeek()!==-1,r=!e&&!t,s=e&&t,o=s||r;return a===f.Gregorian&&!i&&o};m.prototype._isConsecutiveDaysSelectionAllowed=function(){var e=this.getSingleSelection(),t=this.getIntervalSelection();return!e&&!t};m.prototype._isMarkingUnfinishedRangeAllowed=function(){var e=this.getSelectedDates()[0],t=!!(e&&e.getStartDate()&&!e.getEndDate());return this.getIntervalSelection()&&t};m.prototype._handleWeekSelectionByMultipleDays=function(e,t,a){var i,r,s;i=this._areAllDaysBetweenSelected(t,a)?new o({startDate:t.toLocalJSDate()}):new o({startDate:t.toLocalJSDate(),endDate:a.toLocalJSDate()});r=this.fireWeekNumberSelect({weekNumber:e,weekDays:i});s=i.getEndDate()?true:false;if(r){this._toggleDaysBetween(t,a,s)}return this};m.prototype._handleWeekSelectionBySingleInterval=function(e,t,a){var i=new o({startDate:t.toLocalJSDate(),endDate:a.toLocalJSDate()}),r=this.getParent(),s=this,n;if(r&&r.getSelectedDates){s=r}if(this._isIntervalSelected(i)){i=null}n=this.fireWeekNumberSelect({weekNumber:e,weekDays:i});if(n){s.removeAllSelectedDates();s.addSelectedDate(i)}return this};m.prototype._isIntervalSelected=function(e){var t=this.getSelectedDates(),a=t.length&&t[0],i=a&&a.getEndDate();return a&&a.getStartDate()&&a.getStartDate().getTime()===e.getStartDate().getTime()&&i&&a.getEndDate()&&a.getEndDate().getTime()===e.getEndDate().getTime()};m.prototype._getLastWeekDate=function(e){return new s(e).setDate(e.getDate()+6)};m.prototype._toggleDaysBetween=function(e,t,a){var i=this._arrangeStartAndEndDates(e,t),r=new s(i.startDate),o;do{o=this._checkDateSelected(r);if(!o&&a||o&&!a){this._selectDay(r);b.call(this)}r.setDate(r.getDate()+1)}while(r.isSameOrBefore(i.endDate));return this};m.prototype._areAllDaysBetweenSelected=function(e,t){var a=this._arrangeStartAndEndDates(e,t),i=new s(a.startDate),r=true;do{if(!this._checkDateSelected(i)){r=false;break}i.setDate(i.getDate()+1)}while(i.isSameOrBefore(a.endDate));return r};m.prototype._arrangeStartAndEndDates=function(e,t){var a=e.isSameOrBefore(t);return{startDate:a?e:t,endDate:a?t:e}};m.prototype._selectDay=function(e,t){if(!this._checkDateEnabled(e)){return false}var a=this.getSelectedDates();var i;var r=this._oItemNavigation.getItemDomRefs();var n;var l;var h=0;var g=this.getParent();var d=this;var u;var c=this.getPrimaryCalendarType();if(g&&g.getSelectedDates){d=g}if(this.getSingleSelection()){if(a.length>0){i=a[0];u=i.getStartDate();if(u){u=s.fromLocalJSDate(u,c)}}else{i=new o;d.addAggregation("selectedDates",i,true)}if(this.getIntervalSelection()&&(!i.getEndDate()||t)&&u){var p;if(e.isBefore(u)){p=u;u=e;if(!t){i.setProperty("startDate",u.toLocalJSDate());i.setProperty("endDate",p.toLocalJSDate())}}else if(e.isSameOrAfter(u)){p=e;if(!t){i.setProperty("endDate",p.toLocalJSDate())}}}else{i.setProperty("startDate",e.toLocalJSDate());i.setProperty("endDate",undefined)}}else{if(this.getIntervalSelection()){throw new Error("Calender don't support multiple interval selection")}else{var f=this._checkDateSelected(e);if(f>0){for(h=0;h<a.length;h++){u=a[h].getStartDate();if(u&&e.isSame(s.fromLocalJSDate(u,c))){d.removeAggregation("selectedDates",h,true);break}}}else{i=new o({startDate:e.toLocalJSDate()});d.addAggregation("selectedDates",i,true)}l=this._oFormatYyyymmdd.format(e.toUTCJSDate(),true);for(h=0;h<r.length;h++){n=y(r[h]);if(n.attr("data-sap-day")===l){if(f>0){n.removeClass("sapUiCalItemSel");n.attr("aria-selected","false")}else{n.addClass("sapUiCalItemSel");n.attr("aria-selected","true")}}}}}return true};m.prototype._getSpecialDates=function(){var e=this.getParent();if(e&&e._getSpecialDates){return e._getSpecialDates()}else{var t=this.getSpecialDates();for(var a=0;a<t.length;a++){var i=t[a].getSecondaryType()===l.CalendarDayType.NonWorking&&t[a].getType()!==l.CalendarDayType.NonWorking;if(i){var r=new n;r.setType(l.CalendarDayType.NonWorking);r.setStartDate(t[a].getStartDate());if(t[a].getEndDate()){r.setEndDate(t[a].getEndDate())}t.push(r)}}return t}};function v(){var e=this._oFormatYyyymmdd.format(this._getDate().toUTCJSDate(),true),t=0,a=this.getDomRef(),r=a.querySelectorAll(".sapUiCalItem");for(var s=0;s<r.length;s++){if(r[s].getAttribute("data-sap-day")===e){t=s;break}}if(!this._oItemNavigation){this._oItemNavigation=new i;this._oItemNavigation.attachEvent(i.Events.AfterFocus,_,this);this._oItemNavigation.attachEvent(i.Events.FocusAgain,S,this);this._oItemNavigation.attachEvent(i.Events.BorderReached,this._handleBorderReached,this);this.addDelegate(this._oItemNavigation);if(this._iColumns>1){this._oItemNavigation.setHomeEndColumnMode(true,true)}this._oItemNavigation.setDisabledModifiers({sapnext:["alt"],sapprevious:["alt"],saphome:["alt"],sapend:["alt"]});this._oItemNavigation.setCycling(false);this._oItemNavigation.setColumns(this._iColumns,true)}this._oItemNavigation.setRootDomRef(a);this._oItemNavigation.setItemDomRefs(r);this._oItemNavigation.setFocusedIndex(t);this._oItemNavigation.setPageSize(r.length)}function _(e){var t=e.getParameter("index");var a=e.getParameter("event");if(!a){return}var i=this._getDate();var r=new s(i,this.getPrimaryCalendarType());var o=false;var n=true;var l=this._oItemNavigation.getItemDomRefs();var h=0;var g=y(l[t]);var d;if(g.hasClass("sapUiCalItemOtherMonth")){if(a.type==="saphomemodifiers"&&(a.metaKey||a.ctrlKey)){r.setDate(1);this._focusDate(r)}else if(a.type==="sapendmodifiers"&&(a.metaKey||a.ctrlKey)){for(h=l.length-1;h>0;h--){d=y(l[h]);if(!d.hasClass("sapUiCalItemOtherMonth")){r=s.fromLocalJSDate(this._oFormatYyyymmdd.parse(d.attr("data-sap-day")),this.getPrimaryCalendarType());break}}this._focusDate(r)}else{o=true;r=s.fromLocalJSDate(this._oFormatYyyymmdd.parse(g.attr("data-sap-day")),this.getPrimaryCalendarType());if(!r){r=new s(i)}this._focusDate(i);if(a.type==="mousedown"||this._sTouchstartYyyyMMdd&&a.type==="focusin"&&this._sTouchstartYyyyMMdd===g.attr("data-sap-day")){n=false;this.fireFocus({date:i.toLocalJSDate(),otherMonth:false,restoreOldDate:true})}if(a.originalEvent&&a.originalEvent.type==="touchstart"){this._sTouchstartYyyyMMdd=g.attr("data-sap-day")}else{this._sTouchstartYyyyMMdd=undefined}}}else{if(y(a.target).hasClass("sapUiCalWeekNum")){this._focusDate(r)}else{r=s.fromLocalJSDate(this._oFormatYyyymmdd.parse(g.attr("data-sap-day")),this.getPrimaryCalendarType());this._oDate=r}this._sTouchstartYyyyMMdd=undefined}if(a.type==="mousedown"&&this.getIntervalSelection()){this._sLastTargetId=g.attr("id")}if(n){this.fireFocus({date:r.toLocalJSDate(),otherMonth:o})}if(a.type==="mousedown"){this._handleMousedown(a,r,t)}if(a.type==="sapnext"||a.type==="sapprevious"){var u=this.getSelectedDates()[0],c,p;if(!this._isMarkingUnfinishedRangeAllowed()){return}c=parseInt(this._oFormatYyyymmdd.format(u.getStartDate()));p=g.data("sapDay");this._markDatesBetweenStartAndHoveredDate(c,p)}}function S(e){var t=e.getParameter("index");var a=e.getParameter("event");if(!a){return}if(a.type==="mousedown"){var i=this._getDate();if(this.getIntervalSelection()){var r=this._oItemNavigation.getItemDomRefs();this._sLastTargetId=r[t].id}this._handleMousedown(a,i,t)}}function C(e,t){r._checkCalendarDate(e);var a=e.getYear();r._checkYearInValidRange(a);var i=true;if(!this.getDate()||!e.isSame(s.fromLocalJSDate(this.getDate(),e.getCalendarType()))){var o=new s(e);i=this.checkDateFocusable(e.toLocalJSDate());this.setProperty("date",e.toLocalJSDate());this._oDate=o}if(this.getDomRef()){if(i){this._focusDate(this._oDate,true,t)}else{this.setDate(e.toLocalJSDate())}}}m.prototype._focusDate=function(e,t,a){if(!t){this.setDate(e.toLocalJSDate())}var i=this._oFormatYyyymmdd.format(e.toUTCJSDate(),true);var r=this._oItemNavigation.getItemDomRefs();var s;for(var o=0;o<r.length;o++){s=y(r[o]);if(s.attr("data-sap-day")===i){if(document.activeElement!==r[o]){if(a){this._oItemNavigation.setFocusedIndex(o)}else{this._oItemNavigation.focusItem(o)}}break}}};function b(){if(this._bMouseMove){this._unbindMousemove(true)}this.fireSelect()}function M(){if(!this._bNamesLengthChecked){var e,t=this.getDomRef().querySelectorAll(".sapUiCalWH:not(.sapUiCalDummy)"),a=this._isMonthNameLong(t),i,r,s,o;if(a){this._bLongWeekDays=false;i=this._getLocaleData();r=this._getFirstWeekDay();s=i.getDaysStandAlone("narrow",this.getPrimaryCalendarType());for(o=0;o<t.length;o++){e=t[o];e.textContent=s[(o+r)%7]}}else{this._bLongWeekDays=true}this._bNamesLengthChecked=true}}return m});