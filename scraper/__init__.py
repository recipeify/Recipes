# import json

from scrapy.crawler import CrawlerProcess

import recipescrapers.recipe_scrapers
import certifi
from elasticsearch import Elasticsearch
from dotenv import load_dotenv
import os
import math
from scrapy.utils.project import get_project_settings

from .allrecipes import AllRecipes
from .bbcfood import BBCFood
from .bbcgoodfood import BBCGoodFood
from .bettycrocker import BettyCrocker
from .bonappetit import BonAppetit
from .budgetbytes import BudgetBytes
from .cookstr import Cookstr
from .copykat import CopyKat
from .delish import Delish
from .epicurious import Epicurious
from .food import Food
from .foodnetwork import FoodNetwork
from .tasty import Tasty

load_dotenv(dotenv_path='Recipes/scraper/.env')

URLS = {
    recipescrapers.recipe_scrapers.BBCFood.host(): BBCFood,
    recipescrapers.recipe_scrapers.BBCGoodFood.host(): BBCGoodFood,
    recipescrapers.recipe_scrapers.BettyCrocker.host(): BettyCrocker,
    recipescrapers.recipe_scrapers.BonAppetit.host(): BonAppetit,
    recipescrapers.recipe_scrapers.AllRecipes.host(): AllRecipes,
    recipescrapers.recipe_scrapers.BudgetBytes.host(): BudgetBytes,
    recipescrapers.recipe_scrapers.Cookstr.host(): Cookstr,
    recipescrapers.recipe_scrapers.CopyKat.host(): CopyKat,
    recipescrapers.recipe_scrapers.Delish.host(): Delish,
    recipescrapers.recipe_scrapers.Epicurious.host(): Epicurious,
    recipescrapers.recipe_scrapers.Food.host(): Food,
    recipescrapers.recipe_scrapers.FoodNetwork.host(): FoodNetwork,
    recipescrapers.recipe_scrapers.Tasty.host(): Tasty
}


def connect_to_es():
    elastic_search_host = os.getenv("ELASTIC_SEARCH_HOST")
    es = Elasticsearch(
        [elastic_search_host],
        use_ssl=True,
        ca_certs=certifi.where())
    return es


# Default = periodic crawler(init=0), for Testing purposes I am using the initial crawler(init=1)
def init_crawler(num=0, init=1):
    es = connect_to_es()
    #Create a crawling process for all crawlers to make use of Scrapy's concurrency
    process = CrawlerProcess(settings=get_project_settings())
    for host, site in URLS.items():
        #Create an instance of each site's crawler
        obj = site(math.floor(num / len(URLS.items())), init)
        #Instruct the process to crawl each individual site, but only start the actual crawling process once they're all ready
        obj.crawl(es, process)
    process.start()
    process.stop()


# def change_index(x):
#     es = connect_to_es()
#     return es.indices.create(index='recipes', body=x)
#
#     #es.indices.put_mapping(index='recipes', )

__all__ = ['init_crawler']
name = "scraper"
