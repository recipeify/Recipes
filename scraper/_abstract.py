from bs4 import BeautifulSoup
import requests

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7'
}


class AbstractCrawler:

    def __init__(self, host, scraping_url, num):
        print(host)
        self.num = num
        self.url = host
        self.scraping_url = scraping_url
        page_data = requests.get(scraping_url, headers=HEADERS).content

        self.soup = BeautifulSoup(page_data, "html.parser")

    def crawl(self, es):
        raise NotImplementedError("This should be implemented.")
