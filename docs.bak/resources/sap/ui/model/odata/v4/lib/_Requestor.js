/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(
    [
        "./_Batch",
        "./_GroupLock",
        "./_Helper",
        "./_V2Requestor",
        "sap/base/Log",
        "sap/ui/base/SyncPromise",
        "sap/ui/thirdparty/jquery"
    ],
    function (e, t, r, n, o, i, s) {
        "use strict"
        var a = { Accept: "multipart/mixed" },
            u = "sap.ui.model.odata.v4.lib._Requestor",
            c = /(\$\w+)=~/g,
            h = /^\d+$/
        function p(e) {
            var t
            e = e.toLowerCase()
            for (t in this.headers) {
                if (t.toLowerCase() === e) {
                    return this.headers[t]
                }
            }
        }
        function f(e, t, n, o) {
            this.mBatchQueue = {}
            this.mHeaders = t || {}
            this.aLockedGroupLocks = []
            this.oModelInterface = o
            this.sQueryParams = r.buildQuery(n)
            this.mRunningChangeRequests = {}
            this.oSecurityTokenPromise = null
            this.iSessionTimer = 0
            this.iSerialNumber = 0
            this.sServiceUrl = e
        }
        f.prototype.mFinalHeaders = {
            "Content-Type":
                "application/json;charset=UTF-8;IEEE754Compatible=true"
        }
        f.prototype.mPredefinedPartHeaders = {
            Accept:
                "application/json;odata.metadata=minimal;IEEE754Compatible=true"
        }
        f.prototype.mPredefinedRequestHeaders = {
            Accept:
                "application/json;odata.metadata=minimal;IEEE754Compatible=true",
            "OData-MaxVersion": "4.0",
            "OData-Version": "4.0",
            "X-CSRF-Token": "Fetch"
        }
        f.prototype.mReservedHeaders = {
            accept: true,
            "accept-charset": true,
            "content-encoding": true,
            "content-id": true,
            "content-language": true,
            "content-length": true,
            "content-transfer-encoding": true,
            "content-type": true,
            "if-match": true,
            "if-none-match": true,
            isolation: true,
            "odata-isolation": true,
            "odata-maxversion": true,
            "odata-version": true,
            prefer: true,
            "sap-contextid": true
        }
        f.prototype.addChangeSet = function (e) {
            var t = [],
                r = this.getOrCreateBatchQueue(e)
            t.iSerialNumber = this.getSerialNumber()
            r.iChangeSet += 1
            r.splice(r.iChangeSet, 0, t)
        }
        f.prototype.addChangeToGroup = function (e, t) {
            var r
            if (this.getGroupSubmitMode(t) === "Direct") {
                e.$resolve(
                    this.request(
                        e.method,
                        e.url,
                        this.lockGroup(t, this, true, true),
                        e.headers,
                        e.body,
                        e.$submit,
                        e.$cancel
                    )
                )
            } else {
                r = this.getOrCreateBatchQueue(t)
                r[r.iChangeSet].push(e)
            }
        }
        f.prototype.addQueryString = function (e, t, n) {
            var o
            n = this.convertQueryOptions(t, n, false, true)
            e = e.replace(c, function (e, t) {
                var o = n[t]
                delete n[t]
                return r.encodePair(t, o)
            })
            o = r.buildQuery(n)
            if (!o) {
                return e
            }
            return e + (e.includes("?") ? "&" + o.slice(1) : o)
        }
        f.prototype.batchRequestSent = function (e, t) {
            var r, n
            if (t) {
                if (this.mRunningChangeRequests[e]) {
                    throw new Error("Unexpected second $batch")
                }
                r = new i(function (e) {
                    n = e
                })
                r.$resolve = n
                this.mRunningChangeRequests[e] = r
            }
        }
        f.prototype.batchResponseReceived = function (e, t) {
            if (t) {
                this.mRunningChangeRequests[e].$resolve()
                delete this.mRunningChangeRequests[e]
            }
        }
        f.prototype.buildQueryString = function (e, t, n, o) {
            return r.buildQuery(this.convertQueryOptions(e, t, n, o))
        }
        f.prototype.cancelChanges = function (e) {
            if (this.mRunningChangeRequests[e]) {
                throw new Error(
                    "Cannot cancel the changes for group '" +
                        e +
                        "', the batch request is running"
                )
            }
            this.cancelChangesByFilter(function () {
                return true
            }, e)
            this.cancelGroupLocks(e)
        }
        f.prototype.cancelChangesByFilter = function (e, t) {
            var r = false,
                n = this
            function o(t) {
                var o = n.mBatchQueue[t],
                    i,
                    s,
                    a,
                    u,
                    c
                for (c = o.length - 1; c >= 0; c -= 1) {
                    if (Array.isArray(o[c])) {
                        s = o[c]
                        for (u = s.length - 1; u >= 0; u -= 1) {
                            i = s[u]
                            if (i.$cancel && e(i)) {
                                i.$cancel()
                                a = new Error(
                                    "Request canceled: " +
                                        i.method +
                                        " " +
                                        i.url +
                                        "; group: " +
                                        t
                                )
                                a.canceled = true
                                i.$reject(a)
                                s.splice(u, 1)
                                r = true
                            }
                        }
                    }
                }
            }
            if (t) {
                if (this.mBatchQueue[t]) {
                    o(t)
                }
            } else {
                for (t in this.mBatchQueue) {
                    o(t)
                }
            }
            return r
        }
        f.prototype.cancelGroupLocks = function (e) {
            this.aLockedGroupLocks.forEach(function (t) {
                if (
                    (!e || e === t.getGroupId()) &&
                    t.isModifying() &&
                    t.isLocked()
                ) {
                    t.cancel()
                }
            })
        }
        f.prototype.checkForOpenRequests = function () {
            var e = this
            if (
                Object.keys(this.mRunningChangeRequests).length ||
                Object.keys(this.mBatchQueue).some(function (t) {
                    return e.mBatchQueue[t].some(function (e) {
                        return Array.isArray(e) ? e.length : true
                    })
                }) ||
                this.aLockedGroupLocks.some(function (e) {
                    return e.isLocked()
                })
            ) {
                throw new Error("Unexpected open requests")
            }
        }
        f.prototype.checkHeaderNames = function (e) {
            var t
            for (t in e) {
                if (this.mReservedHeaders[t.toLowerCase()]) {
                    throw new Error("Unsupported header: " + t)
                }
            }
        }
        f.prototype.cleanUpChangeSets = function (e) {
            var t,
                n = false,
                o
            function i(e) {
                if (!s(e)) {
                    t.push(e)
                }
            }
            function s(e) {
                if (e.method !== "PATCH") {
                    return false
                }
                return t.some(function (t) {
                    if (
                        t.method === "PATCH" &&
                        t.headers["If-Match"] === e.headers["If-Match"]
                    ) {
                        r.merge(t.body, e.body)
                        e.$resolve(t.$promise)
                        return true
                    }
                })
            }
            for (o = e.iChangeSet; o >= 0; o -= 1) {
                t = []
                e[o].forEach(i)
                if (t.length === 0) {
                    e.splice(o, 1)
                } else if (t.length === 1 && this.isChangeSetOptional()) {
                    e[o] = t[0]
                } else {
                    e[o] = t
                }
                n = n || t.length > 0
            }
            return n
        }
        f.prototype.clearSessionContext = function (e) {
            if (e) {
                this.oModelInterface.fireSessionTimeout()
            }
            delete this.mHeaders["SAP-ContextId"]
            if (this.iSessionTimer) {
                clearInterval(this.iSessionTimer)
                this.iSessionTimer = 0
            }
        }
        f.prototype.convertExpand = function (e, t) {
            var r,
                n = [],
                o = this
            if (!e || typeof e !== "object") {
                throw new Error("$expand must be a valid object")
            }
            r = Object.keys(e)
            if (t) {
                r = r.sort()
            }
            r.forEach(function (r) {
                var i = e[r]
                if (i && typeof i === "object") {
                    n.push(o.convertExpandOptions(r, i, t))
                } else {
                    n.push(r)
                }
            })
            return n.join(",")
        }
        f.prototype.convertExpandOptions = function (e, t, r) {
            var n = []
            this.doConvertSystemQueryOptions(
                undefined,
                t,
                function (e, t) {
                    n.push(e + "=" + t)
                },
                undefined,
                r
            )
            return n.length ? e + "(" + n.join(";") + ")" : e
        }
        f.prototype.convertQueryOptions = function (e, t, r, n) {
            var o = {}
            if (!t) {
                return undefined
            }
            this.doConvertSystemQueryOptions(
                e,
                t,
                function (e, t) {
                    o[e] = t
                },
                r,
                n
            )
            return o
        }
        f.prototype.convertResourcePath = function (e) {
            return e
        }
        f.prototype.destroy = function () {
            this.clearSessionContext()
        }
        f.prototype.doCheckVersionHeader = function (e, t, r) {
            var n = e("OData-Version"),
                o = !n && e("DataServiceVersion")
            if (o) {
                throw new Error(
                    "Expected 'OData-Version' header with value '4.0' but received" +
                        " 'DataServiceVersion' header with value '" +
                        o +
                        "' in response for " +
                        this.sServiceUrl +
                        t
                )
            }
            if (n === "4.0" || (!n && r)) {
                return
            }
            throw new Error(
                "Expected 'OData-Version' header with value '4.0' but received value '" +
                    n +
                    "' in response for " +
                    this.sServiceUrl +
                    t
            )
        }
        f.prototype.doConvertResponse = function (e, t) {
            return e
        }
        f.prototype.doConvertSystemQueryOptions = function (e, t, r, n, o) {
            var i = this
            Object.keys(t).forEach(function (e) {
                var s = t[e]
                if (n && e[0] === "$") {
                    return
                }
                switch (e) {
                    case "$expand":
                        if (s !== "~") {
                            s = i.convertExpand(s, o)
                        }
                        break
                    case "$select":
                        if (Array.isArray(s)) {
                            s = o ? s.sort().join(",") : s.join(",")
                        }
                        break
                    default:
                }
                r(e, s)
            })
        }
        f.prototype.fetchTypeForPath = function (e, t) {
            return this.oModelInterface.fetchMetadata(e + (t ? "/$Type" : "/"))
        }
        f.prototype.formatPropertyAsLiteral = function (e, t) {
            return r.formatLiteral(e, t.$Type)
        }
        f.prototype.getGroupSubmitMode = function (e) {
            return this.oModelInterface.getGroupProperty(e, "submit")
        }
        f.prototype.getModelInterface = function () {
            return this.oModelInterface
        }
        f.prototype.getOrCreateBatchQueue = function (e) {
            var t,
                r = this.mBatchQueue[e]
            if (!r) {
                t = []
                t.iSerialNumber = 0
                r = this.mBatchQueue[e] = [t]
                r.iChangeSet = 0
                if (this.oModelInterface.onCreateGroup) {
                    this.oModelInterface.onCreateGroup(e)
                }
            }
            return r
        }
        f.prototype.getPathAndAddQueryOptions = function (e, t, r) {
            var n = [],
                o,
                i = {},
                s,
                a = this
            e = e.slice(1, -5)
            if (t.$Parameter) {
                t.$Parameter.forEach(function (e) {
                    i[e.$Name] = e
                })
            }
            if (t.$kind === "Function") {
                for (o in r) {
                    s = i[o]
                    if (s) {
                        if (s.$isCollection) {
                            throw new Error(
                                "Unsupported collection-valued parameter: " + o
                            )
                        }
                        n.push(
                            encodeURIComponent(o) +
                                "=" +
                                encodeURIComponent(
                                    a.formatPropertyAsLiteral(r[o], s)
                                )
                        )
                    }
                }
                e += "(" + n.join(",") + ")"
            } else {
                for (o in r) {
                    if (!(o in i)) {
                        delete r[o]
                    }
                }
            }
            return e
        }
        f.prototype.getSerialNumber = function () {
            this.iSerialNumber += 1
            return this.iSerialNumber
        }
        f.prototype.getServiceUrl = function () {
            return this.sServiceUrl
        }
        f.prototype.hasChanges = function (e, t) {
            var r = this.mBatchQueue[e]
            if (r) {
                return r.some(function (e) {
                    return (
                        Array.isArray(e) &&
                        e.some(function (e) {
                            return e.headers["If-Match"] === t
                        })
                    )
                })
            }
            return false
        }
        f.prototype.hasPendingChanges = function (e) {
            var t = this
            function r(t) {
                if (!e) {
                    return Object.keys(t)
                }
                return e in t ? [e] : []
            }
            return (
                r(this.mRunningChangeRequests).length > 0 ||
                this.aLockedGroupLocks.some(function (t) {
                    return (
                        (e === undefined || t.getGroupId() === e) &&
                        t.isModifying() &&
                        t.isLocked()
                    )
                }) ||
                r(this.mBatchQueue).some(function (e) {
                    return t.mBatchQueue[e].some(function (e) {
                        return (
                            Array.isArray(e) &&
                            e.some(function (e) {
                                return e.$cancel
                            })
                        )
                    })
                })
            )
        }
        f.prototype.isActionBodyOptional = function () {
            return false
        }
        f.prototype.isChangeSetOptional = function () {
            return true
        }
        f.prototype.mergeGetRequests = function (e) {
            var t = [],
                n = this
            function o(e) {
                return (
                    e.$queryOptions &&
                    t.some(function (t) {
                        if (t.$queryOptions && e.url === t.url) {
                            r.aggregateQueryOptions(
                                t.$queryOptions,
                                e.$queryOptions
                            )
                            e.$resolve(t.$promise)
                            return true
                        }
                        return false
                    })
                )
            }
            e.forEach(function (e) {
                if (!o(e)) {
                    t.push(e)
                }
            })
            t.forEach(function (e) {
                if (e.$queryOptions) {
                    e.url = n.addQueryString(
                        e.url,
                        e.$metaPath,
                        e.$queryOptions
                    )
                }
            })
            t.iChangeSet = e.iChangeSet
            return t
        }
        f.prototype.processBatch = function (e) {
            var t,
                n = this.mBatchQueue[e] || [],
                o = this
            function i(e) {
                if (Array.isArray(e)) {
                    e.forEach(i)
                } else if (e.$submit) {
                    e.$submit()
                }
            }
            function s(e, t) {
                if (Array.isArray(t)) {
                    t.forEach(s.bind(null, e))
                } else {
                    t.$reject(e)
                }
            }
            function a(e, t) {
                var n
                e.forEach(function (e, i) {
                    var s,
                        u,
                        c,
                        h = t[i]
                    if (Array.isArray(h)) {
                        a(e, h)
                    } else if (!h) {
                        s = new Error(
                            "HTTP request was not processed because the previous request failed"
                        )
                        s.cause = n
                        s.$reported = true
                        e.$reject(s)
                    } else if (h.status >= 400) {
                        h.getResponseHeader = p
                        n = r.createError(
                            h,
                            "Communication error",
                            e.url,
                            e.$resourcePath
                        )
                        if (Array.isArray(e)) {
                            r.decomposeError(n, e).forEach(function (t, r) {
                                e[r].$reject(t)
                            })
                        } else {
                            e.$reject(n)
                        }
                    } else {
                        if (h.responseText) {
                            try {
                                o.doCheckVersionHeader(p.bind(h), e.url, true)
                                c = o.doConvertResponse(
                                    JSON.parse(h.responseText),
                                    e.$metaPath
                                )
                            } catch (t) {
                                e.$reject(t)
                                return
                            }
                        } else {
                            c = e.method === "GET" ? null : {}
                        }
                        o.reportUnboundMessagesAsJSON(
                            e.url,
                            p.call(h, "sap-messages")
                        )
                        u = p.call(h, "ETag")
                        if (u) {
                            c["@odata.etag"] = u
                        }
                        e.$resolve(c)
                    }
                })
            }
            delete this.mBatchQueue[e]
            i(n)
            t = this.cleanUpChangeSets(n)
            if (n.length === 0) {
                return Promise.resolve()
            }
            this.batchRequestSent(e, t)
            n = this.mergeGetRequests(n)
            return this.sendBatch(n, e)
                .then(function (e) {
                    a(n, e)
                })
                .catch(function (e) {
                    var t = new Error(
                        "HTTP request was not processed because $batch failed"
                    )
                    t.cause = e
                    s(t, n)
                    throw e
                })
                .finally(function () {
                    o.batchResponseReceived(e, t)
                })
        }
        f.prototype.ready = function () {
            return i.resolve()
        }
        f.prototype.lockGroup = function (e, r, n, o, i) {
            var s
            s = new t(e, r, n, o, this.getSerialNumber(), i)
            if (n) {
                this.aLockedGroupLocks.push(s)
            }
            return s
        }
        f.prototype.refreshSecurityToken = function (e) {
            var t = this
            if (!this.oSecurityTokenPromise) {
                if (e !== this.mHeaders["X-CSRF-Token"]) {
                    return Promise.resolve()
                }
                this.oSecurityTokenPromise = new Promise(function (e, n) {
                    s.ajax(t.sServiceUrl + t.sQueryParams, {
                        method: "HEAD",
                        headers: Object.assign({}, t.mHeaders, {
                            "X-CSRF-Token": "Fetch"
                        })
                    }).then(
                        function (r, n, o) {
                            var i = o.getResponseHeader("X-CSRF-Token")
                            if (i) {
                                t.mHeaders["X-CSRF-Token"] = i
                            } else {
                                delete t.mHeaders["X-CSRF-Token"]
                            }
                            t.oSecurityTokenPromise = null
                            e()
                        },
                        function (e) {
                            t.oSecurityTokenPromise = null
                            n(
                                r.createError(
                                    e,
                                    "Could not refresh security token"
                                )
                            )
                        }
                    )
                })
            }
            return this.oSecurityTokenPromise
        }
        f.prototype.relocate = function (e, t, r) {
            var n = this.mBatchQueue[e],
                o = this,
                i =
                    n &&
                    n[0].some(function (e, i) {
                        if (e.body === t) {
                            o.addChangeToGroup(e, r)
                            n[0].splice(i, 1)
                            return true
                        }
                    })
            if (!i) {
                throw new Error("Request not found in group '" + e + "'")
            }
        }
        f.prototype.relocateAll = function (e, t, r) {
            var n = 0,
                o = this.mBatchQueue[e],
                i = this
            if (o) {
                o[0].slice().forEach(function (e) {
                    if (!r || e.headers["If-Match"] === r) {
                        i.addChangeToGroup(e, t)
                        o[0].splice(n, 1)
                    } else {
                        n += 1
                    }
                })
            }
        }
        f.prototype.removePatch = function (e) {
            var t = this.cancelChangesByFilter(function (t) {
                return t.$promise === e
            })
            if (!t) {
                throw new Error(
                    "Cannot reset the changes, the batch request is running"
                )
            }
        }
        f.prototype.removePost = function (e, t) {
            var n = r.getPrivateAnnotation(t, "postBody"),
                o = this.cancelChangesByFilter(function (e) {
                    return e.body === n
                }, e)
            if (!o) {
                throw new Error(
                    "Cannot reset the changes, the batch request is running"
                )
            }
        }
        f.prototype.reportUnboundMessagesAsJSON = function (e, t) {
            this.oModelInterface.reportUnboundMessages(e, JSON.parse(t || null))
        }
        f.prototype.request = function (e, t, r, n, o, i, s, a, u, c, h) {
            var p,
                f,
                d = (r && r.getGroupId()) || "$direct",
                l,
                m = Infinity,
                y,
                g = this
            if (d === "$cached") {
                f = new Error("Unexpected request: " + e + " " + t)
                f.$cached = true
                throw f
            }
            if (r && r.isCanceled()) {
                if (s) {
                    s()
                }
                f = new Error("Request already canceled")
                f.canceled = true
                return Promise.reject(f)
            }
            if (r) {
                r.unlock()
                m = r.getSerialNumber()
            }
            t = this.convertResourcePath(t)
            u = u || t
            if (this.getGroupSubmitMode(d) !== "Direct") {
                l = new Promise(function (r, f) {
                    var l = g.getOrCreateBatchQueue(d)
                    y = {
                        method: e,
                        url: t,
                        headers: Object.assign(
                            {},
                            g.mPredefinedPartHeaders,
                            g.mHeaders,
                            n,
                            g.mFinalHeaders
                        ),
                        body: o,
                        $cancel: s,
                        $metaPath: a,
                        $queryOptions: h,
                        $reject: f,
                        $resolve: r,
                        $resourcePath: u,
                        $submit: i
                    }
                    if (e === "GET") {
                        l.push(y)
                    } else if (c) {
                        l[0].unshift(y)
                    } else {
                        p = l.iChangeSet
                        while (l[p].iSerialNumber > m) {
                            p -= 1
                        }
                        l[p].push(y)
                    }
                })
                y.$promise = l
                return l
            }
            if (h) {
                t = g.addQueryString(t, a, h)
            }
            if (i) {
                i()
            }
            return this.sendRequest(
                e,
                t,
                Object.assign({}, n, this.mFinalHeaders),
                JSON.stringify(o),
                u
            ).then(function (e) {
                g.reportUnboundMessagesAsJSON(e.resourcePath, e.messages)
                return g.doConvertResponse(e.body, a)
            })
        }
        f.prototype.sendBatch = function (t, r) {
            var n = e.serializeBatchRequest(
                t,
                this.getGroupSubmitMode(r) === "Auto"
                    ? "Group ID: " + r
                    : "Group ID (API): " + r
            )
            return this.sendRequest(
                "POST",
                "$batch" + this.sQueryParams,
                Object.assign(n.headers, a),
                n.body
            ).then(function (t) {
                if (t.messages !== null) {
                    throw new Error(
                        "Unexpected 'sap-messages' response header for batch request"
                    )
                }
                return e.deserializeBatchResponse(t.contentType, t.body)
            })
        }
        f.prototype.sendRequest = function (e, t, n, i, a) {
            var c = this.sServiceUrl + t,
                h = this
            return new Promise(function (p, f) {
                function d(l) {
                    var m = h.mHeaders["X-CSRF-Token"]
                    return s
                        .ajax(c, {
                            contentType: n && n["Content-Type"],
                            data: i,
                            headers: Object.assign(
                                {},
                                h.mPredefinedRequestHeaders,
                                h.mHeaders,
                                r.resolveIfMatchHeader(n)
                            ),
                            method: e
                        })
                        .then(
                            function (r, n, o) {
                                var i = o.getResponseHeader("ETag"),
                                    s = o.getResponseHeader("X-CSRF-Token")
                                try {
                                    h.doCheckVersionHeader(
                                        o.getResponseHeader,
                                        t,
                                        !r
                                    )
                                } catch (e) {
                                    f(e)
                                    return
                                }
                                if (s) {
                                    h.mHeaders["X-CSRF-Token"] = s
                                }
                                h.setSessionContext(
                                    o.getResponseHeader("SAP-ContextId"),
                                    o.getResponseHeader(
                                        "SAP-Http-Session-Timeout"
                                    )
                                )
                                if (!r) {
                                    r = e === "GET" ? null : {}
                                }
                                if (i) {
                                    r["@odata.etag"] = i
                                }
                                p({
                                    body: r,
                                    contentType: o.getResponseHeader(
                                        "Content-Type"
                                    ),
                                    messages: o.getResponseHeader(
                                        "sap-messages"
                                    ),
                                    resourcePath: t
                                })
                            },
                            function (e) {
                                var t = e.getResponseHeader("SAP-ContextId"),
                                    n = e.getResponseHeader("X-CSRF-Token"),
                                    i
                                if (
                                    !l &&
                                    e.status === 403 &&
                                    n &&
                                    n.toLowerCase() === "required"
                                ) {
                                    h.refreshSecurityToken(m).then(function () {
                                        d(true)
                                    }, f)
                                } else {
                                    i = "Communication error"
                                    if (t) {
                                        h.setSessionContext(
                                            t,
                                            e.getResponseHeader(
                                                "SAP-Http-Session-Timeout"
                                            )
                                        )
                                    } else if (h.mHeaders["SAP-ContextId"]) {
                                        i = "Session not found on server"
                                        o.error(i, undefined, u)
                                        h.clearSessionContext(true)
                                    }
                                    f(r.createError(e, i, c, a))
                                }
                            }
                        )
                }
                if (h.oSecurityTokenPromise && e !== "GET") {
                    return h.oSecurityTokenPromise.then(d)
                }
                return d()
            })
        }
        f.prototype.setSessionContext = function (e, t) {
            var r = h.test(t) ? parseInt(t) : 0,
                n = Date.now() + 30 * 60 * 1e3,
                i = this
            this.clearSessionContext()
            if (e) {
                i.mHeaders["SAP-ContextId"] = e
                if (r >= 60) {
                    this.iSessionTimer = setInterval(function () {
                        if (Date.now() >= n) {
                            i.clearSessionContext(true)
                        } else {
                            s.ajax(i.sServiceUrl + i.sQueryParams, {
                                method: "HEAD",
                                headers: {
                                    "SAP-ContextId": i.mHeaders["SAP-ContextId"]
                                }
                            }).fail(function (e) {
                                if (
                                    e.getResponseHeader("SAP-Err-Id") ===
                                    "ICMENOSESSION"
                                ) {
                                    o.error(
                                        "Session not found on server",
                                        undefined,
                                        u
                                    )
                                    i.clearSessionContext(true)
                                }
                            })
                        }
                    }, (r - 5) * 1e3)
                } else if (t !== null) {
                    o.warning(
                        "Unsupported SAP-Http-Session-Timeout header",
                        t,
                        u
                    )
                }
            }
        }
        f.prototype.submitBatch = function (e) {
            var t,
                r,
                n = this
            r = i.all(
                this.aLockedGroupLocks.map(function (t) {
                    return t.waitFor(e)
                })
            )
            t = r.isPending()
            if (t) {
                o.info("submitBatch('" + e + "') is waiting for locks", null, u)
            }
            return r.then(function () {
                if (t) {
                    o.info("submitBatch('" + e + "') continues", null, u)
                }
                n.aLockedGroupLocks = n.aLockedGroupLocks.filter(function (e) {
                    return e.isLocked()
                })
                return n.processBatch(e)
            })
        }
        f.prototype.waitForRunningChangeRequests = function (e) {
            return this.mRunningChangeRequests[e] || i.resolve()
        }
        f.create = function (e, t, r, o, i) {
            var s = new f(e, r, o, t)
            if (i === "2.0") {
                n(s)
            }
            return s
        }
        return f
    },
    false
)
