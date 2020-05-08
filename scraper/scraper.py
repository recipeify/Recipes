from recipescrapers.recipe_scrapers import scrape_me
import json
import certifi
from elasticsearch import Elasticsearch
from dotenv import load_dotenv
import os

# source: https://github.com/hhursev/recipe-scrapers

load_dotenv(dotenv_path='../api/.env')
ELASTIC_SEARCH_HOST = os.getenv("ELASTIC_SEARCH_HOST")

es = Elasticsearch(
  [ELASTIC_SEARCH_HOST],
  use_ssl=True, 
  ca_certs=certifi.where())

# scraper = scrape_me('https://www.allrecipes.com/recipe/8358/apple-cake-iv/')
# done 7000-8000

# for num in range(7000,8000):
#   r = {}
#   url = 'https://www.allrecipes.com/recipe/' + str(num)
#   scraper = scrape_me(url)
#
#   try:
#     r['title'] = scraper.title()
#     r['ingredients'] = scraper.ingredients()
#     r['link'] = url
#     r['image'] = scraper.image()
#     r['id'] = 'allrecipes' + str(num)
#     r['total_time'] = scraper.total_time()
#     es.create(index='test-index', doc_type='recipe', id=r['id'], body=json.dumps(r), ignore=409)
#
#     print(json.dumps(r, indent=4, sort_keys=True))
#   except Exception as e:
#     print(e)
#     print('failed to get ' + url)

  #scraper.total_time()
  #scraper.yields()

