from ._abstract import AbstractCrawler
from .abstractsitemapscraper import FilteredSitemapSpider


class Food(AbstractCrawler):

    def crawl(self, es, client, process):
        URL = ['https://www.food.com/robots.txt']
        rules = [('/recipe/', 'parse_recipes')]
        domains = ['food.com']
        process.crawl(FilteredSitemapSpider, es=es, client=client, num=self.num, sitemap_urls=URL, sitemap_rules=rules,
                      sitename='food', allowed_domains=domains, init=self.init)