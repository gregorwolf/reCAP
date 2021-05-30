/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/initial/_internal/StorageUtils","sap/ui/fl/Utils","sap/ui/fl/initial/_internal/StorageResultMerger","sap/ui/fl/initial/_internal/storageResultDisassemble"],function(e,n,r,t){"use strict";function i(e,r,t){if(!r.layers||r.layers[0]!=="ALL"&&r.layers.indexOf("CUSTOMER")===-1){delete e.version;return e}if(t.version!==undefined){e.version=t.version;return e}var i=n.getUrlParameter(sap.ui.fl.Versions.UrlParameter);if(i===null){delete e.version}else{e.version=parseInt(i)}return e}function a(n,r){var t=r.map(function(r){var t=Object.assign({},n,{url:r.url,path:r.path});t=i(t,r,n);return r.loadConnectorModule.loadFlexData(t).then(function(n){return n||e.getEmptyFlexDataResponse()}).catch(e.logAndResolveDefault.bind(undefined,e.getEmptyFlexDataResponse(),r,"loadFlexData"))});return Promise.all(t)}function l(e){var n=[];e.forEach(function(e){if(Array.isArray(e)){n=n.concat(e)}else{n.push(e)}});return n}function o(e){return e.map(function(e){return t(e)})}function s(e){return Promise.resolve(e).then(l).then(o).then(l).then(r.merge)}function u(n){return e.getStaticFileConnector().then(a.bind(this,n))}var f={};f.completeFlexData=function(e){if(!e||!e.reference){return Promise.reject("No reference was provided")}return Promise.all([u(e),e.partialFlexData]).then(s)};f.loadFlexData=function(n){if(!n||!n.reference){return Promise.reject("No reference was provided")}return e.getLoadConnectors().then(a.bind(this,n)).then(s)};return f});