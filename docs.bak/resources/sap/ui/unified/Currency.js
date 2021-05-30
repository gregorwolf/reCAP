/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(
    [
        "sap/ui/core/Control",
        "sap/ui/core/format/NumberFormat",
        "./CurrencyRenderer"
    ],
    function (e, t, r) {
        "use strict"
        var i = e.extend("sap.ui.unified.Currency", {
            metadata: {
                library: "sap.ui.unified",
                properties: {
                    value: {
                        type: "float",
                        group: "Appearance",
                        defaultValue: 0
                    },
                    stringValue: {
                        type: "string",
                        group: "Appearance",
                        defaultValue: null
                    },
                    currency: {
                        type: "string",
                        group: "Appearance",
                        defaultValue: null
                    },
                    maxPrecision: { type: "int", group: "Appearance" },
                    useSymbol: {
                        type: "boolean",
                        group: "Appearance",
                        defaultValue: true
                    }
                },
                designtime: "sap/ui/unified/designtime/Currency.designtime",
                dnd: { draggable: true, droppable: false }
            }
        })
        i.FIGURE_SPACE = " "
        i.PUNCTUATION_SPACE = " "
        i.prototype.init = function () {
            this._oFormat = t.getCurrencyInstance({ showMeasure: false })
        }
        i.prototype.exit = function () {
            this._oFormat = null
            this._$Value = null
            this._$Currency = null
            this._sLastCurrency = null
            this._iLastCurrencyDigits = null
            this._bRenderNoValClass = null
        }
        i.prototype.onAfterRendering = function () {
            if (this.$()) {
                this._$Value = this.$().find(".sapUiUfdCurrencyValue")
                this._$Currency = this.$().find(".sapUiUfdCurrencyCurrency")
            }
        }
        i.prototype.setValue = function (e) {
            if (this.isBound("value")) {
                this._bRenderNoValClass = e == null
                if (this.$()) {
                    this.$().toggleClass(
                        "sapUiUfdCurrencyNoVal",
                        this._bRenderNoValClass
                    )
                }
            }
            this.setProperty("value", e, true)
            this._renderValue()
            return this
        }
        i.prototype.unbindProperty = function (t) {
            e.prototype.unbindProperty.apply(this, arguments)
            if (t === "value") {
                this._bRenderNoValClass = false
                if (this.$()) {
                    this.$().toggleClass("sapUiUfdCurrencyNoVal", false)
                }
            }
        }
        i.prototype.setCurrency = function (e) {
            var t, r
            this.setProperty("currency", e, true)
            this._renderCurrency()
            t = this._oFormat.oLocaleData.getCurrencyDigits(e)
            if (
                this._iLastCurrencyDigits != null &&
                this._iLastCurrencyDigits !== t
            ) {
                r = true
            } else if (this._oFormat.oLocaleData.getCurrencyDigits() !== t) {
                r = true
            }
            this._iLastCurrencyDigits = t
            if (this._sLastCurrency === "*" || e === "*") {
                r = true
            }
            this._sLastCurrency = e
            if (r) {
                this._renderValue()
                if (e === "*" && this.$()) {
                    this._bRenderNoValClass = false
                    this.$().toggleClass("sapUiUfdCurrencyNoVal", false)
                }
            }
            return this
        }
        i.prototype.setUseSymbol = function (e) {
            this.setProperty("useSymbol", e, true)
            this._renderCurrency()
            return this
        }
        i.prototype.setMaxPrecision = function (e) {
            this.setProperty("maxPrecision", e, true)
            this._renderValue()
            return this
        }
        i.prototype._renderValue = function () {
            if (this._$Value) {
                this._$Value.text(this.getFormattedValue())
            }
        }
        i.prototype._renderCurrency = function () {
            if (this._$Currency) {
                this._$Currency.text(this._getCurrency())
            }
        }
        i.prototype._getCurrency = function () {
            return this.getUseSymbol()
                ? this.getCurrencySymbol()
                : this.getCurrency()
        }
        i.prototype.getFormattedValue = function () {
            var e = this.getCurrency(),
                t,
                r,
                s,
                n = this.getMaxPrecision(),
                u = !n && n !== 0
            if (e === "*") {
                return ""
            }
            r = this._oFormat.oLocaleData.getCurrencyDigits(e)
            if (u) {
                n = r
            }
            n = n <= 0 && r > 0 ? n - 1 : n
            t = n - r
            s = this._oFormat.format(
                this.getStringValue() || this.getValue(),
                e
            )
            if (t == n && n > 0) {
                s += i.PUNCTUATION_SPACE
            }
            if (t > 0) {
                s = s.padEnd(s.length + t, i.FIGURE_SPACE)
            } else if (t < 0) {
                s = s.substr(0, s.length + t)
            }
            return s
        }
        i.prototype.getCurrencySymbol = function () {
            return this._oFormat.oLocaleData.getCurrencySymbol(
                this.getCurrency()
            )
        }
        i.prototype.getAccessibilityInfo = function () {
            if (this._bRenderNoValClass) {
                return {}
            }
            return {
                description:
                    (this.getFormattedValue() || "") +
                    " " +
                    (this.getCurrency() || "").trim()
            }
        }
        return i
    }
)
