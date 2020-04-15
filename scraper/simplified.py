import numpy as np

# source: https://dominikschmidt.xyz/simplified-recipes-1M/

with np.load('simplified-recipes-1M.npz') as data:
    #recipes = data['recipes']
    ingredients = data['ingredients']
    for ingredient in ingredients:
        if len(ingredient) < 3:
            continue
        print (ingredient)