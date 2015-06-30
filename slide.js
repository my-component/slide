/**
 * dependencies:
 * 	 jquery
 *
 *
 *
 */

(function(global, factory) {
  if (typeof define == "function" && define.amd) {
    define('slide', [jquery], function($) {
      return factory($);
    })
  } else {
    window.Slide = factory(jQuery);
  }
})(typeof window !== "undefined" ? window : this, function($) {
  function Slide(elem, option) {
    if (!this instanceof Slide) {
      return new Slide(elem, option);
    }
    this.$container = $(elem);
    this.current;
    this.interval;
    this.option = $.extend({
      interval: 3000,
      'animation-duration': 500
    }, option);
    this.init();
  }

  $.extend(Slide.prototype, {
    init: function() {
      this.$container.addClass('slides-container');
      this.$slides = this.$container.find('.slides li');
      this.len = this.$slides.length;
      this.$slides.css('animation-duration', this.option['animation-duration'] + 'ms');
      this.insertPointer();
      this.eventBind();
      this.toSlide(0);
      this.start();
    },
    insertPointer: function() {
      var html = '<ul class="pointers">';
      var len = this.len;
      for (var i = 0; i < len; i++) {
        html += '<li class="pointer" data-index="' + i + '"></li>'
      }
      html += '</ul>';
      this.$pointers = $(html).appendTo(this.$container);
      this.$pointerList = this.$pointers.find('li');
    },
    start: function() {
      this.stop();
      this.interval = setInterval($.proxy(this.next, this), this.option.interval);
    },
    stop: function() {
      this.interval && clearInterval(this.interval);
    },
    next: function() {
      var nextIndex = this.current + 1 > this.len - 1 ? 0 : this.current + 1;
      this.toSlide(nextIndex);
      this.toPointer(nextIndex);
    },
    toSlide: function(index) {
      if (index == this.current) {
        return;
      }
      var $cur = this.current !== undefined ? this.$slides.eq(this.current) : null;
      var $next = this.$slides.eq(index);
      $cur && $cur.removeClass('active');
      $next.addClass('active');
      this.slideAnimate($cur, $next);
      this.current = index;
    },
    toPointer: function(index) {
      this.$pointerList.removeClass('active');
      this.$pointerList.eq(index).addClass('active');
    },
    slideAnimate: function($cur, $next) {
      $cur && $cur.addClass('fade-out');
      $next.addClass('fade-in');
      setTimeout(function() {
        $cur && $cur.removeClass('fade-out');
        $next.removeClass('fade-in');
      }, this.option['animation-duration']);
    },
    eventBind: function() {
      var self = this;
      self.$container.on('mouseover', $.proxy(self.stop, self));
      self.$container.on('mouseout', $.proxy(self.start, self))
      self.$pointers.on('click.slide.pointer', '.pointer', function() {
        self.toSlide.call(self, $(this).data('index'))
      });
    }
  });

  return Slide;
});
