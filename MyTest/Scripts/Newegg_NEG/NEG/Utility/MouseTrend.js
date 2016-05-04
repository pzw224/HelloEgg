NEG.Module("NEG.Utility.MouseTrend", function (require) {
    var MOUSE_LOCS_TRACKED = 3;
    var mouseLocs = [];

    var mousemoveDocument = function (e) {
        mouseLocs.push({ x: e.pageX, y: e.pageY });
        if (mouseLocs.length > MOUSE_LOCS_TRACKED) {
            mouseLocs.shift();
        }
    };

    var api = {
        on: function () {
            if (mouseLocs == null || mouseLocs.length == 0) {
                NEG(document).on("mousemove", mousemoveDocument);
            }
        },
        off: function () {
            NEG(document).off("mousemove", mousemoveDocument);
            mouseLocs = []
        },
        mouseLocs: mouseLocs
    };

    return api;
});
