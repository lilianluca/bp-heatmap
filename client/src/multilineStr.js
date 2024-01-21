const setupMultilineString = (map, latlngs) => {
  var polyline = L.polyline(latlngs, { color: "red" }).addTo(map);
};

export default setupMultilineString;
