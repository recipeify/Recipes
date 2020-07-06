from ._abstract import AbstractCrawler
from .abstractsitemapscraper import FilteredSitemapSpider


class BettyCrocker(AbstractCrawler):

    def crawl(self, es, process):
        URL = ['https://www.bettycrocker.com/robots.txt']
        rules = [('/([0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$)', 'parse_recipes')]
        domains = ['bettycrocker.com']
        process.crawl(FilteredSitemapSpider, es=es, num=self.num, sitemap_urls=URL, sitemap_rules=rules,
                      sitename='bettycrocker', allowed_domains=domains, init=self.init)
