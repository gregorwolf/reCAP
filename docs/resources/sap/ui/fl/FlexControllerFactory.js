/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/FlexController","sap/ui/fl/Utils","sap/ui/fl/Layer","sap/ui/fl/apply/_internal/changes/Applier","sap/ui/fl/apply/_internal/flexState/FlexState","sap/ui/fl/variants/VariantModel","sap/base/Log","sap/ui/performance/Measurement"],function(e,n,t,r,o,a,i,s){"use strict";var p={};p._instanceCache={};p._componentInstantiationPromises=new WeakMap;p.create=function(n){var t=p._instanceCache[n];if(!t){t=new e(n);p._instanceCache[n]=t}return t};p.createForControl=function(e){try{var t=n.getAppComponentForControl(e);var r=n.getComponentClassName(t||e);return p.create(r)}catch(e){i.error(e.message,undefined,"sap.ui.fl.FlexControllerFactory")}};function l(e,r){if(n.getUshellContainer()){return Promise.resolve(e)}var o=window.sessionStorage.getItem("sap.ui.rta.restart."+t.CUSTOMER);if(o){var a=n.getComponentClassName(r);if(o!==a&&o!=="true"){i.error("an application component was started "+"which does not match the component for which the restart was triggered:\n"+"Triggering component: "+o+"\n"+"Started component: "+a);return Promise.resolve(e)}window.sessionStorage.removeItem("sap.ui.rta.restart."+t.CUSTOMER);return new Promise(function(n){sap.ui.getCore().loadLibrary("sap.ui.rta",{async:true}).then(function(){sap.ui.require(["sap/ui/rta/api/startKeyUserAdaptation"],function(t){t({rootControl:r});n(e)})})})}return Promise.resolve(e)}p.getChangesAndPropagate=function(e,t){if(n.isApplicationComponent(e)){var r=e.getId();var a=o.initialize({componentId:r,asyncHints:t.asyncHints}).then(u.bind(this,e));p._componentInstantiationPromises.set(e,a);return a}else if(n.isEmbeddedComponent(e)){var i=n.getAppComponentForControl(e);if(i&&n.isApplicationComponent(i)){var s=Promise.resolve();if(p._componentInstantiationPromises.has(i)){s=p._componentInstantiationPromises.get(i)}return s.then(function(){var e=i.getModel(n.VARIANT_MODEL_NAME);if(!e){return u(i)}return e}).then(function(t){e.setModel(t,n.VARIANT_MODEL_NAME)})}return Promise.resolve()}};function u(e){var t=e.getManifestObject();var o=p.createForControl(e,t);return o._oChangePersistence.loadChangesMapForComponent(e).then(function(t){var i=r.applyAllChangesForControl.bind(r,t,e,o);i._bIsSapUiFlFlexControllerApplyChangesOnControl=true;e.addPropagationListener(i);var p=new a({},o,e);e.setModel(p,n.VARIANT_MODEL_NAME);s.end("flexProcessing");return p}).then(function(n){return l(n,e)})}return p},true);