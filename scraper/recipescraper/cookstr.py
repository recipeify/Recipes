from ._abstract import AbstractScraper
from ._utils import get_minutes, normalize_string, get_yields

YIELDS = ['Makes', 'Serves', 'For']
TAGS = ["Occasion", "Recipe Course", "Meal", "Cooking Method", "Dietary Consideration", "Type of Dish"]


class Cookstr(AbstractScraper):

    @classmethod
    def host(self):
        return 'cookstr.com'

    def title(self):
        return normalize_string(self.soup.find(
            'h1',
            {'class': 'articleHeadline'}
        ).get_text())

    def total_time(self):
        sections = self.soup.findAll(
            'div',
            {'class': 'articleAttrSection'}
        )
        total_time = 0
        for section in sections:
            time = section.find(text='Total Time')
            if time:
                total_time += get_minutes(time.parent.parent)
        return total_time

    def yields(self):
        sections = self.soup.findAll(
            'span',
            {'class': 'attrLabel'}
        )
        total_serves = 0

        for section in sections:
            for keyword in YIELDS:
                serves = section.find(text=keyword)
                if serves:
                    total_serves = get_yields(section.next_sibling.text)
                    return total_serves
        return total_serves

    def ingredients(self):
        ingredients = self.soup.find(
            'div',
            {'class': "recipeIngredients"}
        )

        return [
            normalize_string(ingredient.get_text())
            for ingredient in ingredients.findAll('li')
        ]

    def instructions(self):
        instructions = self.soup.find(
            'div',
            {'class': 'stepByStepInstructionsDiv'}
        )

        return '\n'.join([
            normalize_string(instruction.get_text())
            for instruction in instructions.findAll('p')
        ])

    def tags(self):
        sections = self.soup.findAll(
            'span',
            {'class': 'attrLabel'}
        )
        tag_list = []

        for section in sections:
            for keyword in TAGS:
                tag = section.find(text=keyword)
                if tag:
                    temp_tags = normalize_string(section.next_sibling.text)
                    tag_list.extend([x.strip() for x in temp_tags.split(',')])
        return tag_list

    def id(self):
        return self.soup.find(
            'div',
            {'class': 'articleDiv articleType28 numCols'}
        )['data-a-id']