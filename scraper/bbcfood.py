from ._abstract import AbstractCrawler
from .abstractsitemapscraper import FilteredSitemapSpider


class BBCFood(AbstractCrawler):

    def crawl(self, es, client, process):
        URL = ['https://www.bbc.co.uk/food/sitemap.xml']
        rules = [('/recipes/', 'parse_recipes')]
        domains = ['bbc.co.uk']
        process.crawl(FilteredSitemapSpider, es=es, client=client, num=self.num, sitemap_urls=URL, sitemap_rules=rules,
                      sitename='bbcfood', allowed_domains=domains, init=self.init)
