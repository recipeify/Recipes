from ._abstract import AbstractCrawler
from .abstractsitemapscraper import FilteredSitemapSpider


class BBCGoodFood(AbstractCrawler):

    def crawl(self, es, process):
        URL = ['https://www.bbcgoodfood.com/sitemap.xml']
        rules = [('/recipes/(?!collection/)(?!category/)', 'parse_recipes')]
        domains = ['bbcgoodfood.com']
        process.crawl(FilteredSitemapSpider, es=es, num=self.num, sitemap_urls=URL, sitemap_rules=rules,
                      sitename='bbcgoodfood', allowed_domains=domains, init=self.init)
