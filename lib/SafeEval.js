const vm = require('vm');
const util = require('util');

const resultKey = '__EVAL_RESULT__';

module.exports = (code, timeout = 1000) => {
  try {
    code = `${resultKey}=${code}`;
    const context = { [resultKey]: undefined };
    vm.runInNewContext(code, context, { timeout });
    return util.inspect(context[resultKey]);
  } catch (e) {
    return e.toString();
  }
};
