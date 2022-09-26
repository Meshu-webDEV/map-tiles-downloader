console.clear();

const axios = require('axios').default;
const Util = require('util');

const BASE_URL = ' https://c.basemaps.cartocdn.com/light_nolabels';

async function run() {
  try {
    const bounds = getBoundedTilesUrl({ z: { start: 12, end: 15 }, y: { start: 1750, end: 1755 }, x: { start: 2673, end: 2679 } });

    const ZOOM_LEVELS = Object.entries(bounds);

    for (let i = 0; i < ZOOM_LEVELS.length; i++) {
      console.log(ZOOM_LEVELS[i]);
      console.log(Util.inspect(ZOOM_LEVELS[i][1], false, 3, true));
    }

    // const { data } = await axios.get(' https://c.basemaps.cartocdn.com/light_nolabels/12/2677/1750.png', {
    //   responseType: 'arraybuffer',
    // });

    // console.log(data);
  } catch (error) {
    console.log(error);
  }
}

function getBoundedTilesUrl(range = { z: { start: 0, end: 0 }, y: { start: 0, end: 0 }, x: { start: 0, end: 0 } }) {
  const Z = new Array(range.z.end - range.z.start);
  const Y = new Array(range.y.end - range.y.start);
  const X = new Array(range.x.end - range.x.start);

  let result = {};

  let Z_SEGMENT = 0;
  let Y_SEGMENT = 0;
  let X_SEGMENT = 0;

  // Z
  for (let i = range.z.start; i <= range.z.end; i++) {
    Z_SEGMENT = i;
    result = { ...result, [Z_SEGMENT]: { null: [] } };
    // console.log('-- Z LEVEL');
    // console.log(Util.inspect(result, false, 3, true));
    // Y
    for (let j = range.y.start; j <= range.y.end; j++) {
      Y_SEGMENT = j;
      //   result = { ...result, [Z_SEGMENT]: [...result[Z_SEGMENT], { [Y_SEGMENT]: [null] }] };
      result = { ...result, [Z_SEGMENT]: { ...result[Z_SEGMENT], [Y_SEGMENT]: [] } };
      //   console.log('-- Y LEVEL');
      //   console.log(Util.inspect(result, false, 3, true));
      // X
      for (let k = range.x.start; k <= range.x.end; k++) {
        X_SEGMENT = k;
        result = { ...result, [Z_SEGMENT]: { ...result[Z_SEGMENT], [Y_SEGMENT]: [...result[Z_SEGMENT][Y_SEGMENT], X_SEGMENT] } };
        // console.log('-- X LEVEL');
        // console.log(Util.inspect(result, false, 3, true));
      }
    }
  }

  //   console.log(Util.inspect(result, false, 3, true));
  return result;
}

run();
