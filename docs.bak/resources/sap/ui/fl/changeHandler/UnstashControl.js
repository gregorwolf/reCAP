/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log"],function(e){"use strict";var t={};t.applyChange=function(e,t,n){var r=e.getContent();var a=n.modifier;var i=false;e.setRevertData({originalValue:n.modifier.getStashed(t)});var o=a.setStashed(t,i,n.appComponent)||t;if(r.parentAggregationName){var g=r.parentAggregationName;var s=a.getParent(o);a.removeAggregation(s,g,o);a.insertAggregation(s,g,o,r.index,n.view)}return o};t.revertChange=function(t,n,r){var a=t.getRevertData();if(a){r.modifier.setStashed(n,a.originalValue);t.resetRevertData()}else{e.error("Attempt to revert an unapplied change.");return false}return true};t.completeChangeContent=function(e,t){var n=e.getDefinition();if(t.content){n.content=t.content}};t.getCondenserInfo=function(e){return{affectedControl:e.getSelector(),classification:sap.ui.fl.condenser.Classification.Reverse,uniqueKey:"stashed"}};return t},true);