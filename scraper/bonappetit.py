from ._abstract import AbstractCrawler
from .abstractsitemapscraper import FilteredSitemapSpider


class BonAppetit(AbstractCrawler):

    def crawl(self, es, client, process):
        URL = ['https://bonappetit.com/robots.txt']
        rules = [('/recipe/', 'parse_recipes')]
        domains = ['bonappetit.com']
        process.crawl(FilteredSitemapSpider, es=es, client=client, num=self.num, sitemap_urls=URL, sitemap_rules=rules,
                      sitename='bonappetit', allowed_domains=domains, init=self.init)