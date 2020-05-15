export const userActions = {
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
};

const userLogin = (user) => ({
  type: userActions.USER_LOGIN,
  payload: { ...user },
});

const userLogout = () => ({
  type: userActions.USER_LOGOUT,
});

export {
  userLogin,
  userLogout,
};
