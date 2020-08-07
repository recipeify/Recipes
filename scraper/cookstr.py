from ._abstract import AbstractCrawler
from .abstractsitemapscraper import FilteredSitemapSpider


class Cookstr(AbstractCrawler):

    def crawl(self, es, client, process):
        URL = ['https://www.cookstr.com/www.Cookstr.com.xml']
        rules = [('/recipes/', 'parse_recipes')]
        domains = ['cookstr.com']
        process.crawl(FilteredSitemapSpider, es=es, client=client, num=self.num, sitemap_urls=URL, sitemap_rules=rules,
                      sitename='cookstr', allowed_domains=domains, init=self.init)