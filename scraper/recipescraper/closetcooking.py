from ._abstract import AbstractScraper
from ._utils import get_minutes, normalize_string, get_yields


class ClosetCooking(AbstractScraper):

    @classmethod
    def host(self):
        return 'closetcooking.com'

    def title(self):
        return normalize_string(self.soup.find(
            'h1',
            {'class': 'entry-title'}
        ).get_text())

    def total_time(self):
        return get_minutes(self.soup.find(itemprop='totalTime').parent)

    def yields(self):
        return get_yields(self.soup.find(itemprop='recipeYield').parent)

    def ingredients(self):
        ingredients = self.soup.findAll(
            'li',
            {'itemprop': "recipeIngredient"}
        )

        return [
            normalize_string(ingredient.get_text())
            for ingredient in ingredients
        ]

    def instructions(self):
        instructions = self.soup.findAll(
            'li',
            {'itemprop': 'recipeInstructions'}
        )

        return '\n'.join([
            normalize_string(instruction.get_text())
            for instruction in instructions
        ])

    def tags(self):
        tags = self.soup.findAll(
            'a',
            {'rel': 'category tag'}
        )
        return [
            normalize_string(tag.get_text())
            for tag in tags
        ]