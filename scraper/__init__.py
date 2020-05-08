import recipescrapers.recipe_scrapers
import json
import certifi
from elasticsearch import Elasticsearch
from dotenv import load_dotenv
import os
import math

from .allrecipes import AllRecipes

# from .bbcfood import BBCFood
# from .bbcgoodfood import BBCGoodFood
# from .bettycrocker import BettyCrocker
# from .bonappetit import BonAppetit
# from .budgetbytes import BudgetBytes
# from .closetcooking import ClosetCooking
# from .cookstr import Cookstr
# from .copykat import CopyKat
# from .delish import Delish
# from .epicurious import Epicurious
# from .food import Food
# from .foodnetwork import FoodNetwork
# from .foodrepublic import FoodRepublic
# from .tasty import Tasty

URLS = {
    recipescrapers.recipe_scrapers.AllRecipes.host(): [AllRecipes, "https://www.allrecipes.com/?page=1"]
    # recipescrapers.BBCFood.host(): BBCFood,
    # recipescrapers.BBCFood.host(domain='co.uk'): BBCFood,
    # recipescrapers.BBCGoodFood.host(): BBCGoodFood,
    # recipescrapers.BettyCrocker.host(): BettyCrocker,
    # recipescrapers.BonAppetit.host(): BonAppetit,
    # recipescrapers.BudgetBytes.host(): BudgetBytes,
    # recipescrapers.ClosetCooking.host(): ClosetCooking,
    # recipescrapers.Cookstr.host(): Cookstr,
    # recipescrapers.CopyKat.host(): CopyKat,
    # recipescrapers.Delish.host(): Delish,
    # recipescrapers.Epicurious.host(): Epicurious,
    # recipescrapers.Food.host(): Food,
    # recipescrapers.FoodNetwork.host(): FoodNetwork,
    # recipescrapers.FoodRepublic.host(): FoodRepublic,
    # recipescrapers.Tasty.host(): Tasty
}


def connect_to_es():
    load_dotenv(dotenv_path='Recipes/api/.env')
    elastic_search_host = os.getenv("ELASTIC_SEARCH_HOST")
    es = Elasticsearch(
        [elastic_search_host],
        use_ssl=True,
        ca_certs=certifi.where())
    return es


def init_crawler(num):
    es = connect_to_es()
    for host, site in URLS.items():
        #try:
            obj = site[0](site[1], math.floor(num / len(URLS.items())))
            r = obj.crawl(es)
        #except #We'll get to this:
            #raise #We'll get to this


__all__ = ['init_crawler']
name = "scraper"
