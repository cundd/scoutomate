/**
 * Created by COD on 30.06.14.
 */
(function () {
	var Scoutomate = window.Scoutomate = window.Scoutomate || {},
		scoutomateInstance;


	/**
	 * Creates a new instance
	 *
	 * @param {Object} data Object with keys to define selectors and values or actions
	 * @param {String} [root] Selector of the root element
	 * @param {Object} [options]
	 * @constructor
	 */
	Scoutomate = function (data, root, options) {
		var ef = function () {
		};
		this.data = data;
		this.root = root ? document.querySelector(root) : document.querySelector('body');
		this.options = options || {
			'autofill': true
		};

		this.console = window.console || {
			log:   ef,
			debug: ef,
			info:  ef
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
		 * Loops through each property of data and takes the keys to search the DOM for matching elements which will
		 * then be filled with the property value or a special action will be performed if the value tells to
		 */
		fill: function () {
			var _this = this,
				_data = this.data,
				_root = this.root,
				_console = this.console,
				domNodes, name, valueOrAction;

			for (name in _data) {

				if (_data.hasOwnProperty(name)) {
					valueOrAction = _data[name];
					_console.debug('Looking for "' + name + '"');
					domNodes = _root.querySelectorAll(name);
					_console.debug(domNodes);


					Array.prototype.forEach.call(domNodes, function (element, i) {
						_console.debug(valueOrAction)
						if (valueOrAction === Scoutomate.Actions.click) {
							_console.debug('Perform click on ', element);
							_this.triggerEvent(element, 'click');
						} else if (valueOrAction === Scoutomate.Actions.select) {
							_console.debug('Perform click on ', element);
							element.setAttribute('selected', true);
						} else {
							_this.triggerEvent(element, 'focus');
							element.value = valueOrAction;
							_this.triggerEvent(element, 'change');
							_this.triggerEvent(element, 'blur');
						}
					});

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
				this.console.log(node)
				node.click();
				return;
			}
			var event = document.createEvent('HTMLEvents');
			event.initEvent(eventName, true, false);
			node.dispatchEvent(event);
		}
	};

	if (window.ScoutomateData) {
		scoutomateInstance = new Scoutomate(window.ScoutomateData);
	} else {
		scoutomateInstance = new Scoutomate();
	}
	return scoutomateInstance;
})();
