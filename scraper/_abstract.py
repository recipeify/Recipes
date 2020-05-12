from bs4 import BeautifulSoup
import requests

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7'
}


class AbstractCrawler:

    def __init__(self, num, flag):
        self.num = num
        self.flag = flag

    def crawl(self, es, process):
        raise NotImplementedError("This should be implemented.")