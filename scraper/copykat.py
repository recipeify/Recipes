from ._abstract import AbstractCrawler
from .abstractsitemapscraper import FilteredSitemapSpider


class CopyKat(AbstractCrawler):

    def crawl(self, es, process):
        URL = ['http://www.copykat.com/robots.txt']
        rules = [('/.*?/', 'parse_recipes')]
        domains = ['copykat.com']
        process.crawl(FilteredSitemapSpider, es=es, num=self.num, sitemap_urls=URL, sitemap_rules=rules,
                      sitename='copykat', allowed_domains=domains, init=self.flag)











