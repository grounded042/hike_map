import { userInfo } from "os";


// Given a list of longitude coordinates, this function finds the most logical
// western and eastern most coordinates in that list.
function getWestAndEastCoords(longitude) {
  longitude.sort();
	var lowest = longitude[0];
  var highest = longitude[longitude.length-1];

  if (highest - lowest > 180) {
  	return {
    	west: highest,
      east: lowest
    };
  }

  return {
    west: lowest,
    east: highest
  };
}

// Given a list of coordinates, this function finds the most logical northern,
// southern, eastern, and western most coordinates in that list.
export function getFarthestBoundaryCoords(coords) {
  var lat = [];
  var lon = [];

  coords.forEach(coord => {
    lon.push(coord[0]);
    lat.push(coord[1]);
  });

  west_and_east = getWestAndEastCoords(lon);

  lat.sort();

  return Object.assign({
    north: lat[lat.length-1],
    south: lat[0],
  }, west_and_east);
}

export function trimDownPoints(points) {
  // trim down the points
  var trackingPointsInADay = 144;
  var useEveryXTrackingPoint = Math.round(points.length / 144);

  var i = useEveryXTrackingPoint;
  return points.filter((value) => {
    if (i === useEveryXTrackingPoint) {
      i = 0;
      return true;
    }
    i++;
    return false;
  });
}
