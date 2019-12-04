export const convertData = (data: any, geoCoordMap: any) => {
  var res = [];
  for (var i = 0; i < data.length; i++) {
    var geoCoord = geoCoordMap[data[i].name];
    if (geoCoord) {
      res.push(geoCoord.concat(data[i].value));
    }
  }
  return res;
};