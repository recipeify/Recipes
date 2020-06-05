export const userActions = {
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
};

const userLogin = (data) => ({
  type: userActions.USER_LOGIN,
  payload: { ...data },
});

const userLogout = () => ({
  type: userActions.USER_LOGOUT,
});

export {
  userLogin,
  userLogout,
};
