from ._abstract import AbstractScraper
import re


class BBCFood(AbstractScraper):

    @classmethod
    def host(self, domain='com'):
        return 'bbc.{}'.format(domain)

    def id(self):
        s = re.compile('(\d+$)')
        info = s.findall(self.url)
        if info:
            return info[0]
        return None
