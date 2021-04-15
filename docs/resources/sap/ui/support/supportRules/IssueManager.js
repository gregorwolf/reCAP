/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/base/Object","sap/ui/support/library","sap/ui/support/supportRules/Constants"],function(e,t,i,r){"use strict";var u=[];var s=function(e){var t=sap.ui.getCore().byId(e.context.id),i="";if(e.context.id==="WEBPAGE"){i="sap.ui.core"}else if(t){i=t.getMetadata().getName()}return{severity:e.severity,name:e.rule.title,description:e.rule.description,resolution:e.rule.resolution,resolutionUrls:e.rule.resolutionurls,audiences:e.rule.audiences,categories:e.rule.categories,details:e.details,ruleLibName:e.rule.libName,ruleId:e.rule.id,async:e.rule.async===true,minVersion:e.rule.minversion,context:{className:i,id:e.context.id}}};var o={addIssue:function(e){u.push(e)},walkIssues:function(e){u.forEach(e)},clearIssues:function(){u=[]},getIssues:function(){return u.slice()},getIssuesModel:function(){var e=[];this.walkIssues(function(t){e.push(s(t))});return e},getRulesViewModel:function(t,i,r){var u={},s=0,o={},n={},a={},l=e.extend(true,{},t),d=e.extend(true,{},r);for(o in l){u[o]=e.extend(true,{},l[o].ruleset._mRules);n=u[o];Object.defineProperty(n,"selected",{enumerable:false,configurable:true,writable:true,value:false});Object.defineProperty(n,"issueCount",{enumerable:false,configurable:true,writable:true,value:0});for(a in l[o].ruleset._mRules){n[a]=e.extend(true,[],n[a]);Object.defineProperty(n[a],"selected",{enumerable:false,configurable:true,writable:true,value:false});Object.defineProperty(n[a],"issueCount",{enumerable:false,configurable:true,writable:true,value:0});if(i[a]){n[a].selected=true;n.selected=true}if(d[o]&&d[o][a]){n[a].push.apply(n[a],d[o][a]);s=d[o][a].length;n[a].issueCount=s;n.issueCount+=s}}}return u},getTreeTableViewModel:function(e){var t=0,i=0,r={},u,s,o=[];u=this.getRulesViewModel(e,[],[]);for(var n in u){r[t]={name:n,id:n+" "+t,selected:true,type:"lib",nodes:o};for(var a in u[n]){s=u[n][a];o.push({name:s.title,description:s.description,id:s.id,audiences:s.audiences.toString(),categories:s.categories.toString(),minversion:s.minversion,resolution:s.resolution,title:s.title,libName:n,selected:true});i++}o=[];t++}return r},getIssuesViewModel:function(e){var t={},i=0,r=0,u=0,s,o=0,n=0,a=0;for(var l in e){t[i]={name:l,showAudiences:false,showCategories:false,type:"lib"};for(var d in e[l]){s=this._sortSeverityIssuesByPriority(e[l][d]);t[i][r]={formattedName:this._getFormattedName({name:e[l][d][0].name,highCount:s.high,mediumCount:s.medium,lowCount:s.low,highName:"H",mediumName:"M",lowName:"L"}),name:e[l][d][0].name,showAudiences:true,showCategories:true,categories:e[l][d][0].categories.join(", "),audiences:e[l][d][0].audiences.join(", "),issueCount:e[l][d].length,description:e[l][d][0].description,resolution:e[l][d][0].resolution,type:"rule",ruleLibName:e[l][d][0].ruleLibName,ruleId:e[l][d][0].ruleId,selected:e[l][d][0].selected,details:e[l][d][0].details,severity:e[l][d][0].severity};u+=e[l][d].length;r++;o+=s.high;n+=s.medium;a+=s.low}t[i].formattedName=this._getFormattedName({name:t[i].name,highCount:o,mediumCount:n,lowCount:a,highName:"High",mediumName:"Medium",lowName:"Low"});t[i].name+=" ("+u+" issues)";t[i].issueCount=u;u=0;r=0;i++;o=0;n=0;a=0}return t},_getFormattedName:function(e){var t="",i="",u="";if(e.highCount>0){t="color: "+r.SUPPORT_ASSISTANT_SEVERITY_HIGH_COLOR+";"}if(e.mediumCount>0){i="color: "+r.SUPPORT_ASSISTANT_SEVERITY_MEDIUM_COLOR+";"}if(e.lowCount>0){u="color: "+r.SUPPORT_ASSISTANT_SEVERITY_LOW_COLOR+";"}return e.name+' (<span style="'+t+'"> '+e.highCount+" "+e.highName+", </span> "+'<span style="'+i+'"> '+e.mediumCount+" "+e.mediumName+", </span> "+'<span style="'+u+'"> '+e.lowCount+" "+e.lowName+"</span> )"},_sortSeverityIssuesByPriority:function(e){var t=0,i=0,u=0;e.forEach(function(e){switch(e.severity){case r.SUPPORT_ASSISTANT_ISSUE_SEVERITY_LOW:u++;break;case r.SUPPORT_ASSISTANT_ISSUE_SEVERITY_MEDIUM:i++;break;case r.SUPPORT_ASSISTANT_ISSUE_SEVERITY_HIGH:t++;break}});return{high:t,medium:i,low:u}},convertToViewModel:function(e){var t=[];for(var i=0;i<e.length;i++){t.push(s(e[i]))}return t},groupIssues:function(e){var t={},i={};for(var r=0;r<e.length;r++){i=e[r];if(!t[i.ruleLibName]){t[i.ruleLibName]={}}if(!t[i.ruleLibName][i.ruleId]){t[i.ruleLibName][i.ruleId]=[]}t[i.ruleLibName][i.ruleId].push(i)}return t},createIssueManagerFacade:function(e){return new n(e)}};var n=function(e){this.oRule=e};n.prototype.addIssue=function(e){e.rule=this.oRule;if(!i.Severity[e.severity]){throw"The issue from rule "+this.oRule.title+" does not have proper severity defined. Allowed values can be found"+"in sap.ui.support.Severity"}if(!e.context||!e.context.id){throw"The issue from rule '"+this.oRule.title+"' should provide a context id."}if(!e.details){throw"The issue from rule '"+this.oRule.title+"' should provide details for the generated issue."}o.addIssue(e)};return o},true);