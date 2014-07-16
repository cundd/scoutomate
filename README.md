Scoutomate
==========

Create a map of CSS selectors and values and let Scoutomate fill in the matching fields or click on elements.


```javascript
window.ScoutomateData = {
		'[name="billing[firstname]"]':                        'Daniel', // Fill in the input
		'[name="billing[lastname]"]':                         'Corn',
		'[name="billing[email]"]':                            'spm@cundd.net',
		'[name="billing[street][]"]':                         'Bingstreet 382',
		'[name="billing[city]"]':                             'NYC',
		'[name="billing[postcode]"]':                         '10003',
		'[name="billing[telephone]"]':                        '123456',
		'#co-billing-form #billing-buttons-container button': 'Scoutomate.Actions.click' // Click the element
}; if (!window.Scoutomate) { // Load Scoutomate
	(function() {
		var loaderTag = document.createElement('script');
		loaderTag.src = 'https://raw.githubusercontent.com/cundd/scoutomate/master/scoutomate.js';
		document.getElementsByTagName('head')[0].appendChild(loaderTag);
	})();
}
```
