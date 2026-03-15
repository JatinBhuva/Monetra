import { all, fork } from 'redux-saga/effects';

import { categoriesSaga } from './categoriesSaga';
import { maintenanceSaga } from './maintenanceSaga';
import { transactionsSaga } from './transactionsSaga';

export function* rootSaga() {
  yield all([fork(transactionsSaga), fork(categoriesSaga), fork(maintenanceSaga)]);
}
