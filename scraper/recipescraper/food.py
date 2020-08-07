import re

from ._abstract import AbstractScraper
from ._utils import get_minutes, normalize_string, get_yields, get_diet_from_tags


class Food(AbstractScraper):

    @classmethod
    def host(self):
        return 'food.com'

    # def title(self):
    #     return self.soup.find('h1').get_text()
    #
    # def total_time(self):
    #     return get_minutes(self.soup.find(
    #         'div',
    #         {'class': 'recipe-facts__time'})
    #     )
    #
    # def yields(self):
    #     return get_yields(self.soup.find(
    #         'div',
    #         {'class': 'recipe-facts__servings'}
    #     ).get_text())
    #
    # def ingredients(self):
    #     ingredients = self.soup.findAll(
    #         'li',
    #         {"class": "recipe-ingredients__item"}
    #     )
    #
    #     return [
    #         normalize_string(ingredient.get_text())
    #         for ingredient in ingredients
    #     ]
    #
    # def instructions(self):
    #     instructions = self.soup.findAll(
    #         'li',
    #         {"class": "recipe-directions__step"}
    #     )
    #
    #     return '\n'.join([
    #         instruction.get_text()
    #         for instruction in instructions
    #     ])
    #
    # def tags(self):
    #     tags_list = self.soup.find(
    #         'meta',
    #         {'name': 'sailthru.tags'}
    #     )
    #
    #     if type(tags_list['content']) == str:
    #         return [x.strip() for x in normalize_string(tags_list['content']).split(',')]
    #
    # def suitable_for_diet(self):
    #     return get_diet_from_tags(self.tags())

    def id(self):
        pattern = re.compile('-(\d+$)')
        info = pattern.findall(self.url)
        if info:
            return info[0]
        return None
