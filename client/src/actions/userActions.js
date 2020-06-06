import { sendView } from '../service/apiRequests';

export const userActions = {
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  REPORT_VIEW_PENDING: 'REPORT_VIEW_PENDING',
  REPORT_VIEW_SUCCESS: 'REPORT_VIEW_SUCCESS',
  REPORT_VIEW_FAILURE: 'REPORT_VIEW_FAILURE',
};

const userLogin = (data) => ({
  type: userActions.USER_LOGIN,
  payload: { ...data },
});

const userLogout = () => ({
  type: userActions.USER_LOGOUT,
});

const reportViewPending = () => ({
  type: userActions.REPORT_VIEW_PENDING,
});

const reportViewSuccess = () => ({
  type: userActions.REPORT_VIEW_SUCCESS,
});

const reportViewFailure = (error) => ({
  type: userActions.REPORT_VIEW_FAILURE,
  payload: { error },
});

function reportView(recipeID, token) {
  return async (dispatch) => {
    try {
      dispatch(reportViewPending());
      await sendView(recipeID, token);
      return dispatch(reportViewSuccess());
    } catch (error) {
      return dispatch(reportViewFailure(error));
    }
  };
}

export {
  userLogin,
  userLogout,
  reportView,
};
