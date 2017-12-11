Scoutomate
==========

Create a map of CSS selectors and values and let Scoutomate fill in the matching fields or click on elements.

Usage
-----

First define your data:

```javascript
window.ScoutomateData = {
    '[name*="firstName"i]':                 'Daniel',                       // Fill in the static input
    '[name*="lastName"i]':                  function() {return 'Corn'},     // Fill in the return value
    '[name*="payment"][value="VISA"]':      'Scoutomate.Actions.click',     // Select a radio button 
    '#my-button':                           'Scoutomate.Actions.click'      // Click the element
};
```

then include the library

```html
<script src="https://cdn.rawgit.com/cundd/scoutomate/master/scoutomate.js"
        integrity="XA5ElvKtmv8D04vfpmzOdJ/zw/HUqQhg6Co5M4fEiewc07r9nHs46vH6OiYBeJopXLfNoQYJupgZEFzfH7F61Q=="
        crossorigin="anonymous"></script>
```
