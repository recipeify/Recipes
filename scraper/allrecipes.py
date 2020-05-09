import recipescrapers.recipe_scrapers
from ._abstract import AbstractCrawler
from ._utils import insert_to_es
from bs4 import BeautifulSoup
import requests

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7'
}


class AllRecipes(AbstractCrawler):

    def crawl(self, es):
        i = 0
        j = 1
        while i < self.num:
            recipe_cards = self.soup.findAll("h3", {"class": "fixed-recipe-card__h3"})
            for recipe_card in recipe_cards:
                try:
                    s = recipescrapers.recipe_scrapers.scrape_me(recipe_card.find("a", {"class":"fixed-recipe-card__title-link"})['href'])
                except TypeError:
                    continue
                print(s.title() + ", i = " + str(i))
                result = insert_to_es(es, s, "allrecipes")
                if result:
                    i += 1
                if i >= self.num:
                    return
            j += 1
            print(j)
            page_data = requests.get("https://www.allrecipes.com/recipes/22908/everyday-cooking/special-collections/new/?page=" + str(j), headers=HEADERS).content
            self.soup = BeautifulSoup(page_data, "html.parser")

