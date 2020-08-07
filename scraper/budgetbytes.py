from ._abstract import AbstractCrawler
from .abstractsitemapscraper import FilteredSitemapSpider


class BudgetBytes(AbstractCrawler):

    def crawl(self, es, client, process):
        URL = ['https://www.budgetbytes.com/sitemap_index.xml']
        rules = [('/.*?/', 'parse_recipes')]
        domains = ['budgetbytes.com']
        process.crawl(FilteredSitemapSpider, es=es, client=client, num=self.num, sitemap_urls=URL, sitemap_rules=rules,
                      sitename='budgetbytes', allowed_domains=domains, init=self.init)