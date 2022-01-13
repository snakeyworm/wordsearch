
// 2-dimensional point
class Point {
    
    constructor( x, y ) {

        this.x = x
        this.y = y

    }

}

// Checks if point q lies on line pr
function onSegment( p, q, r ) {
        
    if ( q.x <= Math.max( p.x, r.x ) && q.x >= Math.min( p.x, r.x ) &&
         q.y <= Math.max( p.y, r.y ) && q.y >= Math.min( p.y, r.y ) ) {
        return true
    }

    return false

}

// Check orientation of ordered triplet ( p, q, r )
// 0 => collinear
// 1 => clockwise
// 2 => counterclockwise
function getOrientation( p, q, r ) {

    let value = ( q.y - p.y ) * ( r.x - q.x ) -
            (q.x - p.x ) * ( r.y - q.y )

    if ( value == 0 ) return 0;

    return ( value > 0 ) ? 1 : 2
    
}

// Checks if p1q1 intersects with p2q2
function doIntersect( p1, q1, p2, q2 ) {

    // Get orientations
    let o1 = getOrientation( p1, q1, p2 )
    let o2 = getOrientation( p1, q1, q2 )
    let o3 = getOrientation( p2, q2, p1 )
    let o4 = getOrientation( p2, q2, q1 )

    // General cases
    if ( o1 !== o2 && o3 !== o4 ) return true

    // Special cases
    if ( o1 == 0 && onSegment( p1, p2, q1) ) return true

    if ( o2 == 0 && onSegment( p1, p2, q1 ) ) return true

    if ( o3 == 0 && onSegment( p2, p1, q2 ) ) return true

    if ( o4 == 0 && onSegment( p2, q1, q2 ) ) return true

    return false

}
