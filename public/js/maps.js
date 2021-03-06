/*global Microsoft: false*/
/*global google: false*/
/*global nokia: false*/
/*global trailMaps: false*/

requirejs.config({
  baseUrl: "/js",
  paths: {
    "jquery" : "https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min",
    "bootstrap": "http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min",
    "typeahead": "http://twitter.github.io/typeahead.js/releases/0.10.2/typeahead.bundle.min",
    "async": "lib/async",
    "markerwithlabel": "lib/markerwithlabel_packed",
    "here_maps_api": "http://api.maps.nokia.com/2.2.4/jsl.js?with=maps",
    "knockout": "http://cdnjs.cloudflare.com/ajax/libs/knockout/3.1.0/knockout-min",
    "q": "lib/q"
  },
  shim: {
    "bootstrap": {
      deps: ["jquery"],
      exports: "$.fn.popover"
    },
    "knockout": {
      deps: ['jquery']
    },
    "typeahead": {
      deps: ['jquery']
    },
    "bing_maps_api": {
      exports: "Microsoft"
    },
    "here_maps_api": {
      exports: "nokia"
    },
    "markerwithlabel": {
      deps: ["google_maps_api"]
    },
  },
  // This may be important for IE: http://requirejs.org/docs/api.html#ieloadfail
  //enforceDefine: true,
});

define('bing_maps_api', ['async!http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0!onscriptload'], function() {
  return Microsoft;
});

define('google_maps_api', ['async!http://maps.google.com/maps/api/js?v=3&sensor=false'], function() {
  return google;
});

define('history', function() {
  return window.history;
});

require(['jquery', 'knockout', 'bootstrap', 'typeahead', './trailmaps', './mapcontainer', './navbarModel'], function($, ko, bootstrap, typeAhead, trailMaps, mapContainer, NavbarModel) {
  mapContainer.initialize(require, trailMaps.configuration.defaultMapName)
  .done();
  ko.applyBindings(mapContainer, $('#mapCanvas').get(0));

  var navbarModel = new NavbarModel();
  ko.applyBindings(navbarModel, $('.navbar').get(0));

  // TODO: Not sure this is the best place to wire this up but I don't see any better options at the moment
  $('#searchBox').typeahead({
    hint: true,
    highlight: true,
    minLength: 3
  },
  {
    name: 'waypoints',
    source: navbarModel.waypointTypeaheadSource,
    displayKey: function(value) {
      return value;
    }
  })
  .bind("typeahead:selected", navbarModel.search)
  .keydown(function(event) {
    if (event.keyCode ===13) {
      navbarModel.search();
    }
  });

  navbarModel.initializeBrowserHistory();
  window.onpopstate = function(event) {
    navbarModel.restoreHistoryState(event.state);
  };
});
