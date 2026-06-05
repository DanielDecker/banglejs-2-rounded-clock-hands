let Clockwork = require('https://raw.githubusercontent.com/rozek/banglejs-2-simple-clockwork/main/Clockwork.js');

var HourHandWidth   = 2*3, halfHourHandWidth   = HourHandWidth/2;
  var MinuteHandWidth = 2*2, halfMinuteHandWidth = MinuteHandWidth/2;

  var SecondHandOffset = halfHourHandWidth + 10;

  var outerBoltRadius = halfHourHandWidth + 2, innerBoltRadius = outerBoltRadius - 4;
  var HandOffset = outerBoltRadius + 4;

  var twoPi  = 2*Math.PI, deg2rad = Math.PI/180;
  var Pi     = Math.PI;
  var halfPi = Math.PI/2;

  var sin = Math.sin, cos = Math.cos;

  var sine = [0, sin(30*deg2rad), sin(60*deg2rad), 1];

  var HandPolygon = [
    -sine[3],-sine[0], -sine[2],-sine[1], -sine[1],-sine[2], -sine[0],-sine[3],
     sine[0],-sine[3],  sine[1],-sine[2],  sine[2],-sine[1],  sine[3],-sine[0],
     sine[3], sine[0],  sine[2], sine[1],  sine[1], sine[2],  sine[0], sine[3],
    -sine[0], sine[3], -sine[1], sine[2], -sine[2], sine[1], -sine[3], sine[0],
  ];

  var HourHandLength  = 0;
  var HourHandPolygon = new Array(HandPolygon.length);

  function drawRotDigit(poly_i, cos_a, sin_a, param) {
    let poly_rot = [];

    // Rotate every point of the digit
    for (let j=0; j<poly_i.length; j+=2) {
      var x = poly_i[j];
      var y = poly_i[j+1];
      poly_i[j] = (x * cos_a + y * sin_a) + param.cx;
      poly_i[j+1] = (-x * sin_a + y * cos_a) + param.cy;
    }

    g.fillPoly(poly_i);
  }

  function drawClockHandText(minutes, hand_length, font_size, param) {
    // Calculate transformation rotation
    let rotation;
    rotation = twoPi * (15 - minutes) / 60;

    // Set font to get accuarte result for stringWidth
    g.setFont('Vector', font_size);
    // no hours => minute hand
    let text = minutes;
    let str_width = g.stringWidth(text);
    let right_side = ( rotation < halfPi && rotation > -halfPi );

    let x_offset, y_offset;
    if ( right_side ) {
      x_offset = x_off_rect= hand_length - str_width + 5;
    } else {
      x_offset = - hand_length - 5;
      rotation -= Pi;
    }
    y_offset = -font_size - 2;
    var poly = g.getVectorFontPolys(text, {x:x_offset, y:y_offset, w:font_size, h:font_size});

    let cos_a = Math.cos(rotation);
    let sin_a = Math.sin(rotation);

    // Loop thru all digits
    for (let i=0; i<poly.length; i++)
      drawRotDigit(poly[i], cos_a, sin_a, param);
  }

  function prepareHourHandPolygon(newHourHandLength) {
    if (HourHandLength === newHourHandLength) { return; }

    HourHandLength = newHourHandLength;
    for (var i = 0, l = HandPolygon.length; i < l; i+=2) {
      HourHandPolygon[i]   = halfHourHandWidth*HandPolygon[i];
      HourHandPolygon[i+1] = halfHourHandWidth*HandPolygon[i+1];
      if (i < l/2) { HourHandPolygon[i+1] -= HourHandLength; }
      if (i > l/2) { HourHandPolygon[i+1] += HandOffset; }
    }
  }

  var MinuteHandLength  = 0;
  var MinuteHandPolygon = new Array(HandPolygon.length);

  function prepareMinuteHandPolygon(newMinuteHandLength) {
    if (MinuteHandLength === newMinuteHandLength) { return; }

    MinuteHandLength = newMinuteHandLength;
    for (var i = 0, l = HandPolygon.length; i < l; i+=2) {
      MinuteHandPolygon[i]   = halfMinuteHandWidth*HandPolygon[i];
      MinuteHandPolygon[i+1] = halfMinuteHandWidth*HandPolygon[i+1];
      if (i < l/2) { MinuteHandPolygon[i+1] -= MinuteHandLength; }
      if (i > l/2) { MinuteHandPolygon[i+1] += HandOffset; }
    }
  }

  var transformedPolygon = new Array(HandPolygon.length);

  function transformPolygon (originalPolygon, OriginX,OriginY, Phi) {
    var sPhi = sin(Phi), cPhi = cos(Phi), x,y;

    for (var i = 0, l = originalPolygon.length; i < l; i+=2) {
      x = originalPolygon[i];
      y = originalPolygon[i+1];

      transformedPolygon[i]   = OriginX + x*cPhi + y*sPhi;
      transformedPolygon[i+1] = OriginY + x*sPhi - y*cPhi;
    }
  }

  Clockwork.windUp({
    //face: require('https://raw.githubusercontent.com/DanielDecker/banglejs-2-only-dots-clock-face/refs/heads/main/ClockFace.js'),
    hands: { draw : function draw (
    Settings, CenterX, CenterY, outerRadius, Hours, Minutes, Seconds
  ) {
      let minuteHandLength = outerRadius * 0.8;

      prepareHourHandPolygon  (outerRadius * 0.5);
      prepareMinuteHandPolygon(outerRadius * 0.8);

      var HoursAngle   = (Hours+(Minutes/60))/12 * twoPi - Pi;
      var MinutesAngle = (Minutes/60)            * twoPi - Pi;

      g.setColor(Settings.Foreground === 'Theme' ? g.theme.fg : Settings.Foreground || '#000000');

      transformPolygon(HourHandPolygon, CenterX,CenterY, HoursAngle);
      g.fillPoly(transformedPolygon);

      transformPolygon(MinuteHandPolygon, CenterX,CenterY, MinutesAngle);
      g.fillPoly(transformedPolygon);

      let font_size = 16;
      let param = {
        cx : CenterX,
        cy : CenterY,
        cfg : Settings
      };
      drawClockHandText(Minutes, minuteHandLength, font_size, param);

      if (Seconds != null) {
        g.setColor(Settings.Seconds === 'Theme' ? g.theme.fgH : Settings.Seconds || '#FFFF00');

        var SecondsAngle = (Seconds/60) * twoPi - Pi;

        var sPhi = Math.sin(SecondsAngle), cPhi = Math.cos(SecondsAngle);

        var SecondHandLength = outerRadius * 0.9;
        g.drawLine(
          CenterX + SecondHandOffset*sPhi,
          CenterY - SecondHandOffset*cPhi,
          CenterX - SecondHandLength*sPhi,
          CenterY + SecondHandLength*cPhi
        );
      }

      g.setColor(Settings.Foreground === 'Theme' ? g.theme.fg : Settings.Foreground || '#000000');
      g.fillCircle(CenterX,CenterY, outerBoltRadius);

      g.setColor(Settings.Background === 'Theme' ? g.theme.bg : Settings.Background || '#FFFFFF');
      g.drawCircle(CenterX,CenterY, outerBoltRadius);
      g.fillCircle(CenterX,CenterY, innerBoltRadius);
    }  },
    //complications:{
    //  t:require('https://raw.githubusercontent.com/DanielDecker/banglejs-2-HRM-complication/main/Complication.js'),
    //  l:require('https://raw.githubusercontent.com/rozek/banglejs-2-weekday-complication/main/Complication.js'),
    //  r:require('https://raw.githubusercontent.com/rozek/banglejs-2-date-complication/main/Complication.js'),
    //  b:require('https://raw.githubusercontent.com/rozek/banglejs-2-moon-phase-complication/main/Complication.js')
    //}
  },{
    Foreground:'#000000', Background:'#FFFFFF', Seconds:'#FF0000'
  });