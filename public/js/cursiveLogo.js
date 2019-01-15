(function() {
  window.signature = {
    initialize: function() {
      // console.log('init');
      return $('.signature svg').each(function() {
        var delay, i, len, length, path, paths, previousStrokeLength, results, speed;
        paths = $('path, circle, rect', this);
        delay = 0;
        results = [];
        for (i = 0, len = paths.length; i < len; i++) {
          path = paths[i];
          length = path.getTotalLength();
          previousStrokeLength = speed || 0;
          speed = length < 100 ? 20 : Math.floor(length);
          delay += previousStrokeLength + 100;
          results.push($(path).css('transition', 'none').attr('data-length', length).attr('data-speed', speed).attr('data-delay', delay).attr('stroke-dashoffset', length).attr('stroke-dasharray', length + ',' + length));
        }
        return results;
      });
    },
    animate: function() {
      console.log('animate');
      return $('.signature svg').each(function() {
        var delay, i, len, length, path, paths, results, speed;
        paths = $('path, circle, rect', this);
        results = [];
        for (i = 0, len = paths.length; i < len; i++) {
          path = paths[i];
          length = $(path).attr('data-length');
          speed = $(path).attr('data-speed');
          delay = $(path).attr('data-delay');
          results.push($(path).css('transition', 'stroke-dashoffset ' + speed + 'ms ' + delay + 'ms linear, ' + 'fill 3s ease-out').attr('stroke-dashoffset', '0'));
          console.log('filling');
        }
        $('.logo').css('fill', '#ffffff');
        return results;
      });
    }
  };
  window.colorText = {
    initializeColor: function() {
      // console.log('init');
      return $('.colorText').each(function() {
        var delay, i, len, length, path, paths, previousStrokeLength, results, speed;
        paths = $('path, circle, rect', this);
        delay = 0;
        results = [];
        for (i = 0, len = paths.length; i < len; i++) {
          path = paths[i];
          length = path.getTotalLength();
          previousStrokeLength = speed || 0;
          speed = length < 100 ? 20 : Math.floor(length);
          delay += previousStrokeLength + 100;
          results.push($(path).css('transition', 'none').attr('data-length', length).attr('data-speed', speed).attr('data-delay', delay).attr('stroke-dashoffset', length).attr('stroke-dasharray', length + ',' + length));
        }
        return results;
      });
    },
    animateColor: function() {
      console.log('animate colorText');
      return $('.colorText').each(function() {
        var delay, i, len, length, path, paths, results, speed;
        paths = $('path, circle, rect', this);
        results = [];
        for (i = 0, len = paths.length; i < len; i++) {
          path = paths[i];
          length = $(path).attr('data-length');
          speed = $(path).attr('data-speed');
          delay = $(path).attr('data-delay');
          results.push($(path).css('transition', 'stroke-dashoffset ' + speed + 'ms ' + delay + 'ms linear, ' + 'fill 0.6s ease-in').attr('stroke-dashoffset', '0'));
          console.log('filling');
        }
        // $('.logo').css('fill', '#ffffff');
        return results;
      });
    }
  };

  $(document).ready(function() {
    window.signature.initialize();
    window.colorText.initializeColor();
    var blur = document.getElementById("blur");
    var fadeBlur;

    function startFade() {
      fadeBlur = setInterval(function(){ fadeTimer() },  100);
      // $('.logo').addClass('filled');
    }
    function fadeTimer() {
      blur.setAttribute("stdDeviation", blur.getAttribute("stdDeviation") - .1);
      if (blur.getAttribute("stdDeviation") < .09) {
        blur.setAttribute("stdDeviation", 0);
        clearInterval(fadeBlur);
      }
    }
    $('.animation').addClass('active');
    startFade();
    
    $('button').on('click', function() {
      $('.animation').removeClass('active');
      blur.setAttribute("stdDeviation", 3);
      
      window.signature.initialize();
      return setTimeout(function() {
        $('.animation').addClass('active');
        startFade();
        return window.signature.animate();
      }, 500);
    });
  });

  $(window).load(function() {
    window.colorText.animateColor();
    return window.signature.animate();
  });

}).call(this);
