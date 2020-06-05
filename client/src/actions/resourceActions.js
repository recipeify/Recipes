import { getResources } from '../service/apiRequests';

export const FETCH_RESOURCES_PENDING = 'FETCH_RESOURCES_PENDING';
export const FETCH_RESOURCES_SUCCESS = 'FETCH_RESOURCES_SUCCESS';
export const FETCH_RESOURCES_FAILURE = 'FETCH_RESOURCES_FAILURE';

export const fetchResourcesPending = () => ({
  type: FETCH_RESOURCES_PENDING,
});

export const fetchResourcesSuccess = (resources) => ({
  type: FETCH_RESOURCES_SUCCESS,
  payload: { ...resources },
});

export const fetchResourcesFailure = (error) => ({
  type: FETCH_RESOURCES_FAILURE,
  payload: { error },
});

export function fetchResources() {
  return async (dispatch) => {
    try {
      dispatch(fetchResourcesPending());
      const response = await getResources();
      dispatch(fetchResourcesSuccess(response.items));
      return response.items;
    } catch (error) {
      return dispatch(fetchResourcesFailure(error));
    }
  };
}

export default { fetchResources };
