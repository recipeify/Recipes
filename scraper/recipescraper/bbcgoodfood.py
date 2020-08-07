from ._abstract import AbstractScraper
from ._utils import normalize_string
import re


class BBCGoodFood(AbstractScraper):

    @classmethod
    def host(self):
        return 'bbcgoodfood.com'

    def tags(self):
        tags = self.soup.findAll(
            'meta',
            {'itemprop': ['recipeCuisine', 'recipeCategory', 'keywords']}
        )

        return list(set([
            normalize_string(tag['content'])
            for tag in tags]))

    def id(self):
        try:
            recipe_id = self.soup.find(
                'article',
                {'class': 'node node-recipe node-full clearfix'})['id']
            pattern = re.compile('node-(\d+)$')
            info = pattern.findall(recipe_id)
            if info:
                return info[0]
            return None
        except TypeError:
            return None

