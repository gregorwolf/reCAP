/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/includes","sap/base/util/restricted/_omit","sap/base/Log","sap/ui/core/util/reflection/JsControlTreeModifier","sap/ui/fl/apply/_internal/changes/FlexCustomData","sap/ui/fl/apply/_internal/ChangesController","sap/ui/fl/apply/_internal/appVariant/DescriptorChangeTypes","sap/ui/fl/write/_internal/condenser/Condenser","sap/ui/fl/write/_internal/flexState/FlexObjectState","sap/ui/fl/apply/_internal/flexState/ManifestUtils","sap/ui/fl/write/api/FeaturesAPI","sap/ui/fl/Layer","sap/ui/fl/LayerUtils"],function(e,t,n,r,a,o,s,l,i,c,u,g,p){"use strict";var h={};function f(t){return t._getMap&&e(s.getChangeTypes(),t._getMap().changeType)||t.getChangeType&&e(s.getChangeTypes(),t.getChangeType())}function d(e){e.includeCtrlVariants=true;e.invalidateCache=false;return h._getUIChanges(e).then(function(e){return e.length>0})}h.hasHigherLayerChanges=function(e){e.upToLayer=e.upToLayer||p.getCurrentLayer();return i.getFlexObjects(e).then(function(t){return t.filter(function(t){return p.isOverLayer(t.getLayer(),e.upToLayer)})}).then(function(e){return e.length>0})};h.save=function(e){return i.saveFlexObjects(e)};h.getResetAndPublishInfo=function(e){return Promise.all([d(e),u.isPublishAvailable()]).then(function(t){var r=t[0];var a=t[1];var s=e.layer!==g.USER&&e.layer!==g.PUBLIC;var l={isResetEnabled:r,isPublishEnabled:r&&s&&a,allContextsProvided:true};if(s){return o.getFlexControllerInstance(e.selector).getResetAndPublishInfo(e).then(function(e){l.allContextsProvided=e.allContextsProvided===undefined||e.allContextsProvided;l.isResetEnabled=e.isResetEnabled;l.isPublishEnabled=l.isPublishEnabled&&e.isPublishEnabled;return l}).catch(function(e){n.error("Sending request to flex/info route failed: "+e.message);return l})}return l})};h.getResetAndPublishInfoFromSession=function(e){var t=c.getFlexReferenceForControl(e)||"true";return JSON.parse(window.sessionStorage.getItem("sap.ui.fl.info."+t))};h.reset=function(e){var t=o.getAppComponentForSelector(e.selector);var n=o.getFlexControllerInstance(t);var r=[e.layer,e.generator,t,e.selectorIds,e.changeTypes];return n.resetChanges.apply(n,r)};h.publish=function(e){e.styleClass=e.styleClass||"";var t=o.getAppComponentForSelector(e.selector);return o.getFlexControllerInstance(t)._oChangePersistence.transportAllUIChanges({},e.styleClass,e.layer,e.appVariantDescriptors)};h.add=function(e){if(f(e.change)){return e.change.store()}var t=o.getAppComponentForSelector(e.selector);return o.getFlexControllerInstance(t).addPreparedChange(e.change,t)};h.remove=function(e){if(!e.selector){throw new Error("An invalid selector was passed so change could not be removed with id: "+e.change.getId())}var t=o.getAppComponentForSelector(e.selector);if(!t){throw new Error("Invalid application component for selector, change could not be removed with id: "+e.change.getId())}if(f(e.change)){var n=o.getDescriptorFlexControllerInstance(t);n.deleteChange(e.change,t);return}var s=r.bySelector(e.change.getSelector(),t);var l=o.getFlexControllerInstance(t);if(s){a.destroyAppliedCustomData(s,e.change,r)}l.deleteChange(e.change,t)};h._condense=function(e){return Promise.resolve().then(function(){if(!e.selector){throw Error("An invalid selector was passed")}var t=o.getAppComponentForSelector(e.selector);if(!t){throw Error("Invalid application component for selector")}if(!e.changes||e.changes&&!Array.isArray(e.changes)){throw Error("Invalid array of changes")}return l.condense(t,e.changes)})};h._getUIChanges=function(e){if(e.layer){e.currentLayer=e.layer}return i.getFlexObjects(e)};return h});