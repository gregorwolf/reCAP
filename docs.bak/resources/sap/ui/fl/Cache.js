/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/apply/_internal/flexState/FlexState","sap/ui/fl/Utils","sap/base/Log"],function(e,n,t){"use strict";var r=function(){};function a(n){return e.getFlexObjectsFromStorageResponse(n).changes}function i(e,n){if(!n){return e}return e===r.NOTAG?e.replace(/>$/,"".concat("-",n,">")):e.concat("-",n)}function c(e){return e.replace(/(^W\/|")/g,"")}r.NOTAG="<NoTag>";r.clearEntries=function(){e.clearState()};r.getChangesFillingCache=function(n,t,r){var a=Promise.resolve();if(r){a=e.clearAndInitialize(t)}return a.then(function(){return e.getStorageResponse(n.name)}).catch(function(){return{}})};r.getCacheKey=function(e,a){if(!e||!e.name||!a){t.warning("Not all parameters were passed to determine a flexibility cache key.");return Promise.resolve(r.NOTAG)}return this.getChangesFillingCache(e).then(function(e){if(e&&e.cacheKey){return c(e.cacheKey)}return r.NOTAG}).then(function(e){var t=a.getModel(n.VARIANT_MODEL_NAME);var r=t?t.getCurrentControlVariantIds():[];return i(e,r.join("-"))})};r.addChange=function(e,n){var t=a(e.name);if(!t){return}t.push(n)};r.updateChange=function(e,n){var t=a(e.name);if(!t){return}for(var r=0;r<t.length;r++){if(t[r].fileName===n.fileName){t.splice(r,1,n);break}}};r.deleteChange=function(e,n){var t=a(e.name);if(!t){return}for(var r=0;r<t.length;r++){if(t[r].fileName===n.fileName){t.splice(r,1);break}}};r.removeChanges=function(n,t){var r=e.getFlexObjectsFromStorageResponse(n.name);r.changes=r.changes.filter(function(e){return t.indexOf(e.fileName)===-1});var a=e.getVariantsState(n.name);Object.keys(a).forEach(function(e){a[e].variants.forEach(function(e){e.controlChanges=e.controlChanges.filter(function(e){return t.indexOf(e.getFileName())===-1})})})};return r},true);