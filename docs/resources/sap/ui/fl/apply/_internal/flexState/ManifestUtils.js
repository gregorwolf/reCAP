/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/Utils"],function(e){"use strict";function t(e){if(e&&e.indexOf(".Component")<0){e+=".Component"}return e}function n(e){var t;e.requests.some(function(e){if(e.name==="sap.ui.fl.changes"){t=e}});return t}var r={getFlexReferenceForControl:function(t){var n=e.getAppComponentForControl(t);return r.getFlexReference({manifest:n.getManifest(),componentData:n.getComponentData()})},getFlexReference:function(n){var r=n.manifest;var a=n.componentData||{};if(a.startupParameters){if(Array.isArray(a.startupParameters["sap-app-id"])){return a.startupParameters["sap-app-id"][0]}}var i=r.getEntry?r.getEntry("sap.ui5"):r["sap.ui5"];if(i){if(i.appVariantId){return i.appVariantId}if(i.componentName){return t(i.componentName)}}return t(e.getAppIdFromManifest(r))},getCacheKeyFromAsyncHints:function(e,t){if(t&&t.requests&&Array.isArray(t.requests)){var r=n(t);if(r&&r.reference===e){return r.cachebusterToken||"<NO CHANGES>"}}},getChangeManifestFromAsyncHints:function(e){if(e&&e.requests&&Array.isArray(e.requests)){var t=n(e);if(t){return false}}return true},getBaseComponentNameFromManifest:function(t){var n=t.getEntry?t.getEntry("sap.ui5"):t["sap.ui5"];return n&&n.componentName||e.getAppIdFromManifest(t)},isFlexExtensionPointHandlingEnabled:function(t){var n=e.getAppComponentForControl(t);return!!(n&&n.getManifestEntry("sap.ui5")&&n.getManifestEntry("sap.ui5").flexExtensionPointEnabled)}};return r});