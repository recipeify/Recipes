// Handle HTTP errors since fetch won't.
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export const getResources = async () => {
  const response = await fetch('/api/resources/all', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  handleErrors(response);
  return response.json();
};

export const searchByFilters = async (
  freeText,
  includeTerms,
  excludeTerms,
  diet,
  cuisine,
  dishType,
  toCookTime,
  fromCookTime,
  from = 0,
  size = 10) => {
  const response = await fetch('/api/search/recipes',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

const apiRequests = { searchByFilters, getResources };
export default apiRequests;
