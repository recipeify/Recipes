from ._abstract import AbstractCrawler
from .abstractsitemapscraper import FilteredSitemapSpider


class Delish(AbstractCrawler):

    def crawl(self, es, client, process):
        URL = ['http://delish.com/robots.txt']
        rules = [('^https://www.delish.com/cooking/recipe-ideas/(?:recipes/)?a.*-recipe/$', 'parse_recipes')]
        domains = ['delish.com']
        process.crawl(FilteredSitemapSpider, es=es, client=client, num=self.num, sitemap_urls=URL, sitemap_rules=rules,
                      sitename='delish', allowed_domains=domains, init=self.init)