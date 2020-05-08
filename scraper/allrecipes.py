import recipescrapers.recipe_scrapers
from ._abstract import AbstractCrawler
import json
import requests
from bs4 import BeautifulSoup


class AllRecipes(AbstractCrawler):

    def crawl(self, es):
        recipe_cards = self.soup.findAll("h3", {"class": "fixed-recipe-card__h3"})
        i = 0
        while i < self.num:
            recipe_cards = self.soup.findAll("h3", {"class": "fixed-recipe-card__h3"})
            for recipe_card in recipe_cards:
                r = {}
                s = recipescrapers.recipe_scrapers.scrape_me(recipe_card.find("a", {"class":"fixed-recipe-card__title-link"})['href'])
                print(s.title())
                try:
                    r['title'] = s.title()
                    r['ingredients'] = s.ingredients()
                    r['link'] = s.url
                    r['image'] = s.image()
                    r['total_time'] = s.total_time()
                    r['tags'] = s.tags()
                    r['diet'] = s.suitable_for_diet()
                    r['id'] = "allrecipes" + s.id()
                except Exception as e:
                    print(e)
                    print('failed to get ' + s.url)
                try:
                    r['rating'] = s.ratings()
                except Exception as e:
                    r['rating'] = None
                es.create(index='recipes', doc_type='recipe', id=r['id'], body=json.dumps(r), ignore=409)
            break


