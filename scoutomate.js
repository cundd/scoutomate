(function () {
    /**
     * @readonly
     * @enum {string}
     */
    const Actions = {
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

    class Scoutomate {
        static Actions = Actions;

        /**
         * Create a new instance
         *
         * @param {object} data Object with keys to define selectors and values or actions
         * @param {string} [root] Selector of the root element
         * @param {object} [options]
         * @constructor
         */
        constructor(data, root, options) {
            this.data = data;
            this.root = root
                ? document.querySelector(root)
                : document.querySelector("body");
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
         * @param element
         */
        select(element) {
            this._debug("Select of element ", element);
            element.setAttribute("selected", true);

            // Set the value of the parent select box if not done with setting "selected"
            const selectElement =
                element.parentElement.nodeName === "SELECT"
                    ? element.parentElement
                    : element.parentElement.parentElement;
            if (selectElement.value != element.value) {
                selectElement.value = element.value;
            }
        }

        /**
         * Fill a input element
         *
         * @param element
         * @param valueOrAction
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
         * @param element
         */
        click(element) {
            this._debug("Perform click on ", element);
            this.triggerEvent(element, "click");
        }

        /**
         * Fills the given field or performs the action
         *
         * @param {string} selector
         * @param {*} valueOrAction
         * @returns {NodeList}
         */
        handle(selector, valueOrAction) {
            const _this = this;
            const domNodes = this.root.querySelectorAll(selector);
            this._debug("Found " + domNodes.length + ' for "' + selector + '"');

            Array.prototype.forEach.call(domNodes, function (element) {
                _this._debug(valueOrAction);
                const preparedValueOrAction =
                    typeof valueOrAction === "function"
                        ? valueOrAction(element)
                        : valueOrAction;
                if (preparedValueOrAction === Scoutomate.Actions.click) {
                    _this.click(element);
                } else if (
                    preparedValueOrAction === Scoutomate.Actions.select
                ) {
                    _this.select(element);
                } else {
                    _this.fillField(element, preparedValueOrAction);
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
         * @param {*} [_data] currently unused
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
         * @param _item
         * @returns {*}
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
         * @param _item
         * @returns {*}
         * @private
         */
        _log(_item) {
            return this._applyLoggerFunction("log", arguments);
        }

        /**
         * Perform a log function
         *
         * @param functionName
         * @param inputArguments
         * @returns {Scoutomate}
         * @private
         */
        _applyLoggerFunction(functionName, inputArguments) {
            const logger = window.console;
            if (logger && typeof logger[functionName] === "function") {
                const argumentsArray =
                    Array.prototype.slice.call(inputArguments);
                argumentsArray.unshift("[Scoutomate]");

                logger[functionName].apply(logger, argumentsArray);
            }

            return this;
        }
    }

    const scoutomateOptions = window["ScoutomateOptions"] || {};
    const scoutomateData = window["ScoutomateData"];
    if (scoutomateData) {
        window["ScoutomateInstance"] = new Scoutomate(
            scoutomateData,
            null,
            scoutomateOptions,
        );
    }
})();
