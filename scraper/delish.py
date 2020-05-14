from ._abstract import AbstractCrawler
from .abstractsitemapscraper import FilteredSitemapSpider


class Delish(AbstractCrawler):

    def crawl(self, es, process):
        URL = ['http://delish.com/robots.txt']
        rules = [('^https://www.delish.com/cooking/recipe-ideas/(?:recipes/)?a.*-recipe/$', 'parse_recipes')]
        domains = ['delish.com']
        process.crawl(FilteredSitemapSpider, es=es, num=self.num, sitemap_urls=URL, sitemap_rules=rules,
                      sitename='delish', allowed_domains=domains, init=self.flag)