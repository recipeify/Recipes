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

export const fetchExploreSuccess = (boxes) => ({
  type: exploreActions.FETCH_EXPLORE_SUCCESS,
  payload: boxes,
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
      const {
        explore, popular, personal, mealByTime,
      } = response;
      return dispatch(fetchExploreSuccess({
        explore, popular, personal, mealByTime,
      }));
    } catch (error) {
      return dispatch(fetchExploreFailure(error));
    }
  };
}
