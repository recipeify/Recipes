from ._abstract import AbstractCrawler
from .abstractsitemapscraper import FilteredSitemapSpider


class AllRecipes(AbstractCrawler):

    def crawl(self, es, process):
        URL = ['https://www.allrecipes.com/sitemaps/recipe/1/sitemap.xml',
               'https://www.allrecipes.com/sitemaps/recipe/2/sitemap.xml']
        rules = [('/recipe/', 'parse_recipes')]
        domains = ['allrecipes.com']
        process.crawl(FilteredSitemapSpider, es=es, num=self.num, sitemap_urls=URL, sitemap_rules=rules,
                      sitename='allrecipes', allowed_domains=domains, init=self.flag)
