/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./_AggregationHelper","./_Cache","./_GrandTotalHelper","./_GroupLock","./_Helper","./_MinMaxHelper","sap/base/Log","sap/ui/base/SyncPromise"],function(e,t,n,r,i,o,a,l){"use strict";function s(r,o,a,s,u){var d=this;t.call(this,r,o,s,true);this.oAggregation=a;this.sDownloadUrl=t.prototype.getDownloadUrl.call(this,"");this.aElements=[];this.aElements.$byPredicate={};this.aElements.$count=undefined;this.aElements.$created=0;this.oFirstLevel=this.createGroupLevelCache(null,u);this.oGrandTotalPromise=undefined;if(u){this.oGrandTotalPromise=new l(function(t){n.enhanceCacheWithGrandTotal(d.oFirstLevel,a,function(n){var r;if(a["grandTotal like 1.84"]){e.removeUI5grand__(n)}e.setAnnotations(n,true,true,0,e.getAllProperties(a));if(a.grandTotalAtBottomOnly===false){r=Object.assign({},n,{"@$ui5.node.isExpanded":undefined});i.setPrivateAnnotation(n,"copy",r);i.setPrivateAnnotation(r,"predicate","($isTotal=true)")}i.setPrivateAnnotation(n,"predicate","()");t(n)})})}}s.prototype=Object.create(t.prototype);s.prototype.addElements=function(e,t,n,r){var o=this.aElements;function a(e,a){var l=o[t+a],s,u=i.getPrivateAnnotation(e,"predicate");if(l){if(l===e){return}s=i.getPrivateAnnotation(l,"parent");if(!s){throw new Error("Unexpected element")}if(s!==n||i.getPrivateAnnotation(l,"index")!==r+a){throw new Error("Wrong placeholder")}}else if(t+a>=o.length){throw new Error("Array index out of bounds: "+(t+a))}if(u in o.$byPredicate&&o.$byPredicate[u]!==e){throw new Error("Duplicate predicate: "+u)}o[t+a]=e;o.$byPredicate[u]=e}if(t<0){throw new Error("Illegal offset: "+t)}if(Array.isArray(e)){e.forEach(a)}else{a(e,0)}};s.prototype.collapse=function(e){var t,n=0,o=this.aElements,a=this.fetchValue(r.$cached,e).getResult(),l=a["@$ui5.node.level"],s=o.indexOf(a),u=s+1;function d(e){delete o.$byPredicate[i.getPrivateAnnotation(o[e],"predicate")];n+=1}t=i.getPrivateAnnotation(a,"collapsed");i.updateAll(this.mChangeListeners,e,a,t);while(u<o.length&&o[u]["@$ui5.node.level"]>l){d(u);u+=1}if(this.oAggregation.subtotalsAtBottomOnly!==undefined&&Object.keys(t).length>1){d(u)}i.setPrivateAnnotation(a,"spliced",o.splice(s+1,n));o.$count-=n;return n};s.prototype.createGroupLevelCache=function(n,r){var o=this.oAggregation,a=e.getAllProperties(o),l,u,d,c,g,f;c=n?n["@$ui5.node.level"]+1:1;d=c>o.groupLevels.length;u=d?o.groupLevels.concat(Object.keys(o.group).sort()):o.groupLevels.slice(0,c);g=e.filterOrderby(this.mQueryOptions,o,c);f=!d&&Object.keys(o.aggregate).some(function(e){return o.aggregate[e].subtotals});if(n){g.$$filterBeforeAggregate=i.getPrivateAnnotation(n,"filter")+(g.$$filterBeforeAggregate?" and ("+g.$$filterBeforeAggregate+")":"")}if(!r){delete g.$count;g=e.buildApply(o,g,c)}g.$count=true;l=t.create(this.oRequestor,this.sResourcePath,g,true);l.calculateKeyPredicate=s.calculateKeyPredicate.bind(null,n,u,a,d,f);return l};s.prototype.expand=function(t,n){var o,a,s=this.aElements,u=typeof n==="string"?this.fetchValue(r.$cached,n).getResult():n,d,c=i.getPrivateAnnotation(u,"spliced"),g=this;if(n!==u){i.updateAll(this.mChangeListeners,n,u,e.getOrCreateExpandedObject(this.oAggregation,u))}if(c){i.deletePrivateAnnotation(u,"spliced");d=s.indexOf(u)+1;this.aElements=s.concat(c,s.splice(d));this.aElements.$byPredicate=s.$byPredicate;a=c.length;this.aElements.$count=s.$count+a;c.forEach(function(e){var t=i.getPrivateAnnotation(e,"predicate");if(t){g.aElements.$byPredicate[t]=e;if(i.getPrivateAnnotation(e,"expanding")){i.deletePrivateAnnotation(e,"expanding");a+=g.expand(r.$cached,e).getResult()}}});return l.resolve(a)}o=i.getPrivateAnnotation(u,"cache");if(!o){o=this.createGroupLevelCache(u);i.setPrivateAnnotation(u,"cache",o)}return o.read(0,this.iReadLength,0,t).then(function(t){var n=g.aElements.indexOf(u)+1,r=u["@$ui5.node.level"],l=i.getPrivateAnnotation(u,"collapsed"),s=g.oAggregation.subtotalsAtBottomOnly!==undefined&&Object.keys(l).length>1,d;if(!u["@$ui5.node.isExpanded"]){i.deletePrivateAnnotation(u,"spliced");return 0}if(!n){i.setPrivateAnnotation(u,"expanding",true);return 0}a=t.value.$count;if(s){a+=1}if(n===g.aElements.length){g.aElements.length+=a}else{for(d=g.aElements.length-1;d>=n;d-=1){g.aElements[d+a]=g.aElements[d];delete g.aElements[d]}}g.addElements(t.value,n,o,0);for(d=n+t.value.length;d<n+t.value.$count;d+=1){g.aElements[d]=e.createPlaceholder(r+1,d-n,o)}if(s){l=Object.assign({},l);e.setAnnotations(l,undefined,true,r,e.getAllProperties(g.oAggregation));i.setPrivateAnnotation(l,"predicate",i.getPrivateAnnotation(u,"predicate").slice(0,-1)+",$isTotal=true)");g.addElements(l,n+a-1)}g.aElements.$count+=a;return a},function(e){i.updateAll(g.mChangeListeners,n,u,i.getPrivateAnnotation(u,"collapsed"));throw e})};s.prototype.fetchValue=function(e,t,n,r){if(t==="$count"){if(this.oAggregation.groupLevels.length){a.error("Failed to drill-down into $count, invalid segment: $count",this.toString(),"sap.ui.model.odata.v4.lib._Cache");return l.resolve()}return this.oFirstLevel.fetchValue(e,t,n,r)}this.registerChange(t,r);return this.drillDown(this.aElements,t,e)};s.prototype.getDownloadQueryOptions=function(t){return e.buildApply(this.oAggregation,e.filterOrderby(t,this.oAggregation),0,true)};s.prototype.getDownloadUrl=function(e,t){return this.sDownloadUrl};s.prototype.read=function(t,n,r,o,a){var s,u=t,d=n,c,g,f=!!this.oGrandTotalPromise,h=f&&this.oAggregation.grandTotalAtBottomOnly!==true,p=[],m,v,E=this;function A(e,t){var n=c,r=c.getQueryOptions(),l=i.getPrivateAnnotation(E.aElements[e],"index"),s=E.aElements[e];if(r.$count){delete r.$count;c.setQueryOptions(r,true)}p.push(c.read(l,t-e,0,o.getUnlockedCopy(),a).then(function(t){var r=false,i;if(s!==E.aElements[e]&&t.value[0]!==E.aElements[e]){r=true;e=E.aElements.indexOf(s);if(e<0){e=E.aElements.indexOf(t.value[0]);if(e<0){i=new Error("Collapse before read has finished");i.canceled=true;throw i}}}E.addElements(t.value,e,n,l);if(r){i=new Error("Collapse or expand before read has finished");i.canceled=true;throw i}}))}if(h&&!t&&n===1){if(r!==0){throw new Error("Unsupported prefetch length: "+r)}o.unlock();return this.oGrandTotalPromise.then(function(e){return{value:[e]}})}else if(this.aElements.$count===undefined){this.iReadLength=n+r;if(h){if(u){u-=1}else{d-=1}}p.push(this.oFirstLevel.read(u,d,r,o,a).then(function(t){var n,r,o=0,a;E.aElements.length=E.aElements.$count=t.value.$count;if(f){E.aElements.$count+=1;E.aElements.length+=1;n=E.oGrandTotalPromise.getResult();switch(E.oAggregation.grandTotalAtBottomOnly){case false:o=1;E.aElements.$count+=1;E.aElements.length+=1;E.addElements(n,0);r=i.getPrivateAnnotation(n,"copy");E.addElements(r,E.aElements.length-1);break;case true:E.addElements(n,E.aElements.length-1);break;default:o=1;E.addElements(n,0)}}E.addElements(t.value,u+o,E.oFirstLevel,u);for(a=0;a<E.aElements.$count;a+=1){if(!E.aElements[a]){E.aElements[a]=e.createPlaceholder(1,a-o,E.oFirstLevel)}}}))}else{for(m=t,v=Math.min(t+n,this.aElements.length);m<v;m+=1){s=i.getPrivateAnnotation(this.aElements[m],"parent");if(s!==c){if(g){A(g,m);c=g=undefined}if(s){g=m;c=s}}}if(g){A(g,m)}o.unlock()}return l.all(p).then(function(){var e=E.aElements.slice(t,t+n);e.$count=E.aElements.$count;return{value:e}})};s.prototype.refreshKeptElements=function(){};s.prototype.toString=function(){return this.sDownloadUrl};s.calculateKeyPredicate=function(t,n,r,o,a,l,s,u){var d;if(!(u in s)){return undefined}if(t){r.forEach(function(e){if(Array.isArray(e)){i.inheritPathValue(e,t,l)}else if(!(e in l)){l[e]=t[e]}})}d=o&&i.getKeyPredicate(l,u,s)||i.getKeyPredicate(l,u,s,n,true);i.setPrivateAnnotation(l,"predicate",d);if(!o){i.setPrivateAnnotation(l,"filter",i.getKeyFilter(l,u,s,n))}e.setAnnotations(l,o?undefined:false,a,t?t["@$ui5.node.level"]+1:1,t?null:r);return d};s.create=function(n,r,i,a,l,u,d){var c,g,f;if(a){c=e.hasGrandTotal(a.aggregate);g=!!a.groupLevels.length;f=e.hasMinOrMax(a.aggregate);if(c&&l.$filter&&!a["grandTotal like 1.84"]){throw new Error("Unsupported system query option: $filter")}if(g){if(l.$count){throw new Error("Unsupported system query option: $count")}if(l.$filter){throw new Error("Unsupported system query option: $filter")}}if(f){if(c){throw new Error("Unsupported grand totals together with min/max")}if(g){throw new Error("Unsupported group levels together with min/max")}}if(c||g||f){if("$expand"in l){throw new Error("Unsupported system query option: $expand")}if("$select"in l){throw new Error("Unsupported system query option: $select")}return f?o.createCache(n,r,a,l):new s(n,r,a,l,c)}}if(l.$$filterBeforeAggregate){l.$apply="filter("+l.$$filterBeforeAggregate+")/"+l.$apply;delete l.$$filterBeforeAggregate}return t.create(n,r,l,u,i,d)};return s},false);