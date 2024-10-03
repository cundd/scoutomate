# Scoutomate

Create a map of CSS selectors and values and let Scoutomate fill in the matching fields or click on elements.

## Usage

First define your data:

```javascript
window.ScoutomateData = {
    '[name*="firstName"i]': "Daniel", // Fill in the static input
    '[name*="lastName"i]': function (element) {
        return `Corn (in field '${element.name}')`;
    }, // Fill in the return value
    '[name*="payment"][value="VISA"]': "Scoutomate.Actions.click", // Select a radio button
    "#my-button": "Scoutomate.Actions.click", // Click the element
};
```

then include the library

```html
<script
    src="https://cdn.jsdelivr.net/gh/cundd/scoutomate@refs/tags/0.1.0/scoutomate.js"
    integrity="sha384-tEbPIMjblbnFpZ5Zl4C8G8uUDwiMozkt5VJ/QKQMxor/TaZN05wJxkQHvYlS/34G"
    crossorigin="anonymous"></script>
```
