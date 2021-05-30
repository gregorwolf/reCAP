/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/layout/library","sap/ui/layout/ResponsiveFlowLayout","sap/ui/layout/ResponsiveFlowLayoutData","./Form","./FormContainer","./FormElement","./FormLayout","./ResponsiveLayoutRenderer"],function(t,e,a,n,i,r,o,s,l){"use strict";var u=s.extend("sap.ui.layout.form.ResponsiveLayout",{metadata:{library:"sap.ui.layout"}});var f=t.extend("sap.ui.layout.form.ResponsiveLayoutPanel",{metadata:{library:"sap.ui.layout",aggregations:{content:{type:"sap.ui.layout.ResponsiveFlowLayout",multiple:false}},associations:{container:{type:"sap.ui.layout.form.FormContainer",multiple:false},layout:{type:"sap.ui.layout.form.ResponsiveLayout",multiple:false}}},getLayoutData:function(){var t=sap.ui.getCore().byId(this.getContainer());var e=sap.ui.getCore().byId(this.getLayout());var a;if(e&&t){a=e.getLayoutDataForElement(t,"sap.ui.layout.ResponsiveFlowLayoutData")}return a},getCustomData:function(){var t=sap.ui.getCore().byId(this.getContainer());if(t){return t.getCustomData()}},refreshExpanded:function(){var t=sap.ui.getCore().byId(this.getContainer());if(t){if(t.getExpanded()){this.$().removeClass("sapUiRLContainerColl")}else{this.$().addClass("sapUiRLContainerColl")}}},renderer:{apiVersion:2,render:function(t,e){var a=sap.ui.getCore().byId(e.getContainer());var n=sap.ui.getCore().byId(e.getLayout());var i=e.getContent();if(!a||!n){return}var r=a.getExpandable();var o=a.getTooltip_AsString();var s=a.getToolbar();var l=a.getTitle();t.openStart("div",e);t.class("sapUiRLContainer");if(r&&!a.getExpanded()){t.class("sapUiRLContainerColl")}if(s){t.class("sapUiFormContainerToolbar")}else if(l){t.class("sapUiFormContainerTitle")}if(o){t.attr("title",o)}n.getRenderer().writeAccessibilityStateContainer(t,a);t.openEnd();n.getRenderer().renderHeader(t,s,l,a._oExpandButton,r,false,a.getId());if(i){t.openStart("div");t.class("sapUiRLContainerCont");t.openEnd();t.renderControl(i);t.close("div")}t.close("div")}}});u.prototype.init=function(){this.mContainers={};this._defaultLayoutData=new n({margin:false})};u.prototype.exit=function(){for(var t in this.mContainers){L.call(this,t)}if(this._mainRFLayout){this._mainRFLayout.destroy();delete this._mainRFLayout}this._defaultLayoutData.destroy();delete this._defaultLayoutData};u.prototype.onBeforeRendering=function(t){var e=this.getParent();if(!e||!(e instanceof i)){return}e._bNoInvalidate=true;d.call(this,e);c.call(this,e);e._bNoInvalidate=false};u.prototype.toggleContainerExpanded=function(t){var e=t.getId();if(this.mContainers[e]&&this.mContainers[e][0]){var a=this.mContainers[e][0];a.refreshExpanded()}};u.prototype.onLayoutDataChange=function(t){var e=t.srcControl;var a;var n;var i;if(e instanceof r){if(this._mainRFLayout){this._mainRFLayout.onLayoutDataChange(t)}}else if(e instanceof o){n=e.getParent().getId();if(this.mContainers[n]&&this.mContainers[n][1]){this.mContainers[n][1].onLayoutDataChange(t)}}else{var s=e.getParent();if(s instanceof o){a=s.getParent();n=a.getId();i=s.getId();if(this.mContainers[n]&&this.mContainers[n][2]&&this.mContainers[n][2][i]){if(this.mContainers[n][2][i][1]){var l=s.getFieldsForRendering();h.call(this,this.mContainers[n][2][i][1],l)}this.mContainers[n][2][i][0].onLayoutDataChange(t)}}}};u.prototype.onsapup=function(t){this.onsapleft(t)};u.prototype.onsapdown=function(t){this.onsapright(t)};u.prototype.getContainerRenderedDomRef=function(t){if(this.getDomRef()){var e=t.getId();if(this.mContainers[e]){if(this.mContainers[e][0]){var a=this.mContainers[e][0];return a.getDomRef()}else if(this.mContainers[e][1]){var n=this.mContainers[e][1];return n.getDomRef()}}}return null};u.prototype.getElementRenderedDomRef=function(t){if(this.getDomRef()){var e=t.getParent();var a=t.getId();var n=e.getId();if(this.mContainers[n]){if(this.mContainers[n][2]){var i=this.mContainers[n][2];if(i[a]){var r=i[a][0];return r.getDomRef()}}}}return null};function d(t){var e=t.getVisibleFormContainers();var a=e.length;var n;var i;var r;var o;var s=0;for(s=0;s<a;s++){n=e[s];n._checkProperties();i=n.getId();r=undefined;o=undefined;if(this.mContainers[i]&&this.mContainers[i][1]){o=this.mContainers[i][1]}else{o=C.call(this,n,undefined)}var l=n.getTitle();var u=n.getToolbar();if(u||l||n.getExpandable()){if(this.mContainers[i]&&this.mContainers[i][0]){r=this.mContainers[i][0]}else{r=g.call(this,n,o);v(o,true)}o.removeStyleClass("sapUiRLContainer")}else{if(this.mContainers[i]&&this.mContainers[i][0]){y(this.mContainers[i][0]);v(o,false)}o.addStyleClass("sapUiRLContainer")}var f=m.call(this,n,o);this.mContainers[i]=[r,o,f]}var d=Object.keys(this.mContainers).length;if(a<d){for(i in this.mContainers){var h=false;for(s=0;s<a;s++){n=e[s];if(i==n.getId()){h=true;break}}if(!h){L.call(this,i)}}}}function g(t,e){var a=t.getId();var n=new f(a+"--Panel",{container:t,layout:this,content:e});return n}function y(t){t.setContent(null);t.setLayout(null);t.setContainer(null);t.destroy()}function m(t,e){var a=t.getId();var n=t.getVisibleFormElements();var i=n.length;var r={};if(this.mContainers[a]&&this.mContainers[a][2]){r=this.mContainers[a][2]}var o;var s;var l=-1;var u;var f;var d=0;for(d=0;d<i;d++){u=n[d];f=u.getId();_.call(this,t,u,r,e,d);if(r[f]){o=r[f][0];l=e.indexOfContent(o);if(l!=i){e.removeContent(o);e.insertContent(o,i);l=i}}else{o=C.call(this,t,u);o.addStyleClass("sapUiRLElement");if(u.getLabel()){o.addStyleClass("sapUiRLElementWithLabel")}r[f]=[o,undefined];l++;e.insertContent(o,l)}var g=u.getFieldsForRendering();if(u.getLabel()&&g.length>1){if(r[f][1]){s=r[f][1]}else{s=C.call(this,t,u,true);s.addStyleClass("sapUiRLElementFields");r[f][1]=s}h.call(this,s,g)}else{if(r[f][1]){s=r[f][1];p(s);r[f][1]=undefined}}}var y=Object.keys(r).length;if(i<y){for(f in r){var m=false;for(d=0;d<i;d++){u=n[d];if(f==u.getId()){m=true;break}}if(!m){if(r[f][1]){s=r[f][1];p(s)}o=r[f][0];e.removeContent(o);p(o);delete r[f]}}}return r}function C(t,e,i){var r;if(e&&!i){r=e.getId()+"--RFLayout"}else if(e&&i){r=e.getId()+"--content--RFLayout"}else if(t){r=t.getId()+"--RFLayout"}else{return false}var o=new a(r);o.__myParentLayout=this;o.__myParentContainerId=t.getId();if(e){o.__myParentElementId=e.getId();if(!i){o.getContent=function(){var t=sap.ui.getCore().byId(this.__myParentElementId);if(t){var e=[];var a=t.getLabelControl();var n=t.getFieldsForRendering();if(!a||n.length<=1){e=n;if(a){e.unshift(a)}}else{var i=this.__myParentLayout;var r=this.__myParentContainerId;var o=t.getId();if(a){e.push(a)}if(i.mContainers[r]&&i.mContainers[r][2]&&i.mContainers[r][2][o]&&i.mContainers[r][2][o][1]){e.push(i.mContainers[r][2][o][1])}}return e}else{return false}};o._addContentClass=function(t,e){if(e==0){var a=sap.ui.getCore().byId(this.__myParentElementId);if(a){var n=a.getLabelControl();if(t==n){return"sapUiFormElementLbl"}}}return null}}else{o.getContent=function(){var t=sap.ui.getCore().byId(this.__myParentElementId);if(t){return t.getFieldsForRendering()}else{return false}}}}else if(t){o._getAccessibleRole=function(){var t=sap.ui.getCore().byId(this.__myParentContainerId);var e=this.__myParentLayout;if(e._mainRFLayout&&!t.getToolbar()&&!t.getTitle()&&!t.getExpandable()&&t.getAriaLabelledBy().length>0){return"form"}};o.getAriaLabelledBy=function(){var t=sap.ui.getCore().byId(this.__myParentContainerId);if(t&&!t.getToolbar()&&!t.getTitle()&&!t.getExpandable()){return t.getAriaLabelledBy()}return[]}}if(e&&!i||!e&&!t.getToolbar()&&!t.getTitle()&&!t.getExpandable()){v(o,false)}else{o.setLayoutData(new n({margin:false}))}return o}function v(t,e){if(e){if(t.__originalGetLayoutData){t.getLayoutData=t.__originalGetLayoutData;delete t.__originalGetLayoutData}}else if(!t.__originalGetLayoutData){t.__originalGetLayoutData=t.getLayoutData;t.getLayoutData=function(){var t=this.__myParentLayout;var e=sap.ui.getCore().byId(this.__myParentContainerId);var a=sap.ui.getCore().byId(this.__myParentElementId);var n;if(a){n=t.getLayoutDataForElement(a,"sap.ui.layout.ResponsiveFlowLayoutData")}else if(e){n=t.getLayoutDataForElement(e,"sap.ui.layout.ResponsiveFlowLayoutData")}if(n){return n}else if(a){return t._defaultLayoutData}}}}function h(t,e){var a;var i=0;for(var r=0;r<e.length;r++){var o=e[r];a=this.getLayoutDataForElement(o,"sap.ui.layout.ResponsiveFlowLayoutData");if(a){i=i+a.getWeight()}else{i++}}a=t.getLayoutData();if(a){a.setWeight(i)}else{t.setLayoutData(new n({weight:i}))}}function p(t){if(t.__myParentContainerId){t.__myParentContainerId=undefined}if(t.__myParentElementId){t.__myParentElementId=undefined}t.__myParentLayout=undefined;t.destroy()}function L(t){var e=this.mContainers[t];var a;var n=e[2];if(n){for(var i in n){if(n[i][1]){p(n[i][1])}a=n[i][0];p(a);delete n[i]}}a=e[1];if(a){a.removeAllContent();p(a)}var r=e[0];if(r){y(r)}delete this.mContainers[t]}function _(t,e,a,n,i){var r=e.getId();var o=r+"--RFLayout";var s=sap.ui.getCore().byId(o);if(!a[r]&&s){var l=s.__myParentContainerId;a[r]=this.mContainers[l][2][r];n.insertContent(s,i);s.__myParentContainerId=t.getId();if(a[r][1]){a[r][1].__myParentContainerId=t.getId()}delete this.mContainers[l][2][r]}}function c(t){var e=t.getVisibleFormContainers();var n;var i=e.length;var r=0;var o=0;var s=0;if(i>1){if(!this._mainRFLayout){this._mainRFLayout=new a(t.getId()+"--RFLayout").setParent(this)}else{var l=this._mainRFLayout.getContent();r=l.length;var u=false;for(o=0;o<r;o++){var f=l[o];n=undefined;if(f.getContainer){n=sap.ui.getCore().byId(f.getContainer())}else{n=sap.ui.getCore().byId(f.__myParentContainerId)}if(n&&n.isVisible()){var d=e[s];if(n!=d){u=true;break}var g=this.mContainers[n.getId()];if(g[0]&&g[0]!=f){u=true;break}if(!g[0]&&g[1]&&g[1]!=f){u=true;break}s++}else{this._mainRFLayout.removeContent(f)}}if(u){this._mainRFLayout.removeAllContent();r=0}}if(r<i){var y=0;if(r>0){y=r--}for(o=y;o<i;o++){n=e[o];var m=n.getId();if(this.mContainers[m]){if(this.mContainers[m][0]){this._mainRFLayout.addContent(this.mContainers[m][0])}else if(this.mContainers[m][1]){this._mainRFLayout.addContent(this.mContainers[m][1])}}}}}}return u});