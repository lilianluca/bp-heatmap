import setupHeatLayer from './heatLayer';

const setupMap = () => {
  const map = L.map('map').setView([50.77242005174584, 15.072913082867514], 17);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const heatData = [];
  const matchedData = fetchData(
    '/api/coordinates/matched'
  ).then((data) => {
    const { waypoints } = data.features[0].properties;
    waypoints.forEach((waypoint) => {
      const { location } = waypoint;

      //temporary setting intensity
      const lon = location[0];
      const lat = location[1];
      const intensity = 1.5;
      heatData.push([lat, lon, intensity]);
    });
  });

  if (heatData) {
    console.log(heatData);
    setupHeatLayer(map, heatData, 10);
  }

  // Original data
  // const originalData = fetchData("http://localhost:3000/api/coordinates").then(
  //   (data) => {
  //     data.forEach((coords) => {
  //       L.marker([coords.lat, coords.lon]).addTo(map);
  //     });
  //   }
  // );
};

const fetchData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export default setupMap;
