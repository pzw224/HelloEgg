NEG.Module('NEG.Widget.RollOverMenu', function (require) {
    var mouseTrace = require('NEG.Utility.MouseTrend'),
        $ = require('Utility.JQuery');

    var menu = function (menu, option) {
        var me = arguments.callee;
        if (!(this instanceof me)) {
            return new me(menu, option);
        }

        //open mouse trace on document.
        mouseTrace.on();

        var $menu = $(menu),
	        timeoutId = null,
	        activeRow = null,
	        lastDelayLoc = null,
	        mouseLocs = mouseTrace.mouseLocs,
	        _option = NEG.merge({
	            rowSelector: "> li",
	            submenuSelector: "*",
	            tolerance: 75,
	            enter: null,
	            exit: null,
	            activate: null,
	            deactivete: null,
	            exitMenu: null,
	            delay: 300
	        }, option);


        var mouseleaveMenu = function () {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            if (activeRow) {
                _option.deactivate(activeRow);
            };
            activeRow = null;
        };

        var mouseenterRow = function () {
            if (timeoutId) {
                // Cancel any previous activation delays
                clearTimeout(timeoutId);
            }

            _option.enter && _option.enter(this);
            possiblyActivate(this);
        };

        var mouseleaveRow = function () {
            _option.exit && _option.exit(this);
        };

        var activate = function (row) {
            if (row == activeRow) {
                return;
            }

            if (activeRow) {
                _option.deactivate(activeRow);
            }

            _option.activate(row);
            activeRow = row;
        };

        var possiblyActivate = function (row) {
            var delay = activationDelay();


            if (delay) {
                timeoutId = setTimeout(function () {
                    possiblyActivate(row);
                }, delay);
            } else {
                activate(row);
            }
        };

        var activationDelay = function () {
            //if (!activeRow || !$(activeRow).is(_option.submenuSelector)) {
            //    // If there is no other submenu row already active, then
            //    // go ahead and activate immediately.
            //    return 0;
            //}
            if (!activeRow) {
                return 0;
            };


            var offset = $menu.offset(),
                upperLeft = {
                    x: offset.left,
                    y: offset.top - _option.tolerance
                },
                upperRight = {
                    x: offset.left + $menu.outerWidth(),
                    y: upperLeft.y
                },
                lowerLeft = {
                    x: offset.left,
                    y: offset.top + $menu.outerHeight() + _option.tolerance
                },
                lowerRight = {
                    x: offset.left + $menu.outerWidth(),
                    y: lowerLeft.y
                },
                loc = mouseLocs[mouseLocs.length - 1],
                prevLoc = mouseLocs[0];

            if (!loc) {
                return 0;
            }

            if (!prevLoc) {
                prevLoc = loc;
            }

            if (prevLoc.x < offset.left || prevLoc.x > lowerRight.x ||
                prevLoc.y < offset.top || prevLoc.y > lowerRight.y) {
                // If the previous mouse location was outside of the entire
                // menu's bounds, immediately activate.
                return 0;
            }

            if (lastDelayLoc &&
                    loc.x == lastDelayLoc.x && loc.y == lastDelayLoc.y) {
                // If the mouse hasn't moved since the last time we checked
                // for activation status, immediately activate.
                return 0;
            }

            function slope(a, b) {
                return (b.y - a.y) / (b.x - a.x);
            };

            var decreasingCorner = upperRight,
                increasingCorner = lowerRight;

            var decreasingSlope = slope(loc, decreasingCorner),
                increasingSlope = slope(loc, increasingCorner),
                prevDecreasingSlope = slope(prevLoc, decreasingCorner),
                prevIncreasingSlope = slope(prevLoc, increasingCorner);

            if (decreasingSlope < prevDecreasingSlope &&
                    increasingSlope > prevIncreasingSlope) {
                // Mouse is moving from previous location towards the
                // currently activated submenu. Delay before activating a
                // new menu row, because user may be moving into submenu.
                lastDelayLoc = loc;
                return _option.delay;
            }

            lastDelayLoc = null;
            return 0;
        };

        $menu
            .mouseleave(mouseleaveMenu)
            .find(_option.rowSelector)
                .mouseenter(mouseenterRow)
                .mouseleave(mouseleaveRow);

        return 1;
    }

    return menu;

});

