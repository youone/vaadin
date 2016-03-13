function triglib() {

	this.xy2latlong = function(xy) {
		return ol.proj.transform(xy, "EPSG:3857", "EPSG:4326");
	}
	this.latlong2xy = function(latlong) {
		return ol.proj.transform(latlong, "EPSG:4326", "EPSG:3857");
		//return ol.proj.transform(latlong, "EPSG:4326", "EPSG:900913");
	}

	this.crossProduct = function (x, y) {
		return [
		        x[1]*y[2] - x[2]*y[1],
		        x[2]*y[0] - x[0]*y[2],
		        x[0]*y[1] - x[1]*y[0] 
		        ];
	}

	this.vectorProduct = function (x, y) {
		return x[0]*y[0] + x[1]*y[1] + x[2]*y[2];
	}

	this.vectorNorm = function (x) {
		return Math.sqrt(this.vectorProduct(x, x));
	}

	this.vectorLinearCombination = function (cx, x, cy, y) {
		return [
		        cx*x[0] + cy*y[0],
		        cx*x[1] + cy*y[1],
		        cx*x[2] + cy*y[2] 
		        ];
	}

	this.geographic2cartesian = function (latitude, longitude) {
		theta = (90 - latitude) * Math.PI / 180;
		phi = longitude * Math.PI / 180;
		return [
		        Math.sin(theta) * Math.cos(phi),
		        Math.sin(theta) * Math.sin(phi),
		        Math.cos(theta) 
		        ];
	}

	this.cartesian2geographic = function (x) {
		x = this.normalizeVector(x);
		phi = Math.atan(x[1]/x[0]);
		if (x[0]<0) phi = Math.PI + phi;
		theta = Math.acos(x[2]);
//		console.log(x);
//		console.log(theta + " " + phi);
		latitude = 90 - (theta * 180 / Math.PI);
		longitude = phi * 180 / Math.PI;
		return [longitude, latitude];
	}

	this.angleBetweenVectors = function (x, y) {
		return Math.acos(this.vectorProduct(x, y) / (this.vectorNorm(x) * this.vectorNorm(y)));
	}

	this.normalizeVector = function (x) {
		var xNorm = this.vectorNorm(x);
		return [
		        x[0] / xNorm,
		        x[1] / xNorm,
		        x[2] / xNorm
		        ];
	}

//	this.deviationWeight = function (deviation, sigma) {
//	weight = 0.0;
//	// weight = exp(-deviation*deviation/(2*sigma*sigma));
//	if (abs(deviation) <= sigma)
//	weight = 1.0;
//	return weight;
//	}


	this.bearingPoints = function (site_latitude, site_longitude, bearing, length) {
		var EARTH_RADIUS = 6371;
		var phiMax = length/EARTH_RADIUS;
		var zenithVector = this.geographic2cartesian(site_latitude, site_longitude); // pointing up
		var bearingVector = this.bearingVector(site_latitude, site_longitude, bearing);
		var vector = this.vectorLinearCombination(Math.cos(phiMax), zenithVector, Math.sin(phiMax), bearingVector);
		return this.cartesian2geographic(vector);

//		result = [];
//		var nPoints = (phiMax * 180 / Math.PI)/2;
//		for (iphi=0; iphi<=nPoints; iphi++) {
//		phi = phiMax * iphi / nPoints;
//		var vector = this.vectorLinearCombination(Math.cos(phi), zenithVector, Math.sin(phi), bearingVector);
//		result.push(this.cartesian2geographic(vector));
//		}
//		return result;
	}

	this.bearingPlane = function (site_latitude, site_longitude, bearing) {
		local_coordinates_up_vector = this.geographic2cartesian(site_latitude, site_longitude); // pointing up
		local_coordinates_EW_vector = [
		                               - Math.sin(site_longitude * Math.PI / 180),
		                               Math.cos(site_longitude * Math.PI / 180),
		                               0.0 
		                               ]; // pointing east
		local_coordinates_NS_vector = this.crossProduct(local_coordinates_up_vector, local_coordinates_EW_vector); // pointing north

		bearing_vector = this.vectorLinearCombination(Math.sin(bearing * Math.PI / 180), local_coordinates_EW_vector, Math.cos(bearing * Math.PI / 180), local_coordinates_NS_vector);

		bearing_plane_normal_vector = this.crossProduct(local_coordinates_up_vector, bearing_vector);
		// normalize_vector(bearing_plane_normal_vector);
		return bearing_plane_normal_vector;
	}

//	calculates a vector pointing from the DF site along the bearing (expressed in geo-fixed coordinates)
	this.bearingVector = function (site_latitude, site_longitude, bearing) {

		// first define a cartesian coordinate system local to the DF site (expressed in the geo-fixed coordinates)
		// axis pointing straight up (same as the vector pointing to the site longitude and latitude)
		local_zenith_vector = this.geographic2cartesian(site_latitude, site_longitude);
		// axis pointing east
		local_EW_vector = [-Math.sin(site_longitude * Math.PI/180), Math.cos(site_longitude * Math.PI/180), 0.0];
		// axis pointing north
		local_NS_vector = this.crossProduct(local_zenith_vector, local_EW_vector);

		// calculate the vector pointing in the bearing direction (expressed in the geo-fixed coordinates)
		return this.vectorLinearCombination(Math.sin(bearing * Math.PI/180), local_EW_vector, Math.cos(bearing * Math.PI/180), local_NS_vector);
	}

////	calculates geographical distance between two locations
//	function geo_distance($site1_latitude, $site1_longitude, $site2_latitude, $site2_longitude) {
//	$EARTH_RADIUS = 6371;
//	return $EARTH_RADIUS * angle_between_vectors(geographic2cartesian($site1_latitude, $site1_longitude), geographic2cartesian($site2_latitude, $site2_longitude));
//	}

//	calculates the geographical distance between a location and a plane passing through the earth center
	this.geoPointToPlaneDistance = function (longitude, latitude, planeNormal) {
		var EARTH_RADIUS = 6371;
		// straight distance (through the earth)
		straight_distance = this.vectorProduct(this.geographic2cartesian(latitude, longitude), planeNormal);
		// geographical distance (on top of the earth surface)
		return EARTH_RADIUS * Math.asin(straight_distance);
	}

//	calculates the geographic distance between the bearing and the center of the AOI
	this.poiBearingDistance = function (site_latitude, site_longitude, bearing, poi_latitude, poi_longitude) {

		bearing_vector = this.bearingVector(site_latitude, site_longitude, bearing);
		site_zenith_vector = this.geographic2cartesian(site_latitude, site_longitude);
		bearing_plane_normal = this.crossProduct(site_zenith_vector, bearing_vector);
		bearing_plane_normal = this.normalizeVector(bearing_plane_normal);
		poi_vector = this.geographic2cartesian(poi_latitude, poi_longitude);

		//check that AOI is on the right side of the DF site
		closest_distance = -1.0;
		if (this.vectorProduct(bearing_vector, poi_vector) > 0)
			closest_distance = Math.abs(this.geoPointToPlaneDistance(poi_longitude, poi_latitude, bearing_plane_normal));

		return closest_distance;
	}

}
