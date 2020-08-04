# import json

from scrapy.crawler import CrawlerProcess
from recombee_api_client.api_client import RecombeeClient

import scraper.recipescraper
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
    recipescraper.BBCFood.host(): BBCFood,
    recipescraper.BBCGoodFood.host(): BBCGoodFood,
    recipescraper.BettyCrocker.host(): BettyCrocker,
    recipescraper.BonAppetit.host(): BonAppetit,
    recipescraper.AllRecipes.host(): AllRecipes,
    recipescraper.BudgetBytes.host(): BudgetBytes,
    recipescraper.Cookstr.host(): Cookstr,
    recipescraper.CopyKat.host(): CopyKat,
    recipescraper.Delish.host(): Delish,
    recipescraper.Epicurious.host(): Epicurious,
    recipescraper.Food.host(): Food,
    recipescraper.FoodNetwork.host(): FoodNetwork,
    recipescraper.Tasty.host(): Tasty
}


def connect_to_es():
    elastic_search_host = os.getenv("ELASTIC_SEARCH_HOST")
    es = Elasticsearch(
        [elastic_search_host])
    return es


# Default = periodic crawler(init=0), for Testing purposes I am using the initial crawler(init=1)
def init_crawler(num=0, init=0):
    es = connect_to_es()
    client = RecombeeClient(os.getenv("RECOMBEE_DATABASE_ID"), os.getenv("RECOMBEE_PRIVATE_TOKEN"))
    #Create a crawling process for all crawlers to make use of Scrapy's concurrency
    process = CrawlerProcess(settings=get_project_settings())
    for host, site in URLS.items():
        #Create an instance of each site's crawler
        obj = site(math.floor(num / len(URLS.items())), init)
        #Instruct the process to crawl each individual site, but only start the actual crawling process once they're all ready
        obj.crawl(es, client, process)
    process.start()
    process.stop()


# def change_index(x):
#     es = connect_to_es()
#     return es.indices.create(index='recipes', body=x)
#
#     #es.indices.put_mapping(index='recipes', )

__all__ = ['init_crawler']
name = "scraper"
