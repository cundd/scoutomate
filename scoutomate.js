// @ts-check
/**
 * @readonly
 * @enum {string}
 */
export const Actions = {
    /**
     * Constant to perform a click
     *
     * @type {string}
     */
    click: "Scoutomate.Actions.click",

    /**
     * Constant to select an option
     *
     * @type {string}
     */
    select: "Scoutomate.Actions.select",
};

/**
 * @typedef {Object} ScoutomateOptions
 * @property {boolean} debug
 * @property {boolean} autofill
 */

export class Scoutomate {
    static Actions = Actions;

    /**
     * Create a new instance
     *
     * @param {object} data Object with keys to define selectors and values or actions
     * @param {string} [rootSelector] Selector of the root element
     * @param {Partial<ScoutomateOptions>} [options]
     * @constructor
     */
    constructor(data, rootSelector, options) {
        this.data = data;
        const effectiveRoot = rootSelector
            ? document.querySelector(rootSelector)
            : document.body;
        if (!(effectiveRoot instanceof HTMLElement)) {
            throw new Error("Could not detect root node");
        }
        this.root = effectiveRoot;

        /** @type {ScoutomateOptions} */
        this.options = Object.assign(
            {},
            {
                autofill: true,
                debug: false,
            },
            options || {},
        );

        if (data && this.options.autofill) {
            this.fill();
        }
    }

    /**
     * Select a value in a select box
     *
     * @param {HTMLOptionElement} element
     */
    select(element) {
        this._debug("Select of element ", element);
        element.setAttribute("selected", "true");

        // Set the value of the parent select box if not done with setting "selected"
        const selectElement = /** @type {HTMLSelectElement} */ (
            element.parentElement?.nodeName === "SELECT"
                ? element.parentElement
                : element.parentElement?.parentElement
        );
        if (selectElement.value != element.value) {
            selectElement.value = element.value;
        }
    }

    /**
     * Fill a input element
     *
     * @param {HTMLInputElement|HTMLTextAreaElement} element
     * @param {string} valueOrAction
     */
    fillField(element, valueOrAction) {
        this.triggerEvent(element, "focus");
        element.value = valueOrAction;
        this.triggerEvent(element, "change");
        this.triggerEvent(element, "blur");
    }

    /**
     * Perform a click
     *
     * @param {HTMLElement} element
     */
    click(element) {
        this._debug("Perform click on ", element);
        this.triggerEvent(element, "click");
    }

    /**
     * Fills the given field or performs the action
     *
     * @param {string} selector
     * @param {any} valueOrAction
     * @returns {void}
     */
    handle(selector, valueOrAction) {
        const domNodes = this.root.querySelectorAll(selector);
        this._debug("Found " + domNodes.length + ' for "' + selector + '"');

        Array.prototype.forEach.call(domNodes, (/** @type {any} */ element) => {
            this._debug(valueOrAction);
            const preparedValueOrAction =
                typeof valueOrAction === "function"
                    ? valueOrAction(element)
                    : valueOrAction;
            if (preparedValueOrAction === Scoutomate.Actions.click) {
                this.click(element);
            } else if (preparedValueOrAction === Scoutomate.Actions.select) {
                this.select(element);
            } else {
                this.fillField(element, preparedValueOrAction);
            }
        });
    }

    /**
     * Loops through each property of data and takes the keys to search the DOM for matching elements which will
     * then be filled with the property value or a special action will be performed if the value tells to
     */
    fill() {
        const _data = this.data;

        for (let name in _data) {
            if (_data.hasOwnProperty(name)) {
                this.handle(name, _data[name]);
            }
        }
    }

    /**
     * Triggers the event with the given name on the given node
     *
     * @param {HTMLElement} node
     * @param {string} eventName
     * @param {any} [_data] currently unused
     */
    triggerEvent(node, eventName, _data) {
        if (eventName === "click") {
            this._log(node);
            node.click();
            return;
        }
        const event = document.createEvent("HTMLEvents");
        event.initEvent(eventName, true, false);
        node.dispatchEvent(event);
    }

    /**
     * Debug-log
     *
     * @param {any} _item
     * @returns {Scoutomate}
     * @private
     */
    _debug(_item) {
        if (this.options.debug) {
            return this._applyLoggerFunction("debug", arguments);
        }

        return this;
    }

    /**
     * Log
     *
     * @param {any}_item
     * @returns {Scoutomate}
     * @private
     */
    _log(_item) {
        return this._applyLoggerFunction("log", arguments);
    }

    /**
     * Perform a log function
     *
     * @param {string} functionName
     * @param {IArguments|any[]} inputArguments
     * @returns {Scoutomate}
     * @private
     */
    _applyLoggerFunction(functionName, inputArguments) {
        const logger = window.console;
        if (logger && typeof logger[functionName] === "function") {
            const argumentsArray = Array.prototype.slice.call(inputArguments);
            argumentsArray.unshift("[Scoutomate]");

            logger[functionName].apply(logger, argumentsArray);
        }

        return this;
    }
}

(function () {
    const scoutomateOptions = window["ScoutomateOptions"] || {};
    const scoutomateData = window["ScoutomateData"];
    /** Run automatically if `ScoutomateData` is set */
    if (scoutomateData) {
        window["ScoutomateInstance"] = new Scoutomate(
            scoutomateData,
            undefined,
            scoutomateOptions,
        );
    }

    window["Scoutomate"] = Scoutomate;
})();
