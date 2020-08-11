console.log('SHARED_ENTRYPOINT_ASYNC_A - INIT_01 - New excution context created');

const wait = (func, delay) => new Promise(resolve => setTimeout(() => resolve(func()), delay));
const init = (async () => {
  console.log('SHARED_ENTRYPOINT_ASYNC_A - INIT_02 - Init async function');
  const delay = 8;
  const nededAsyncConfig = await wait(() => `Config getted afer ${delay} segs`, delay * 1000);
  console.log('SHARED_ENTRYPOINT_ASYNC_A - INIT_03 - After sync task, nededAsyncConfig value: ', nededAsyncConfig);
  return nededAsyncConfig;
})();

module.exports = async (event, context) => {
  console.log('SHARED_ENTRYPOINT_ASYNC_A - HANDLER_01 - New invocation');
  const nededAsyncConfig = await init;
  console.log('SHARED_ENTRYPOINT_ASYNC_A - HANDLER_02 - nededAsyncConfig value: ', nededAsyncConfig);
  return 'Lambda response';
}