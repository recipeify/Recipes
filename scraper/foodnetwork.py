from ._abstract import AbstractCrawler
from .abstractsitemapscraper import FilteredSitemapSpider


class FoodNetwork(AbstractCrawler):

    def crawl(self, es, process):
        URL = ['https://www.foodnetwork.com/robots.txt']
        rules = [('https://www\.foodnetwork\.com/recipes/.*-(?:\d*$)', 'parse_recipes')]
        domains = ['foodnetwork.com']
        process.crawl(FilteredSitemapSpider, es=es, num=self.num, sitemap_urls=URL, sitemap_rules=rules,
                      sitename='foodnetwork', allowed_domains=domains, init=self.init)