from scrapy.crawler import CrawlerProcess

import recipescrapers.recipe_scrapers
import certifi
from elasticsearch import Elasticsearch
from dotenv import load_dotenv
import os
import math

from .allrecipes import AllRecipes
from .bbcfood import BBCFood
from .bbcgoodfood import BBCGoodFood
from .bettycrocker import BettyCrocker
from .bonappetit import BonAppetit
from .budgetbytes import BudgetBytes
# from .closetcooking import ClosetCooking
from .cookstr import Cookstr
from .copykat import CopyKat
from .delish import Delish
# from .epicurious import Epicurious
# from .food import Food
# from .foodnetwork import FoodNetwork
# from .foodrepublic import FoodRepublic
# from .tasty import Tasty


HEADERS = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0'
}

URLS = {
    # recipescrapers.recipe_scrapers.BBCFood.host(): BBCFood,
    # recipescrapers.recipe_scrapers.BBCGoodFood.host(): BBCGoodFood,
    # recipescrapers.recipe_scrapers.BettyCrocker.host(): BettyCrocker,
    # recipescrapers.recipe_scrapers.BonAppetit.host(): BonAppetit,
    # recipescrapers.recipe_scrapers.AllRecipes.host(): AllRecipes,
    # recipescrapers.recipe_scrapers.BudgetBytes.host(): BudgetBytes
    # recipescrapers.ClosetCooking.host(): ClosetCooking,
    # recipescrapers.recipe_scrapers.Cookstr.host(): Cookstr,
    # recipescrapers.recipe_scrapers.CopyKat.host(): CopyKat,
    recipescrapers.recipe_scrapers.Delish.host(): Delish,
    # recipescrapers.Epicurious.host(): Epicurious,
    # recipescrapers.Food.host(): Food,
    # recipescrapers.FoodNetwork.host(): FoodNetwork,
    # recipescrapers.FoodRepublic.host(): FoodRepublic,
    # recipescrapers.Tasty.host(): Tasty
}


def connect_to_es():
    load_dotenv(dotenv_path='Recipes/scraper/.env')
    elastic_search_host = os.getenv("ELASTIC_SEARCH_HOST")
    es = Elasticsearch(
        [elastic_search_host],
        use_ssl=True,
        ca_certs=certifi.where())
    return es


# Default = periodic crawler
def init_crawler(num, init=1):
    es = connect_to_es()
    process = CrawlerProcess(HEADERS)
    process.settings.set(
        'DOWNLOAD_DELAY', 0.05,
    )
    process.settings.set(
        'CONCURRENT_REQUESTS', 8
    )
    for host, site in URLS.items():
        # try:
        obj = site(math.floor(num / len(URLS.items())), init)
        obj.crawl(es, process)
    process.start()
    process.stop()

    # except #We'll get to this:
    # raise #We'll get to this


__all__ = ['init_crawler']
name = "scraper"
