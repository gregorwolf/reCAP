/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/apply/_internal/changes/FlexCustomData","sap/ui/fl/registry/ChangeRegistry","sap/ui/fl/Utils"],function(e,t,n){"use strict";var r={getControlIfTemplateAffected:function(e,t,n){var r=n.modifier;var a=e.getDefinition();var o={originalControl:t};var l=a.dependentSelector&&a.dependentSelector.originalSelector;if(e.getContent().boundAggregation&&l){o.control=r.bySelector(l,n.appComponent,n.view);o.controlType=r.getControlType(o.control);o.bTemplateAffected=true}else{o.control=t;o.controlType=r.getControlType(t);o.bTemplateAffected=false}return o},getChangeHandler:function(e,n,r){var a=r.modifier.getLibraryName(n.control);return t.waitForChangeHandlerRegistration(a).then(function(){var a=e.getChangeType();var o=e.getLayer();var l=t.getInstance();return l.getChangeHandler(a,n.controlType,n.control,r.modifier,o)})},checkIfDependencyIsStillValid:function(t,r,a,o){var l=n.getChangeFromChangesMap(a.mChanges,o);var i=r.bySelector(l.getSelector(),t);if(e.hasChangeApplyFinishedCustomData(i,l,r)||l.hasApplyProcessStarted()){return false}return true}};return r});