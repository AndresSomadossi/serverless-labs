console.log('ASYNC_INIT - INIT_01 - New excution context created');

const wait = (func, delay) => new Promise(resolve => setTimeout(() => resolve(func()), delay));
const init = (async () => {
  console.log('ASYNC_INIT - INIT_02 - Init async function');
  const delay = 8;
  const nededAsyncConfig = await wait(() => `Config getted afer ${delay} segs`, delay * 1000);
  console.log('ASYNC_INIT - INIT_03 - After sync task, nededAsyncConfig value: ', nededAsyncConfig);
  return nededAsyncConfig;
})();

module.exports.handler = async (event, context) => {
  console.log('ASYNC_INIT - HANDLER_01 - New invocation');
  const nededAsyncConfig = await init;
  console.log('ASYNC_INIT - HANDLER_02 - nededAsyncConfig value: ', nededAsyncConfig);
  return 'Lambda response';
}