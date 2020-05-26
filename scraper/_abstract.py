class AbstractCrawler:

    def __init__(self, num, init):
        self.num = num
        self.init = init

    def crawl(self, es, process):
        raise NotImplementedError("This should be implemented.")