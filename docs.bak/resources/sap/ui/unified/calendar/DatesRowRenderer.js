/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Renderer","sap/ui/unified/calendar/CalendarDate","./MonthRenderer","sap/ui/core/CalendarType"],function(e,a,t,r){"use strict";var n=e.extend(t);n.apiVersion=2;n.getStartDate=function(e){return e._getStartDate()};n.getClass=function(e,a){var t=["sapUiCalDatesRow","sapUiCalRow"];if(!a.getShowDayNamesLine()){t.push("sapUiCalNoNameLine")}return t};n.addWrapperAdditionalStyles=function(e,a){if(a._iTopPosition){e.style("top",a._iTopPosition+"px")}};n.renderMonth=function(e,a,r){t.renderMonth.apply(this,arguments);this.renderWeekNumbers(e,a)};n.renderWeekNumbers=function(e,a){var t,n,i,s;if(a.getShowWeekNumbers()&&a.getPrimaryCalendarType()===r.Gregorian){t=sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified");e.openStart("div",a.getId()+"-weeks");e.class("sapUiCalRowWeekNumbers");e.openEnd();n=a.getDays();i=100/n;s=a.getWeekNumbers();s.forEach(function(a){e.openStart("div");e.class("sapUiCalRowWeekNumber");e.style("width",a.len*i+"%");e.attr("data-sap-ui-week",a.number);e.openEnd();e.text(t.getText("CALENDAR_DATES_ROW_WEEK_NUMBER",[a.number]));e.close("div")});e.close("div")}};n.renderDummyCell=function(){};n.renderHeader=function(e,a,t){var r=a._getLocaleData();var n=a.getId();var i=a.getDays();var s="";if(a._getShowHeader()){e.openStart("div",n+"-Head");e.openEnd();this.renderHeaderLine(e,a,r,t);e.close("div")}s=100/i+"%";if(a.getShowDayNamesLine()){e.openStart("div",n+"-Names");e.style("display","inline");e.openEnd();this.renderDayNames(e,a,r,t.getDay(),i,false,s);e.close("div")}};n.renderHeaderLine=function(e,t,r,n){var i=t.getId();var s=t.getDays();var o=new a(n,t.getPrimaryCalendarType());var d="";var l=0;var g=[];var p=0;for(p=0;p<s;p++){l=o.getMonth();if(g.length>0&&g[g.length-1].iMonth==l){g[g.length-1].iDays++}else{g.push({iMonth:l,iDays:1})}o.setDate(o.getDate()+1)}var u=r.getMonthsStandAlone("wide");for(p=0;p<g.length;p++){var y=g[p];d=100/s*y.iDays+"%";e.openStart("div",i+"-Head"+p);e.class("sapUiCalHeadText");e.style("width",d);e.openEnd();e.text(u[y.iMonth]);e.close("div")}};n.renderDays=function(e,t,r){var n=t.getDays();var i=100/n+"%";var s=t.getShowDayNamesLine();if(!r){r=t._getFocusedDate()}var o=this.getDayHelper(t,r);if(!s){if(t._bLongWeekDays||!t._bNamesLengthChecked){o.aWeekDays=o.oLocaleData.getDaysStandAlone("abbreviated")}else{o.aWeekDays=o.oLocaleData.getDaysStandAlone("narrow")}o.aWeekDaysWide=o.oLocaleData.getDaysStandAlone("wide")}var d=new a(r,t.getPrimaryCalendarType());for(var l=0;l<n;l++){this.renderDay(e,t,d,o,false,false,l,i,!s);d.setDate(d.getDate()+1)}};return n},true);