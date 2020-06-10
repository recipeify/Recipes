export const modeActions = {
  SWITCH_TO_EXPLORE: 'SWITCH_TO_EXPLORE',
  SWITCH_TO_MY_RECIPES: 'SWITCH_TO_MY_RECIPES',
};

const switchToExplore = () => ({
  type: modeActions.SWITCH_TO_EXPLORE,
});

const switchToMyRecipes = () => ({
  type: modeActions.SWITCH_TO_MY_RECIPES,
});

export { switchToExplore, switchToMyRecipes };
