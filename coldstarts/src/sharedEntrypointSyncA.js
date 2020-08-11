console.log('SHARED_ENTRYPOINT_A - INIT_01 - New excution context created');

let nededSyncConfig;

const init = () => {
  console.log('SHARED_ENTRYPOINT_A - INIT_02 - Init sync function');
  const delay = 8;
  const initTime = Date.now();
  while (true) {
    if (Date.now() - initTime > (delay * 1000)) {
      nededSyncConfig = `Config achieved afer ${delay} segs`;
      break;
    }
  }
  console.log('SHARED_ENTRYPOINT_A - INIT_03 - After sync task, nededSyncConfig value: ', nededSyncConfig);
};

init();

module.exports = async () => {
  console.log('SHARED_ENTRYPOINT_A - HANDLER_01 - New invocation');
  console.log('SHARED_ENTRYPOINT_A - HANDLER_02 - nededSyncConfig value: ', nededSyncConfig);
  return 'Lambda response';
}