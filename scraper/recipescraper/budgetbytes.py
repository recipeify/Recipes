from ._abstract import AbstractScraper
from ._utils import get_minutes, normalize_string, get_yields
import re
from dateutil import parser


class BudgetBytes(AbstractScraper):

    def __init__(self, *args, **kwargs):
        super(BudgetBytes, self).__init__(*args, **kwargs)
        if not self.soup.find('div', {'class':'wprm-recipe-container'}):
            raise ValueError('Wrong page - not a recipe')

    @classmethod
    def host(self):
        return 'budgetbytes.com'

    def title(self):
        return self.soup.find(
            'h2',
            {'class': 'wprm-recipe-name'}
        ).get_text()

    def total_time(self):
        return get_minutes(self.soup.find(
            'span',
            {'class': 'wprm-recipe-total_time'}).parent
        )

    def yields(self):
        yields = self.soup.find(
            'span',
            {'class': 'wprm-recipe-servings'}
        ).get_text()

        return get_yields("{} servings".format(yields))

    def ingredients(self):
        ingredients = self.soup.findAll(
            'li',
            {'class': 'wprm-recipe-ingredient'}
        )

        return [
            normalize_string(ingredient.get_text())
            for ingredient in ingredients
        ]

    def instructions(self):
        instructions = self.soup.findAll(
            'div',
            {'class': 'wprm-recipe-instruction-text'}
        )

        return '\n'.join([
            normalize_string(instruction.get_text())
            for instruction in instructions
        ])

    def ratings(self):
        return round(float(
            self.soup.find(
                "span",
                {"class": "wprm-recipe-rating-average"}
            ).get_text()) / 5.0, 2
        )

    def number_of_raters(self):
        return int(
            self.soup.find(
                "span",
                {"class": "wprm-recipe-rating-count"}
            ).get_text())

    def tags(self):
        pattern = re.compile('window._zem_rp_post_tags = (\\[.*?\\]);')
        info = pattern.findall(self.soup.prettify())
        second = []
        if info:
            second = eval(info[0], {'__builtins__':None}, {})
        second = [x.replace('+', '').replace('recipes', '').lower() for x in second]
        return second

    def id(self):
        pattern = re.compile('window._zem_rp_post_id = \'(\d*)\';')
        info = pattern.findall(self.soup.prettify())
        if info:
            return info[0]
        return None

    def date_published(self):
        published = self.soup.find(
            'meta',
                {'property': 'article:published_time'}
        )
        try:
            date_time = parser.parse(published['content'], ignoretz=True)
        except (KeyError, parser.InvalidDateError):
            date_time = None
        return date_time
