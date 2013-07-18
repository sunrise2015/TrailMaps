/*global define: false*/
/*global trailMaps: false*/

define(['jquery', 'knockout', 'q', 'waypointViewModel'], function($, ko, Q, WaypointViewModel) {
  return function() {
    var self = this;

    self.loadData = function() {
      var deferred = Q.defer();

      var url = "/api/trails/pct/waypoints";
      $.getJSON(url, function(data) {
        self.waypoints = ko.observableArray();

        data.forEach(function(element) {
          var waypoint = new WaypointViewModel();
          waypoint.fromJS(element);
          self.waypoints.push(waypoint);
        });

        deferred.resolve();
      });

      return deferred.promise;
    };

    self.deleteWaypoint = function(waypoint) {
      waypoint.delete()
      .done(function(success) {
        if (success) {
          self.waypoints.remove(waypoint);
        } else {
          alert('Error deleting waypoint.');
        }
      });
    };

    self.activeWaypoint = null;

    self.edit = function(waypoint) {
      if (self.activeWaypoint)
      {
        self.activeWaypoint.cancelEdit();
      }

      self.activeWaypoint = waypoint;
      waypoint.edit();
    };

    self.confirmEdit = function(waypoint) {
      self.activeWaypoint = null;
      waypoint.confirmEdit();
    };

    self.cancelEdit = function(waypoint) {
      waypoint.cancelEdit();
      self.activeWaypoint = null;
    };

    self.templateName = function(waypoint) {
      return waypoint.isEditing() ? "edit-template" : "waypoint-template";
    };
  };
});
