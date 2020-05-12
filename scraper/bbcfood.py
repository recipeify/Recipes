from scrapy.crawler import CrawlerProcess
from ._abstract import AbstractCrawler
from .abstractsitemapscraper import FilteredSitemapSpider

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7'
}


class BBCFood(AbstractCrawler):

    def crawl(self, es, process):
        URL = ['https://www.bbc.co.uk/food/sitemap.xml']
        rules = [('/recipes/', 'parse_recipes')]
        domains = ['bbc.co.uk']
        process.crawl(FilteredSitemapSpider, es=es, num=self.num, sitemap_urls=URL, sitemap_rules=rules, sitename='bbcfood', allowed_domains=domains, init=self.flag)
