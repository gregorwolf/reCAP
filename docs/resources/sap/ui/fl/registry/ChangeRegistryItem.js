/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/ui/fl/requireAsync","sap/ui/fl/Utils"],function(e,r,n){"use strict";var t=function(r){if(!r.changeHandler){e.error("sap.ui.fl.registry.ChangeRegistryItem: changeHandler required")}if(!r.changeType){e.error("sap.ui.fl.registry.ChangeRegistryItem: changeType required")}if(!r.layers){e.error("sap.ui.fl.registry.ChangeRegistryItem: layers required")}if(!r.controlType){e.error("sap.ui.fl.registry.ChangeRegistryItem: ControlType required")}this._controlType=r.controlType;this._changeType=r.changeType;this._changeHandler=r.changeHandler;this._layers=r.layers};t.prototype.getChangeTypeName=function(){return this._changeType};t.prototype.getControlType=function(){return this._controlType};t.prototype.getLayers=function(){return this._layers};t.prototype.getChangeHandler=function(){var e=new n.FakePromise;if(typeof this._changeHandler==="string"){e=r(this._changeHandler.replace(/\./g,"/")).then(function(e){this._changeHandler=e}.bind(this))}return e.then(function(){if(!this._changeHandler||typeof this._changeHandler.completeChangeContent!=="function"||typeof this._changeHandler.applyChange!=="function"||typeof this._changeHandler.revertChange!=="function"){return Promise.reject(new Error("The ChangeHandler is either not available or does not have all required functions"))}return this._changeHandler}.bind(this))};return t});