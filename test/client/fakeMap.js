define(['trailmaps'], function(trailmaps) {
  function FakeMap() {
    var self = this;
    self.viewChangedHandler = undefined;
    self.center = undefined;
    self.zoom = undefined;
    self.trackData = undefined;
    self.mileMarkerData = undefined;

    self.initialize = function(center, zoomLevel, onViewChanged, callback) {
      self.center = center;
      self.zoom = zoomLevel;
      self.viewChangedHandler = onViewChanged;
      callback();
    };

    self.displayTrack = function(track) {
      self.trackData = track;
    };

    self.displayMileMarkers = function(mileMarkers) {
      self.mileMarkerData = mileMarkers;
    };

    self.getCenter = function() {
      return self.center;
    };

    self.getBounds = function() {
      return new trailmaps.Rectangle(self.center, 100 / self.zoom, 100 / self.zoom);
    };

    self.getZoom = function() {
      return self.zoom;
    };

    self.getCenterAndZoom = function() {
      return {
        center: self.center,
        zoom: self.zoom
      };
    };

    self.setCenterAndZoom = function(options) {
      self.center = options.center;
      self.zoom = options.zoom;
    };
  }

  return FakeMap;
});
