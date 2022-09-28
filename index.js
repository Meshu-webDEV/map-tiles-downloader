console.clear();

const axios = require('axios').default;
const fse = require('fs-extra');

const BASE_URL = ' https://c.basemaps.cartocdn.com/light_nolabels';

async function run() {
  try {
    // const bounds = getBoundedTilesUrl({ z: { start: 12, end: 12 }, y: { start: 1750, end: 1755 }, x: { start: 2668, end: 2684 } });
    // const bounds = getBoundedTilesUrl({ z: { start: 13, end: 13 }, y: { start: 3500, end: 3510 }, x: { start: 5347, end: 5357 } });
    // const bounds = getBoundedTilesUrl({ z: { start: 14, end: 14 }, y: { start: 7001, end: 7021 }, x: { start: 10694, end: 10716 } });
    const bounds = getBoundedTilesUrl({ z: { start: 15, end: 15 }, y: { start: 14001, end: 14033 }, x: { start: 21388, end: 21430 } });

    const ZOOM_LEVELS = Object.entries(bounds);

    for (let i = 0; i < ZOOM_LEVELS.length; i++) {
      const ZOOM = ZOOM_LEVELS[i][0];
      const BOUNDS = ZOOM_LEVELS[i][1];
      let BOUNDS_LENGTH = Object.keys(BOUNDS).filter((b) => b !== 'empty').length;

      for (let j = 0; j < BOUNDS_LENGTH; j++) {
        const Y_AXES = Object.keys(BOUNDS)[j];
        let X_AXES_ARRAY = Object.values(BOUNDS)[j];

        for (let k = 0; k < X_AXES_ARRAY.length; k++) {
          const X_AXES = X_AXES_ARRAY[k];
          const TILE_URL = `${BASE_URL}/${ZOOM}/${X_AXES}/${Y_AXES}.png`;

          const { data } = await axios.get(TILE_URL, {
            responseType: 'arraybuffer',
          });

          await fse.outputFile(`./tiles/${ZOOM}/${X_AXES}/${Y_AXES}.png`, data, { encoding: 'buffer' });
        }
      }
    }
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
    result = { ...result, [Z_SEGMENT]: { empty: [] } };
    // Y
    for (let j = range.y.start; j <= range.y.end; j++) {
      Y_SEGMENT = j;
      result = { ...result, [Z_SEGMENT]: { ...result[Z_SEGMENT], [Y_SEGMENT]: [] } };
      // X
      for (let k = range.x.start; k <= range.x.end; k++) {
        X_SEGMENT = k;
        result = { ...result, [Z_SEGMENT]: { ...result[Z_SEGMENT], [Y_SEGMENT]: [...result[Z_SEGMENT][Y_SEGMENT], X_SEGMENT] } };
      }
    }
  }
  return result;
}

run();
