/**
 * Created by COD on 30.06.14.
 */
(function () {
    var scoutomateInstance;

    /**
     * Creates a new instance
     *
     * @param {Object} data Object with keys to define selectors and values or actions
     * @param {String} [root] Selector of the root element
     * @param {Object} [options]
     * @constructor
     */
    var Scoutomate = window.Scoutomate = function (data, root, options) {
        var ef = function () {
        };
        this.data = data;
        this.root = root ? document.querySelector(root) : document.querySelector('body');
        this.options = options || {
                'autofill': true
            };

        if (data && this.options.autofill) {
            this.fill();
        }
    };

    Scoutomate.Actions = {};

    /**
     * Constant to perform a click
     *
     * @type {string}
     */
    Scoutomate.Actions.click = 'Scoutomate.Actions.click';

    /**
     * Constant to select an option
     *
     * @type {string}
     */
    Scoutomate.Actions.select = 'Scoutomate.Actions.select';

    Scoutomate.prototype = {
        /**
         * Select a value in a select box
         *
         * @param element
         */
        select: function (element) {
            this._debug('Perform click on ', element);
            element.setAttribute('selected', true);

            // Set the value of the parent select box if not done with setting "selected"
            var selectElement = element.parentElement.nodeName === 'SELECT' ? element.parentElement : element.parentElement.parentElement;
            if (selectElement.value != element.value) {
                selectElement.value = element.value;
            }
        },

        /**
         * Fill a input element
         *
         * @param element
         * @param valueOrAction
         */
        fillField: function (element, valueOrAction) {
            this.triggerEvent(element, 'focus');
            element.value = valueOrAction;
            this.triggerEvent(element, 'change');
            this.triggerEvent(element, 'blur');
        },

        /**
         * Perform a click
         *
         * @param element
         */
        click: function (element) {
            this._debug('Perform click on ', element);
            this.triggerEvent(element, 'click');
        },

        /**
         * Fills the given field or performs the action
         *
         * @param {string} selector
         * @param {*} valueOrAction
         * @returns {NodeList}
         */
        handle: function (selector, valueOrAction) {
            var _this = this;
            this._debug('Looking for "' + selector + '"');
            var domNodes = this.root.querySelectorAll(selector);
            this._debug(domNodes);

            Array.prototype.forEach.call(domNodes, function (element) {
                _this._debug(valueOrAction);
                if (valueOrAction === Scoutomate.Actions.click) {
                    _this.click(element);
                } else if (valueOrAction === Scoutomate.Actions.select) {
                    _this.select(element);
                } else {
                    _this.fillField(element, valueOrAction);
                }
            });
        },

        /**
         * Loops through each property of data and takes the keys to search the DOM for matching elements which will
         * then be filled with the property value or a special action will be performed if the value tells to
         */
        fill: function () {
            var _data = this.data,
                name;

            for (name in _data) {
                if (_data.hasOwnProperty(name)) {
                    this.handle(name, _data[name]);
                }
            }
        },

        /**
         * Triggers the event with the given name on the given node
         *
         * @param {HTMLElement} node
         * @param {String} eventName
         * @param {*} [data] currently unused
         */
        triggerEvent: function (node, eventName, data) {
            if (eventName === 'click') {
                this._log(node);
                node.click();
                return;
            }
            var event = document.createEvent('HTMLEvents');
            event.initEvent(eventName, true, false);
            node.dispatchEvent(event);
        },

        /**
         * Debug-log
         *
         * @param item
         * @returns {*}
         * @private
         */
        _debug: function (item) {
            return this._applyLoggerFunction('debug', arguments);
        },

        /**
         * Log
         *
         * @param item
         * @returns {*}
         * @private
         */
        _log: function (item) {
            return this._applyLoggerFunction('log', arguments);
        },

        /**
         * Perform a log function
         *
         * @param functionName
         * @param inputArguments
         * @returns {Scoutomate}
         * @private
         */
        _applyLoggerFunction: function (functionName, inputArguments) {
            var logger = window.console;
            if (logger && typeof logger[functionName] === 'function') {
                var argumentsArray = Array.prototype.slice.call(inputArguments);
                argumentsArray.unshift('[Scoutomate]');

                logger[functionName].apply(logger, argumentsArray);
            }

            return this;
        }
    };

    if (window['ScoutomateData']) {
        scoutomateInstance = new Scoutomate(window['ScoutomateData']);
    } else {
        scoutomateInstance = new Scoutomate();
    }
    return scoutomateInstance;
})();
