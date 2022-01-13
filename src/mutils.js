function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = function Point(x, y) {
    _classCallCheck(this, Point);

    this.x = x;
    this.y = y;
};

function onSegment(p, q, r) {

    if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) {
        return true;
    }

    return false;
}

// Check orientation of ordered triplet ( p, q, r )
// 0 => collinear
// 1 => clockwise
// 2 => counterclockwise
function orientation(p, q, r) {

    var value = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

    if (value == 0) return 0;

    return value > 0 ? 1 : 2;
}

function doIntersection(p1, q1, p2, q2) {

    var o1 = orientation(p1, q1, p2);
}