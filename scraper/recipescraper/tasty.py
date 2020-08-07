import json

from ._abstract import AbstractScraper
from ._utils import get_minutes, normalize_string, get_yields


class Tasty(AbstractScraper):

    @classmethod
    def host(self):
        return 'tasty.co'

    def tags(self):
        tags_tag = self.soup.find(
            'script',
            {'id': '__NEXT_DATA__'}
        )
        s = json.loads(tags_tag.contents[0])
        tag_list = s['props']['pageProps']['recipe']['tags']
        return [tag['name'] for tag in tag_list]

    def id(self):
        return self.soup.find(
            'div',
            {'class':'recipe-page content-wrap content-container xs-flex-grow-1 clearfix xs-mx-auto xs-col-12'}


        )['data-recipe-id']
