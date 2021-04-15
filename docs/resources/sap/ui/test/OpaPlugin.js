/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
(function(t){"use strict";var e;if(t.module){e=t.module;t.module=undefined}sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/base/Object","sap/ui/core/Element","sap/ui/core/mvc/View","sap/ui/test/matchers/Ancestor","sap/ui/test/matchers/MatcherFactory","sap/ui/test/pipelines/MatcherPipeline","sap/ui/test/_OpaLogger"],function(t,e,r,i,n,o,l,s){var a=e.extend("sap.ui.test.OpaPlugin",{constructor:function(){this._oLogger=s.getLogger("sap.ui.test.Opa5");this._oMatcherFactory=new o},getAllControls:function(t,e){var i=r.registry.filter(u(t));this._oLogger.debug("Found "+i.length+" controls"+(t?" of type '"+(e||t)+"'":"")+" in page");return i},getView:function(t){var e=this.getAllControls(i,"View");var r=e.filter(function(e){return e.getViewName()===t});this._oLogger.debug("Found "+r.length+" views with viewName '"+t+"'");if(r.length>1){r=r.filter(function(t){var e=t.$();return e.length>0&&e.is(":visible")&&e.css("visibility")!=="hidden"});this._oLogger.debug("Found "+r.length+" visible views with viewName '"+t+"'");if(r.length!==1){this._oLogger.debug("Cannot identify controls uniquely. Please provide viewId to locate the exact view.");r=[]}}return r[0]},_getMatchingView:function(t){var e=null;var n;if(t.viewName){var o=(t.viewNamespace||"")+"."+(t.viewName||"");n=o.replace(/\.+/g,".").replace(/^\.|\.$/g,"")}if(t.viewId){var l=r.registry.get(t.viewId);if(l instanceof i&&(!n||l.getViewName()===n)){e=l}}else{e=this.getView(n)}this._oLogger.debug("Found "+(e?"":"no ")+"view with ID '"+t.viewId+"' and viewName '"+n+"'");return e},getControlInView:function(t){var e=this._getMatchingView(t);var r=typeof t.id==="string";if(!e){return r?null:[]}var i=e.getViewName();var n=t.fragmentId?t.fragmentId+a.VIEW_ID_DELIMITER:"";if(Array.isArray(t.id)){var o=[];var l=[];t.id.map(function(t){return n+t}).forEach(function(t){var r=e.byId(t);if(r){o.push(r)}else{l.push(t)}});var s=l.length?". Found no controls matching the subset of IDs "+l:"";this._oLogger.debug("Found "+o.length+" controls with ID contained in "+t.id+" in view '"+i+"'"+s);return o}if(r){var u=n+t.id;var g=e.byId(u)||null;this._oLogger.debug("Found "+(g?"":"no ")+"control with ID '"+u+"' in view '"+i+"'");return g}var c=this.getAllControlsWithTheParent(e,t.controlType,t.sOriginalControlType);var f=this._isRegExp(t.id);if(f){c=c.filter(function(r){var i=this._getUnprefixedControlId(r.getId(),e.getId(),t.fragmentId);return t.id.test(i)}.bind(this))}this._oLogger.debug("Found "+c.length+" controls of type "+t.sOriginalControlType+(f?" with ID matching "+t.id:"")+" in view '"+i+"'");return c},getAllControlsWithTheParent:function(t,e,r){var i=new n(t);return this._filterUniqueControlsByCondition(this.getAllControls(e,r),i)},getAllControlsInContainer:function(t,e,r,i){var n=u(e),o=this._filterUniqueControlsByCondition(this._getControlsInContainer(t),n);this._oLogger.debug("Found "+o.length+" controls in "+(i?i:"container")+" with controlType '"+r+"'");return o},_getControlsInStaticArea:function(e){var r=t(sap.ui.getCore().getStaticAreaRef());var i=this._getControlsInContainer(r)||[];if(e.id){i=this._filterUniqueControlsByCondition(i,function(t){var r=t.getId();var i=this._getMatchingView(e);if(i){if(this._isControlInView(t,i.getViewName())){r=this._getUnprefixedControlId(t.getId(),i.getId(),e.fragmentId)}}var n=false;if(typeof e.id==="string"){n=r===e.id}if(this._isRegExp(e.id)){n=e.id.test(r)}if(Array.isArray(e.id)){n=e.id.filter(function(t){return t===r}).length>0}return n}.bind(this));this._oLogger.debug("Found "+(i.length?i.length:"no")+" controls in the static area with ID matching '"+e.id+"'"+(e.fragmentId?" and fragmentId: '"+e.fragmentId+"'":""))}if(i.length&&e.controlType){var n=u(e.controlType);i=this._filterUniqueControlsByCondition(i,n);this._oLogger.debug("Found "+(i.length?i.length:"no")+" controls in the static area with control type matching '"+e.controlType+"'")}if(e.id&&typeof e.id==="string"){return i[0]||null}else{return i}},_getControlsInContainer:function(t){var e=t.find("*").control();var r=[];e.forEach(function(t){var e=!r.filter(function(e){return e.getId()===t.getId()}).length;if(e){r.push(t)}});return r},_isControlInView:function(t,e){if(!t){return false}if(t.getViewName&&t.getViewName()===e){return true}else{return this._isControlInView(t.getParent(),e)}},_isRegExp:function(t){return Object.prototype.toString.call(t)==="[object RegExp]"},getMatchingControls:function(t){var e=null;t=t||{};var r=this._modifyControlType(t);if(!r){return typeof t.id==="string"?e:[]}if(t.searchOpenDialogs){e=this._getControlsInStaticArea(t)}else if(t.viewName||t.viewId){e=this.getControlInView(t)}else if(t.id){e=this.getControlByGlobalId(t)}else if(t.controlType){e=this.getAllControls(t.controlType,t.sOriginalControlType)}else{e=this.getAllControls()}if(!e){return e}var i=this._oMatcherFactory.getStateMatchers({visible:t.visible,interactable:t.interactable,enabled:typeof t.enabled==="undefined"?t.interactable:t.enabled,editable:typeof t.editable==="undefined"?false:t.editable});var n=a._oMatcherPipeline.process({control:e,matchers:i});if(!n){if(Array.isArray(e)){return[]}if(e){return null}return e}return n},_getFilteredControls:function(e){var r=this._filterControlsByCondition(e);var i=t.extend({},e);["interactable","visible","enabled","editable"].forEach(function(t){delete i[t]});return r===a.FILTER_FOUND_NO_CONTROLS?a.FILTER_FOUND_NO_CONTROLS:this._filterControlsByMatchers(i,r)},_filterControlsByCondition:function(t){var e=null;var r=this._isLookingForAControl(t);if(r){e=this.getMatchingControls(t)}var i=[typeof t.id==="string"&&!e,this._isRegExp(t.id)&&!e.length,Array.isArray(t.id)&&(!e||e.length!==t.id.length),t.controlType&&Array.isArray(e)&&!e.length,!t.id&&(t.viewName||t.viewId||t.searchOpenDialogs)&&!e.length];return i.some(Boolean)?a.FILTER_FOUND_NO_CONTROLS:e},_filterControlsByMatchers:function(e,r){var i=t.extend({},e);var n=this._oMatcherFactory.getFilteringMatchers(i);var o=this._isLookingForAControl(e);var l=null;if((r||!o)&&n.length){l=a._oMatcherPipeline.process({matchers:n,control:r});if(!l){return a.FILTER_FOUND_NO_CONTROLS}}else{l=r}return l},getControlByGlobalId:function(t){var e=u(t.controlType);if(typeof t.id==="string"){var i=r.registry.get(t.id)||null;if(i&&!e(i)){this._oLogger.error("A control with global ID '"+t.id+"' is found but does not have required controlType '"+t.sOriginalControlType+"'. Found control is '"+i+"' but null is returned instead");return null}this._oLogger.debug("Found "+(i?"":"no ")+"control with the global ID '"+t.id+"'");return i}var n=[];var o=this._isRegExp(t.id);if(o){r.registry.forEach(function(e,r){if(t.id.test(r)){n.push(r)}})}else if(Array.isArray(t.id)){n=t.id}var l=[];var s=[];n.forEach(function(t){var i=r.registry.get(t);if(i&&e(i)&&!i.bIsDestroyed){l.push(i)}else{s.push(t)}});var a=!o&&s.length?". Found no controls of matching the subset of IDs "+s:"";this._oLogger.debug("Found "+l.length+" controls of type "+t.sOriginalControlType+(o?" with ID matching '":" with ID contained in '")+t.id+a);return l},getControlConstructor:function(e){if(sap.ui.lazyRequire._isStub(e)){this._oLogger.debug("The control type "+e+" is currently a lazy stub.");return null}var r=t.sap.getObject(e);if(!r){this._oLogger.debug("The control type "+e+" is undefined.");return null}if(typeof r!=="function"){this._oLogger.debug("The control type "+e+" must be a function.");return null}return r},_isLookingForAControl:function(t){return Object.keys(t).some(function(e){return a._aControlSelectorsForMatchingControls.indexOf(e)!==-1&&!!t[e]})},_filterUniqueControlsByCondition:function(t,e){return t.filter(function(t,r,i){var n=!!e(t);return n&&i.indexOf(t)===r})},_modifyControlType:function(t){var e=t.controlType;if(typeof e!=="string"){if(e&&e._sapUiLazyLoader){this._oLogger.debug("The control type is currently a lazy stub");return false}return true}var r=this.getControlConstructor(e);if(!r){return false}t.sOriginalControlType=e;t.controlType=r;return true},_getUnprefixedControlId:function(t,e,r){var i=t.replace(e+a.VIEW_ID_DELIMITER,"");if(r){if(i.startsWith(r+a.VIEW_ID_DELIMITER)){i=i.replace(r+a.VIEW_ID_DELIMITER,"")}else{i=""}}return i}});function u(t){return function(e){if(!t){return true}return e instanceof t}}a._oMatcherPipeline=new l;a._aControlSelectorsForMatchingControls=["id","viewName","viewId","controlType","searchOpenDialogs"];a.FILTER_FOUND_NO_CONTROLS="FILTER_FOUND_NO_CONTROL";a.VIEW_ID_DELIMITER="--";return a});if(e){t.module=e}})(window);