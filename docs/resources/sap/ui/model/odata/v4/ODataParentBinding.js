/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./Context","./ODataBinding","./SubmitMode","./lib/_Helper","sap/base/Log","sap/ui/base/SyncPromise","sap/ui/model/ChangeReason"],function(e,t,n,r,i,o,s){"use strict";function a(){t.call(this);this.mAggregatedQueryOptions={};this.bAggregatedQueryOptionsInitial=true;this.aChildCanUseCachePromises=[];this.bHasPathReductionToParent=false;this.iPatchCounter=0;this.bPatchSuccess=true;this.oReadGroupLock=undefined;this.oRefreshPromise=null;this.oResumePromise=undefined}t(a.prototype);var h="sap.ui.model.odata.v4.ODataParentBinding";a.prototype.attachPatchCompleted=function(e,t){this.attachEvent("patchCompleted",e,t)};a.prototype.detachPatchCompleted=function(e,t){this.detachEvent("patchCompleted",e,t)};a.prototype.firePatchCompleted=function(e){if(this.iPatchCounter===0){throw new Error("Completed more PATCH requests than sent")}this.iPatchCounter-=1;this.bPatchSuccess=this.bPatchSuccess&&e;if(this.iPatchCounter===0){this.fireEvent("patchCompleted",{success:this.bPatchSuccess});this.bPatchSuccess=true}};a.prototype.attachPatchSent=function(e,t){this.attachEvent("patchSent",e,t)};a.prototype.detachPatchSent=function(e,t){this.detachEvent("patchSent",e,t)};a.prototype.firePatchSent=function(){this.iPatchCounter+=1;if(this.iPatchCounter===1){this.fireEvent("patchSent")}};a.prototype._findEmptyPathParentContext=function(e){if(this.sPath===""&&this.oContext.getBinding){return this.oContext.getBinding()._findEmptyPathParentContext(this.oContext)}return e};a.prototype.aggregateQueryOptions=function(e,t,n){var i=r.merge({},n&&this.mLateQueryOptions||this.mAggregatedQueryOptions),o=false,s=this;function a(e,t,r,i,h){function u(i){var h=!e.$expand[i],u=r+"/"+i;if(h){e.$expand[i]={};if(n&&s.oModel.getMetaModel().fetchObject(u).getResult().$isCollection){return false}o=true}return a(e.$expand[i],t.$expand[i],u,true,h)}function c(t){if(e.$select.indexOf(t)<0){o=true;e.$select.push(t)}return true}return(!i||Object.keys(e).every(function(e){return e in t||e==="$count"||e==="$expand"||e==="$select"}))&&Object.keys(t).every(function(n){switch(n){case"$count":if(t.$count){e.$count=true}return true;case"$expand":e.$expand=e.$expand||{};return Object.keys(t.$expand).every(u);case"$select":e.$select=e.$select||[];return t.$select.every(c);default:if(h){e[n]=t[n];return true}return t[n]===e[n]}})}if(a(i,e,t)){if(!n){this.mAggregatedQueryOptions=i}else if(o){this.mLateQueryOptions=i}return true}return false};a.prototype.changeParameters=function(e){var t=Object.assign({},this.mParameters),n,i,o=this;function a(t){if(o.oModel.bAutoExpandSelect&&t in e){throw new Error("Cannot change $expand or $select parameter in "+"auto-$expand/$select mode: "+t+"="+JSON.stringify(e[t]))}}function h(e){if(e==="$filter"||e==="$search"){n=s.Filter}else if(e==="$orderby"&&n!==s.Filter){n=s.Sort}else if(!n){n=s.Change}}if(!e){throw new Error("Missing map of binding parameters")}a("$expand");a("$select");if(this.hasPendingChanges()){throw new Error("Cannot change parameters due to pending changes")}for(i in e){if(i.startsWith("$$")){if(e[i]===t[i]){continue}throw new Error("Unsupported parameter: "+i)}if(e[i]===undefined&&t[i]!==undefined){h(i);delete t[i]}else if(t[i]!==e[i]){h(i);if(typeof e[i]==="object"){t[i]=r.clone(e[i])}else{t[i]=e[i]}}}if(n){this.applyParameters(t,n)}};a.prototype.checkUpdateInternal=function(e){var t=this;function n(){return o.all(t.getDependentBindings().map(function(e){return e.checkUpdateInternal()}))}if(e!==undefined){throw new Error("Unsupported operation: "+h+"#checkUpdateInternal must not"+" be called with parameters")}return this.oCachePromise.then(function(e){if(e&&t.bRelative){return t.fetchResourcePath(t.oContext).then(function(r){if(e.$resourcePath===r){return n()}return t.refreshInternal("")})}return n()})};a.prototype.createInCache=function(e,t,n,i,o,s,a){var h=this;return this.oCachePromise.then(function(u){var c;if(u){c=r.getRelativePath(n,h.getResolvedPath());return u.create(e,t,c,i,o,s,a).then(function(e){if(u.$resourcePath){delete h.mCacheByResourcePath[u.$resourcePath]}return e})}return h.oContext.getBinding().createInCache(e,t,n,i,o,s,a)})};a.prototype.createReadGroupLock=function(e,t,n){var r,o=this;function s(){o.oModel.addPrerenderingTask(function(){n-=1;if(n>0){Promise.resolve().then(s)}else if(o.oReadGroupLock===r){i.debug("Timeout: unlocked "+r,null,h);o.removeReadGroupLock()}})}this.removeReadGroupLock();this.oReadGroupLock=r=this.lockGroup(e,t);if(t){n=2+(n||0);s()}};a.prototype.createRefreshPromise=function(){var e,t;e=new Promise(function(e){t=e});e.$resolve=t;this.oRefreshPromise=e;return e};a.prototype.deleteFromCache=function(e,t,n,i,o){var s;if(this.oCache===undefined){throw new Error("DELETE request not allowed")}if(this.oCache){s=e.getGroupId();if(!this.oModel.isAutoGroup(s)&&!this.oModel.isDirectGroup(s)){throw new Error("Illegal update group ID: "+s)}return this.oCache._delete(e,t,n,i,o)}return this.oContext.getBinding().deleteFromCache(e,t,r.buildPath(this.oContext.iIndex,this.sPath,n),i,o)};a.prototype.destroy=function(){this.aChildCanUseCachePromises=[];this.removeReadGroupLock();this.oResumePromise=undefined;t.prototype.destroy.call(this)};a.prototype.fetchIfChildCanUseCache=function(t,n,s){var a=this.getBaseForPathReduction(),u,c,d,p,f=t.getIndex(),g=n[0]==="#",l=this.oModel.getMetaModel(),P,m=this.oModel.resolve(n,t),y=t.getPath().includes("(...)"),C=this;function v(){if(g){return l.fetchObject(p.slice(0,p.lastIndexOf("/")+1))}return r.fetchPropertyAndType(C.oModel.oInterface.fetchMetadata,p)}if(y&&!m.includes("/$Parameter/")||this.getRootBinding().isSuspended()||this.mParameters&&this.mParameters.$$aggregation){return o.resolve(m)}c=this.oCachePromise.isRejected()||f!==undefined&&f!==e.VIRTUAL||t.isKeepAlive()||this.oCache===null||this.oCache&&this.oCache.hasSentRequest();u=l.getMetaPath(t.getPath());p=l.getMetaPath(m);P=[this.doFetchQueryOptions(this.oContext),v(),s];d=o.all(P).then(function(e){var t,o=e[2],d,f=e[0],P=e[1],v;if(Array.isArray(P)){return undefined}v=l.getReducedPath(m,a);if(n==="$count"||n.endsWith("/$count")||n[0]==="@"){return v}t=r.getRelativePath(r.getMetaPath(v),u);if(t===undefined){C.bHasPathReductionToParent=true;return C.oContext.getBinding().fetchIfChildCanUseCache(C.oContext,r.getRelativePath(m,C.oContext.getPath()),s)}if(y){return v}if(C.bAggregatedQueryOptionsInitial){C.selectKeyProperties(f,u);C.mAggregatedQueryOptions=r.clone(f);C.bAggregatedQueryOptionsInitial=false}if(g){d={$select:[t.slice(1)]};return C.aggregateQueryOptions(d,u,c)?v:undefined}if(t===""||P&&(P.$kind==="Property"||P.$kind==="NavigationProperty")){d=r.wrapChildQueryOptions(u,t,o,C.oModel.oInterface.fetchMetadata);if(d){return C.aggregateQueryOptions(d,u,c)?v:undefined}return undefined}if(t==="value"){return C.aggregateQueryOptions(o,u,c)?v:undefined}i.error("Failed to enhance query options for auto-$expand/$select as the path '"+p+"' does not point to a property",JSON.stringify(P),h);return undefined}).then(function(e){if(C.mLateQueryOptions){if(C.oCache){C.oCache.setLateQueryOptions(C.mLateQueryOptions)}else if(C.oCache===null){return C.oContext.getBinding().fetchIfChildCanUseCache(C.oContext,C.sPath,o.resolve(C.mLateQueryOptions)).then(function(t){return t&&e})}}return e});this.aChildCanUseCachePromises.push(d);this.oCachePromise=o.all([this.oCachePromise,d]).then(function(e){var n=e[0];if(n&&!n.hasSentRequest()&&!C.oOperation){if(C.bSharedRequest){n.setActive(false);n=C.createAndSetCache(C.mAggregatedQueryOptions,n.getResourcePath(),t)}else{n.setQueryOptions(r.merge({},C.oModel.mUriParameters,C.mAggregatedQueryOptions))}}return n});this.oCachePromise.catch(function(e){C.oModel.reportError(C+": Failed to enhance query options for "+"auto-$expand/$select for child "+n,h,e)});return d};a.prototype.fetchResolvedQueryOptions=function(e){var t,n,i,s=this.oModel,a=this.getQueryOptionsFromParameters();if(!(s.bAutoExpandSelect&&a.$select)){return o.resolve(a)}t=s.oInterface.fetchMetadata;i=r.getMetaPath(s.resolve(this.sPath,e));n=Object.assign({},a,{$select:[]});return o.all(a.$select.map(function(e){return r.fetchPropertyAndType(t,i+"/"+e).then(function(){var o=r.wrapChildQueryOptions(i,e,{},t);if(o){r.aggregateExpandSelect(n,o)}else{r.addToSelect(n,[e])}})})).then(function(){return n})};a.prototype.getBaseForPathReduction=function(){var e,t;if(!this.isRoot()){e=this.oContext.getBinding();t=e.getUpdateGroupId();if(t===this.getUpdateGroupId()||this.oModel.getGroupProperty(t,"submit")!==n.API){return e.getBaseForPathReduction()}}return this.getResolvedPath()};a.prototype.getInheritableQueryOptions=function(){if(this.mLateQueryOptions){return r.merge({},this.mCacheQueryOptions,this.mLateQueryOptions)}return this.mCacheQueryOptions||r.getQueryOptionsForPath(this.oContext.getBinding().getInheritableQueryOptions(),this.sPath)};a.prototype.getGeneration=function(){return this.bRelative&&this.oContext.getGeneration&&this.oContext.getGeneration()||0};a.prototype.getQueryOptionsForPath=function(e,t){if(Object.keys(this.mParameters).length){return r.getQueryOptionsForPath(this.getQueryOptionsFromParameters(),e)}t=t||this.oContext;if(!this.bRelative||!t.getQueryOptionsForPath){return{}}return t.getQueryOptionsForPath(r.buildPath(this.sPath,e))};a.prototype.getResumePromise=function(){return this.oResumePromise};a.prototype.hasPendingChangesInDependents=function(){var e=this.getDependentBindings();return e.some(function(e){var t=e.oCache,n;if(t!==undefined){if(t&&t.hasPendingChangesForPath("")){return true}}else if(e.hasPendingChangesForPath("")){return true}if(e.mCacheByResourcePath){n=Object.keys(e.mCacheByResourcePath).some(function(t){return e.mCacheByResourcePath[t].hasPendingChangesForPath("")});if(n){return true}}return e.hasPendingChangesInDependents()})||this.oModel.withUnresolvedBindings("hasPendingChangesInCaches",this.getResolvedPath().slice(1))};a.prototype.isPatchWithoutSideEffects=function(){return this.mParameters.$$patchWithoutSideEffects||!this.isRoot()&&this.oContext&&this.oContext.getBinding().isPatchWithoutSideEffects()};a.prototype.isMeta=function(){return false};a.prototype.refreshDependentBindings=function(e,t,n,r){return o.all(this.getDependentBindings().map(function(i){return i.refreshInternal(e,t,n,r)}))};a.prototype.refreshDependentListBindingsWithoutCache=function(){return o.all(this.getDependentBindings().map(function(e){if(e.filter&&e.oCache===null){return e.refreshInternal("")}if(e.refreshDependentListBindingsWithoutCache){return e.refreshDependentListBindingsWithoutCache()}}))};a.prototype.removeReadGroupLock=function(){if(this.oReadGroupLock){this.oReadGroupLock.unlock(true);this.oReadGroupLock=undefined}};a.prototype.refreshSuspended=function(e){if(e&&e!==this.getGroupId()){throw new Error(this+": Cannot refresh a suspended binding with group ID '"+e+"' (own group ID is '"+this.getGroupId()+"')")}this.setResumeChangeReason(s.Refresh)};a.prototype.requestAbsoluteSideEffects=function(e,t){var n=[],i=r.getMetaPath(this.getResolvedPath()),o;o=t.some(function(e){var t=r.getRelativePath(e,i);if(t!==undefined){n.push(t)}return r.hasPathPrefix(i,e)});if(o){return this.refreshInternal("",e)}else if(n.length){return this.requestSideEffects(e,n)}};a.prototype.resetChangesInDependents=function(e){this.getDependentBindings().forEach(function(t){e.push(t.oCachePromise.then(function(e){if(e){e.resetChangesForPath("")}t.resetInvalidDataState()}).unwrap());if(t.mCacheByResourcePath){Object.keys(t.mCacheByResourcePath).forEach(function(e){t.mCacheByResourcePath[e].resetChangesForPath("")})}t.resetChangesInDependents(e)})};a.prototype.resolveRefreshPromise=function(e){if(this.oRefreshPromise){this.oRefreshPromise.$resolve(e);this.oRefreshPromise=null}return e};a.prototype._resume=function(e){var t=this;function n(){t.bSuspended=false;if(t.oResumePromise){t.resumeInternal(true);t.oResumePromise.$resolve();t.oResumePromise=undefined}}if(this.oOperation){throw new Error("Cannot resume an operation binding: "+this)}if(!this.isRoot()){throw new Error("Cannot resume a relative binding: "+this)}if(!this.bSuspended){throw new Error("Cannot resume a not suspended binding: "+this)}if(e){this.createReadGroupLock(this.getGroupId(),true,1);this.oModel.addPrerenderingTask(n)}else{this.createReadGroupLock(this.getGroupId(),true);n()}};a.prototype.resume=function(){this._resume(false)};a.prototype.resumeAsync=function(){this._resume(true);return Promise.resolve(this.oResumePromise)};a.prototype.selectKeyProperties=function(e,t){r.selectKeyProperties(e,this.oModel.getMetaModel().getObject(t+"/"))};a.prototype.suspend=function(){var e;if(this.oOperation){throw new Error("Cannot suspend an operation binding: "+this)}if(!this.isRoot()){throw new Error("Cannot suspend a relative binding: "+this)}if(this.bSuspended){throw new Error("Cannot suspend a suspended binding: "+this)}if(this.hasPendingChanges()){throw new Error("Cannot suspend a binding with pending changes: "+this)}this.bSuspended=true;this.oResumePromise=new o(function(t){e=t});this.oResumePromise.$resolve=e;this.removeReadGroupLock()};a.prototype.updateAggregatedQueryOptions=function(e){var t=Object.keys(e),n=this;if(this.mAggregatedQueryOptions){t=t.concat(Object.keys(this.mAggregatedQueryOptions));t.forEach(function(t){if(n.bAggregatedQueryOptionsInitial||t!=="$select"&&t!=="$expand"){if(e[t]===undefined){delete n.mAggregatedQueryOptions[t]}else{n.mAggregatedQueryOptions[t]=e[t]}}})}};a.prototype.visitSideEffects=function(e,t,n,i,o,s){var a=n?this.oModel.getDependentBindings(n):this.getDependentBindings();a.forEach(function(n){var a=r.buildPath(s,r.getMetaPath(n.getPath())),h;if(n.oCache){h=r.stripPathPrefix(a,t);if(h.length){o.push(n.requestSideEffects(e,h))}}else if(i[a]){o.push(n.refreshInternal("",e))}else{n.visitSideEffects(e,t,null,i,o,a)}})};function u(e){if(this){a.apply(this,arguments)}else{Object.assign(e,a.prototype)}}["adjustPredicate","destroy","doDeregisterChangeListener","fetchCache","getGeneration","hasPendingChangesForPath"].forEach(function(e){u.prototype[e]=a.prototype[e]});return u},false);