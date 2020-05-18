// Handle HTTP errors since fetch won't.
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export const searchIngredient = async (term, from = 0, size = 10) => {
  const response = await fetch('/api/search/ingredient',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        term,
        from,
        size,
      }),
    });

  handleErrors(response);
  return response.json();
};

export const getIngredientDataset = async () => {
  const response = await fetch('/api/resources/ingredients', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  handleErrors(response);
  return response.json();
};

export const searchByIngredients = async (
  includeTerms,
  excludeTerms,
  from = 0,
  size = 10) => {
  const response = await fetch('/api/search/recipes',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        includeTerms,
        excludeTerms,
        from,
        size,
      }),
    });

  handleErrors(response);
  return response.json();
};

const apiRequests = { searchIngredient, searchByIngredients, getIngredientDataset };
export default apiRequests;
