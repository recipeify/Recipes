from ._abstract import AbstractScraper
from ._utils import normalize_string, get_diet_from_tags
import re, json


class AllRecipes(AbstractScraper):

    @classmethod
    def host(self):
        return 'allrecipes.com'

    def tags(self):
        b = self.soup.find("div", {"class":"keyvals"})
        first = ""
        if b is not None:
            first = normalize_string(b['data-content_cms_tags'])
        pattern = re.compile('var RdpInferredTastePrefs = (\\[.*?\\]);')
        info = pattern.findall(self.soup.prettify())
        second = []
        if info:
            second = eval(info[0], {'__builtins__':None}, {})
        if first == "":
            return list(set(second))
        else:
            return list(set(first.split("|")).union(set(second)))

    def yields(self):
        f = AbstractScraper.Decorators.schema_org_priority(self.yields)
        if f(self) == 'None':
            b = self.soup.find("section", {'class' : 'component recipe-ingredients-new container interactive'})
            return int(b['data-servings'])

    def id(self):
        pattern = re.compile('https://www.allrecipes.com/recipe/(\d+)/')
        info = pattern.findall(self.url)
        if info:
            return info[0]
        return None

