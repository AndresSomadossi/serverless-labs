console.log('SYNC_INIT - INIT_01 - New excution context created');

const init = (() => {
  console.log('SYNC_INIT - INIT_02 - Init sync function');
  let nededSyncConfig;
  const delay = 7;
  const initTime = Date.now();
  while (true) {
    if (Date.now() - initTime > (delay * 1000)) {
      nededSyncConfig = `Config achieved afer ${delay} segs`;
      break;
    }
  }
  console.log('SYNC_INIT - INIT_03 - After sync task, nededSyncConfig value: ', nededSyncConfig);
  return nededSyncConfig;
})();

module.exports.handler = async () => {
  console.log('SYNC_INIT - HANDLER_01 - New invocation');
  const nededSyncConfig = init;
  console.log('SYNC_INIT - HANDLER_02 - nededSyncConfig value: ', nededSyncConfig);
  return 'Lambda response';
}