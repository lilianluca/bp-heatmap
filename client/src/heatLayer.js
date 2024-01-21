const setupHeatLayer = (map, heatData, radius) => {
  const heat = L.heatLayer(heatData, { radius: radius }).addTo(map);
};

export default setupHeatLayer;
