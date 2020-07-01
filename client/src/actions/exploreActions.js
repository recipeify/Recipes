import { getExplorePage } from '../service/apiRequests';

export const exploreActions = {
  FETCH_EXPLORE_PENDING: 'FETCH_EXPLORE_PENDING',
  FETCH_EXPLORE_SUCCESS: 'FETCH_EXPLORE_SUCCESS',
  FETCH_EXPLORE_FAILURE: 'FETCH_EXPLORE_FAILURE',
  CLEAR_EXPLORE: 'CLEAR_EXPLORE',
};

export const clearExplore = () => ({
  type: exploreActions.CLEAR_EXPLORE,
});

export const fetchExplorePending = () => ({
  type: exploreActions.FETCH_EXPLORE_PENDING,
});

export const fetchExploreSuccess = (explore) => ({
  type: exploreActions.FETCH_EXPLORE_SUCCESS,
  payload: explore,
});

export const fetchExploreFailure = (error) => ({
  type: exploreActions.FETCH_EXPLORE_FAILURE,
  payload: { error },
});

export function fetchExplore(token, date) {
  return async (dispatch) => {
    try {
      dispatch(fetchExplorePending());
      const response = await getExplorePage(token, date);
      return dispatch(fetchExploreSuccess(response.explore));
    } catch (error) {
      return dispatch(fetchExploreFailure(error));
    }
  };
}
