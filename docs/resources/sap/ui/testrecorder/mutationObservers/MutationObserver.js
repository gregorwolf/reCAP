/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/base/ManagedObject","sap/ui/testrecorder/Constants","sap/base/util/restricted/_debounce"],function(t,e,n,i){"use strict";var r=e.extend("sap.ui.testrecorder.mutationObservers.MutationObserver",{metadata:{library:"sap.ui.testrecorder"},constructor:function(t){this._fnObservationCb=t;this._observer=new window.MutationObserver(this._onObservation.bind(this))},start:function(t){this._oTarget=t||document.body;this._observer.observe(this._oTarget,this._getOptions())},stop:function(){this._observer.disconnect()},_getOptions:function(){return{}},_onObservation:function(t){return i(function(){this._isValidMutation(t).then(function(t){if(t){this._fnObservationCb()}}.bind(this)).catch(function(t){throw new Error("Erro in mutation observer: "+t)})}.bind(this),100)()},_isValidMutation:function(t){return Promise.all(t.map(function(t){return new Promise(function(e,n){if(this._isRecorderElement(t)){e(false)}else{this._hasHiddenElements(t).then(function(t){e(!t)}).catch(n)}}.bind(this))}.bind(this))).then(function(t){return t.every(Boolean)})},_isRecorderElement:function(t){return[n.HIGHLIGHTER_ID,n.CONTEXTMENU_ID].filter(function(e){return t.target.id===e||t.addedNodes.length&&t.addedNodes[0].id===e||t.removedNodes.length&&t.removedNodes[0].id===e}).length},_hasHiddenElements:function(t){return new Promise(function(e){if(!t.addedNodes.length){e(false)}Promise.all(Array.prototype.map.call(t.addedNodes,function(t){return new Promise(function(e){this._waitForElement(t)().then(function(){e(this._isHidden(t))}.bind(this)).catch(function(){e(true)})}.bind(this))}.bind(this))).then(function(t){e(t.some(Boolean))})}.bind(this))},_waitForElement:function(t){return function(e){e=e||5;return new Promise(function(n,i){if(t instanceof HTMLElement){n()}else if(!e){i()}else{setTimeout(this._waitForElement(e-1),100)}})}},_isHidden:function(e){var n=t(e);return n.is(":hidden")||n.css("visibility")==="hidden"}});return r});