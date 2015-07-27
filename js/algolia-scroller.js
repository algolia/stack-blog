---
layout: null
---
// Scroll page to the relevant <p> from the search
(function() {
  window.AlgoliaScroller = {
    scrollPageToSelector: function scrollPageToSelector(selector) {
      var target = $('#main').find(selector);
      var targetOffset = target[0].getBoundingClientRect().top + window.pageYOffset - 20;
      window.setTimeout(function() {
        window.scroll(0, targetOffset);
      }, 100);
    },
    getAnchorSelector: function getAnchorSelector(hash) {
      var anchor = hash.substring(1);
      if (!anchor.match(/^algolia:/)) {
        return false;
      }
      return decodeURI(anchor.replace(/^algolia:/, ''));
    }
  }

  window.setTimeout(function() {
    var selector = AlgoliaScroller.getAnchorSelector(window.location.hash);
    if (selector) {
      AlgoliaScroller.scrollPageToSelector(selector);
    }
  }, 100);
})();

