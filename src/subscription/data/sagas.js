import {
  takeEvery,
} from 'redux-saga/effects';

// client-secret
import { fetchClientSecret } from './client-secret/actions';
import { handleFetchClientSecret } from './client-secret/sagas';
// basket
import { fetchBasket, submitPayment } from './subscription/actions';
import { handleFetchBasket, handleSubmitPayment } from './subscription/sagas';

export default function* saga() {
  yield takeEvery(fetchClientSecret.TRIGGER, handleFetchClientSecret);
  yield takeEvery(fetchBasket.TRIGGER, handleFetchBasket);
  yield takeEvery(submitPayment.TRIGGER, handleSubmitPayment);
}
