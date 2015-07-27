// Init the search box
$(function(config) {
  'use strict';

  var applicationId = config.applicationId;
  var apiKey = config.apiKey;
  var indexName = config.indexName;

  var algolia = algoliasearch(applicationId, apiKey);
  var helper = algoliasearchHelper(algolia, indexName);
  helper.setQueryParameter('distinct', true);
  helper.on('result', onResult);

  // Input listening for queries
  var $searchInput = $('.js-algolia__input');
  $searchInput.on('keyup', onQueryChange);

  // Content to hide/show when searching
  var $initialContent = $('.js-algolia__initial-content');
  var $searchContent = $('.js-algolia__search-content');
  $searchContent.on('click', 'a', onLinkClick);
  // Rendering templates
  var templateResult = Hogan.compile($('#algolia__template').html());
  var templateNoResults = $('#algolia__template--no-results').html();

  var lastQuery;

  // Toggle result page
  function showResults() {
    window.scroll(0, 0);
    $initialContent.addClass('algolia__initial-content--hidden');
    $searchContent.addClass('algolia__search-content--active');

  }
  function hideResults() {
    $initialContent.removeClass('algolia__initial-content--hidden');
    $searchContent.removeClass('algolia__search-content--active');
  }

  // Handle typing query
  function onQueryChange() {
    lastQuery = $searchInput.val();
    if (lastQuery.length === 0) {
      hideResults();
      return false;
    }
    helper.setQuery(lastQuery).search();
  }

  function onResult(data) {
    // Avoid race conditions, discard results that do not match the latest query
    if (data.query !== lastQuery) {
      return false;
    }
    showResults();
    var content = data.nbHits ? renderResults(data) : templateNoResults;
    $searchContent.html(content);
  }

  function renderResults(data) {
    return $.map(data.hits, function(hit) {
      if (hit.posted_at) {
        hit.posted_at_readable = moment.unix(hit.posted_at).format('MMMM DD, YYYY');
      }
      // Build full url with anchor
      hit.full_url = [
        config.baseurl,
        hit.url,
        '#algolia:',
        encodeURI(hit.css_selector)
      ].join('');

      if (hit.tags) {
        hit.tags_readable = hit.tags.join(', ');
      }

      return templateResult.render(hit);
    }).join('');
  }

  function onLinkClick(event) {
    var selector = window.AgoliaScroller.getAnchorSelector(event.target.hash);
    // Normal link, going to another page
    if (event.target.pathname !== window.location.pathname || !selector) {
      return true;
    }
    // Scrolling to a result on the same page
    hideResults();
    window.AlgoliaScroller.scrollPageToSelector(selector);
    event.preventDefault();
    return false;
  }
}(window.ALGOLIA_CONFIG));
