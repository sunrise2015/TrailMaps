/*global define: false*/

define(['jquery', './mapcontrol', 'bootstrap'], function($, mapControl) {
  $(function () {
    $('#searchForm').submit(function() {
        var url = "/api/trails/pct/milemarkers/" + $('#searchBox').val();
        $.getJSON(url, function(result) {
            mapControl.setCenterAndZoom({
              center: {
                latitude: result.loc[1],
                longitude: result.loc[0]
              },
              zoom: 16
            });
        });
        return false;
    });

    // TODO: this ought to be a custom 'shown' event raised by Bootstrap but it
    // doesn't seem to be fired for pills.  Bug?
    $('a[data-toggle="pill"]').on('click', function (e) {
      // This is a nasty hack caused by the fact that Google maps has a bug
      // where it gets messed up if it's initialized on a hidden div, so we
      // have to force the tab to be shown first before we might cause it to
      // be initialized.  However, when we show it like this, it never hides
      // again in response to pill clicks, so we have to hide all tab panes
      // manually.  Hopefully this can be make cleaner somehow.
      $(e.target.hash).addClass('in.active');
      $('.tab-pane.fade.in.active').removeClass('in.active');

      mapControl.showingMap(e.target.hash);
    });
  });
});
