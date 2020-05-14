from ._abstract import AbstractCrawler
from .abstractsitemapscraper import FilteredSitemapSpider


class Epicurious(AbstractCrawler):

    # https://www\.epicurious\.com/recipes/(?:member|food)/views/
    def crawl(self, es, process):
        URL = ['https://www.epicurious.com/robots.txt']
        rules = [('https://www\.epicurious\.com/recipes/food/views/', 'parse_recipes')]
        domains = ['epicurious.com']
        process.crawl(FilteredSitemapSpider, es=es, num=self.num, sitemap_urls=URL, sitemap_rules=rules,
                      sitename='epicurious', allowed_domains=domains, init=self.flag)