/*global google: false*/

function GoogleMapControl() {
    var me = this;

    // TODO: the visual display of the track starts to break up as we scroll the view, before
    // we load a new track. Seems to be a Bing problem.  Maybe we should load a smaller track bounds?
    
    this.googleMap = null;
    this.previousPolyLine = null;
    this.waypointCollection = [];
    

    this.initialize = function (latitude, longitude, zoomLevel, onViewChanged) {
        // https://developers.google.com/maps/documentation/javascript/
        var mapOptions = {
          center: new google.maps.LatLng(latitude, longitude),
          zoom: zoomLevel,
          mapTypeId: google.maps.MapTypeId.HYBRID
        };
        me.googleMap = new google.maps.Map(document.getElementById("google-maps"), mapOptions);

        google.maps.event.addListener(me.googleMap, 'idle', onViewChanged);
    };

    this.displayTrack = function(data) {
        var vertices = [];
        $.each(data.track, function (i, point) {
            vertices.push(new google.maps.LatLng(point.loc[1], point.loc[0]));
        });

        var polyLine = new google.maps.Polyline({
            path: vertices,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 3
        });

        // First add new track, then remove old track
        polyLine.setMap(me.googleMap);
        if (me.previousPolyLine) {
            me.previousPolyLine.setMap(null);
        }
        me.previousPolyLine = polyLine;
    };

    this.displayWaypoints = function (data) {
        me.waypointCollection.forEach(function(marker) {
            marker.setMap(null);
        });
        me.waypointCollection.length = 0;

        var icon = {
            url: '/images/mile_marker.png',
            anchor: new google.maps.Point(12, 12)
        };

        $.each(data.waypoints, function (i, waypoint) {
            var location = new google.maps.LatLng(waypoint.loc[1], waypoint.loc[0]);
            var options = {
               position: location,
               draggable: false,
               raiseOnDrag: false,
               map: me.googleMap,
               labelContent: waypoint.mile.toString(),
               labelAnchor: new google.maps.Point(-13, 10),
               labelClass: "waypoint_text", // the CSS class for the label
               icon: icon
            };
            var newWaypoint = new MarkerWithLabel(options);
            me.waypointCollection.push(newWaypoint);
        });
    };

    this.getCenter = function() {
        var center = me.googleMap.getCenter();
        return new Location(center.lat(), center.lng());
    };

    this.getBounds = function() {
        var bounds = me.googleMap.getBounds();
        var center = bounds.getCenter();
        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();
        return new Rectangle(new Location(center.lat(), center.lng()), ne.lng() - sw.lng(), ne.lat() - sw.lat());
    };

    this.getZoom = function() {
        return me.googleMap.getZoom();
    };

    this.getCenterAndZoom = function(options) {
        var mapCenter = me.googleMap.getCenter();
        return {
          center: {
              latitude: mapCenter.lat(),
              longitude: mapCenter.lng()
            },
            zoom: me.googleMap.getZoom()
        };
    };

    this.setCenterAndZoom = function(options) {
        var mapCenter = new google.maps.LatLng(options.center.latitude, options.center.longitude);
        me.googleMap.setCenter(mapCenter);
        me.googleMap.setZoom(options.zoom);
    };
}

