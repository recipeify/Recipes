class AbstractCrawler:

    def __init__(self, num, flag):
        self.num = num
        self.flag = flag

    def crawl(self, es, process):
        raise NotImplementedError("This should be implemented.")