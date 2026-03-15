import { all, fork } from 'redux-saga/effects';

import { categoriesSaga } from './categoriesSaga';
import { maintenanceSaga } from './maintenanceSaga';
import { transactionsSaga } from './transactionsSaga';
import { analyticsSaga } from './analyticsSaga';

export function* rootSaga() {
  yield all([
    fork(transactionsSaga),
    fork(analyticsSaga),
    fork(categoriesSaga),
    fork(maintenanceSaga),
  ]);
}
