from ._abstract import AbstractCrawler
from .abstractsitemapscraper import FilteredSitemapSpider


class Tasty(AbstractCrawler):

    def crawl(self, es, process):
        URL = ['https://tasty.co/robots.txt']
        rules = [('/recipe/', 'parse_recipes')]
        domains = ['tasty.co']
        process.crawl(FilteredSitemapSpider, es=es, num=self.num, sitemap_urls=URL, sitemap_rules=rules,
                      sitename='tasty', allowed_domains=domains, init=self.init)



