# banglejs-2-rounded-clock-hands #

draws still simple, yet rounded, hands for an analog clock on a Bangle.js 2

This module draws some rounded hands (with a small bolt in the center) for an analog clock running on a [Bangle.js 2](https://www.espruino.com/Bangle.js2). The current minute is written next to the minute hand. The inner "bolt" is based on an idea of forum user [HughB](http://forum.espruino.com/profiles/167235/) (see [this discussion](http://forum.espruino.com/conversations/371242/)).

![](Demo.png)

## Usage ##

Within a clock implementation, the module may be used as follows:

```javascript
let Clockwork = require(...);
Clockwork.windUp({
  hands:require('https://raw.githubusercontent.com/DanielDecker/banglejs-2-rounded-clock-hands/main/ClockHands.js'),
  ...
});
```

## Example ##

The following code shows a complete example for a (still simple) analog clock using these clock hands:

```javascript
let Clockwork = require('https://raw.githubusercontent.com/rozek/banglejs-2-simple-clockwork/main/Clockwork.js');

Clockwork.windUp({
  face: require('https://raw.githubusercontent.com/rozek/banglejs-2-four-numbered-clock-face/main/ClockFace.js'),
  hands:require('https://raw.githubusercontent.com/DanielDecker/banglejs-2-rounded-clock-hands/main/ClockHands.js'),
},{
  Foreground:'#000000', Background:'#FFFFFF', Seconds:'#FF0000'
});
```

`Settings.Seconds` is optional and specifies the color in which the second hand should be drawn - if it is missing, `null` or `undefined`) no second hand will be drawn.

## License ##

[MIT License](LICENSE.md)
