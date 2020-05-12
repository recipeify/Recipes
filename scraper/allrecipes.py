from scrapy.crawler import CrawlerProcess
from scrapy.settings import Settings
from ._abstract import AbstractCrawler

from .abstractsitemapscraper import FilteredSitemapSpider


class AllRecipes(AbstractCrawler):

    def crawl(self, es, process):
        URL = ['https://www.allrecipes.com/sitemaps/recipe/1/sitemap.xml',
               'https://www.allrecipes.com/sitemaps/recipe/2/sitemap.xml']
        rules = [('/recipe/', 'parse_recipes')]
        domains = ['allrecipes.com']
        # process.settings.set(
        #     'DOWNLOAD_DELAY', 0.25,
        # )
        # process.settings.set(
        #     'CONCURRENT_REQUESTS', 8
        # )
        process.crawl(FilteredSitemapSpider, es=es, num=self.num, sitemap_urls=URL, sitemap_rules=rules,
                      sitename='allrecipes', allowed_domains=domains, init=self.flag)
