console.log('ASYNC_BAD - INIT_01 - New excution context created');

let nededAsyncConfig;

(async () => {
  console.log('ASYNC_BAD - INIT_02 - Init async function');
  const wait = (func, delay) => new Promise(resolve => setTimeout(() => resolve(func()), delay));
  const delay = 7;
  nededAsyncConfig = await wait(() => `Config achieved afer ${delay} segs`, delay * 1000);
  console.log('ASYNC_BAD - INIT_03 - After sync task, nededAsyncConfig value: ', nededAsyncConfig);
})();

module.exports.handler = async (event, context) => {
  console.log('ASYNC_BAD - HANDLER_01 - New invocation');
  console.log('ASYNC_BAD - HANDLER_02 - nededAsyncConfig value: ', nededAsyncConfig);
  return 'Lambda response';
}
