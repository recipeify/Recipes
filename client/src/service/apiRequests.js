// Handle HTTP errors since fetch won't.
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

const globalHeaders = {
  pragma: 'no-cache',
  'cache-control': 'no-cache',
  'Content-Type': 'application/json',
};

export const getResources = async () => {
  const response = await fetch('/api/resources/all', {
    method: 'GET',
    headers: globalHeaders,
  });
  handleErrors(response);
  return response.json();
};

export const sendView = async (token, recipeID) => {
  const response = await fetch('/api/users/recipes_viewed',
    {
      method: 'POST',
      headers: {
        ...globalHeaders,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ recipes: [recipeID] }),
    });
  handleErrors(response);
  return response;
};

export const addRecipes = async (token, recipes) => {
  const response = await fetch('/api/users/add_recipes',
    {
      method: 'POST',
      headers: {
        ...globalHeaders,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ recipes }),
    });
  handleErrors(response);
  return response;
};

export const removeRecipes = async (token, recipes) => {
  const response = await fetch('/api/users/remove_recipes',
    {
      method: 'POST',
      headers: {
        ...globalHeaders,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ recipes }),
    });
  handleErrors(response);
  return response;
};

export const getUserRecipes = async (token) => {
  const response = await fetch('/api/users/get_recipes',
    {
      method: 'GET',
      headers: {
        ...globalHeaders,
        Authorization: `Bearer ${token}`,
      },
    });
  handleErrors(response);
  return response.json();
};

export const getUserPreferences = async (token) => {
  const response = await fetch('/api/users/preferences',
    {
      method: 'GET',
      headers: {
        ...globalHeaders,
        Authorization: `Bearer ${token}`,
      },
    });
  handleErrors(response);
  return response;
};

export const setUserPreferences = async (token, dietaryPrefs, blacklist) => {
  const response = await fetch('/api/users/preferences',
    {
      method: 'POST',
      headers: {
        ...globalHeaders,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        excludeTerms: blacklist,
        diet: dietaryPrefs,
      }),
    });
  handleErrors(response);
  return response;
};

export const searchByFilters = async (
  token,
  freeText,
  includeTerms,
  excludeTerms,
  diet,
  cuisine,
  dishType,
  toCookTime,
  fromCookTime,
  from = 0,
  size = 30) => {
  const headers = token ? {
    ...globalHeaders,
    Authorization: `Bearer ${token}`,
  } : globalHeaders;

  const response = await fetch('/api/search/recipes',
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        freeText,
        includeTerms,
        excludeTerms,
        diet,
        cuisine,
        dishType,
        toCookTime,
        fromCookTime,
        from,
        size,
      }),
    });

  handleErrors(response);
  return response.json();
};

const apiRequests = {
  searchByFilters,
  getResources,
  sendView,
  getUserRecipes,
};
export default apiRequests;
