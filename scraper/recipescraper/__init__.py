import inspect
import re
from tldextract import TLDExtract

from .allrecipes import AllRecipes
from .bbcfood import BBCFood
from .bbcgoodfood import BBCGoodFood
from .bettycrocker import BettyCrocker
from .bonappetit import BonAppetit
from .budgetbytes import BudgetBytes
from .closetcooking import ClosetCooking
from .cookstr import Cookstr
from .copykat import CopyKat
from .delish import Delish
from .epicurious import Epicurious
from .food import Food
from .foodnetwork import FoodNetwork
from .foodrepublic import FoodRepublic
from .tasty import Tasty
SCRAPERS = {
    AllRecipes.host(): AllRecipes,
    BBCFood.host(): BBCFood,
    BBCFood.host(domain='co.uk'): BBCFood,
    BBCGoodFood.host(): BBCGoodFood,
    BettyCrocker.host(): BettyCrocker,
    BonAppetit.host(): BonAppetit,
    BudgetBytes.host(): BudgetBytes,
    ClosetCooking.host(): ClosetCooking,
    Cookstr.host(): Cookstr,
    CopyKat.host(): CopyKat,
    Delish.host(): Delish,
    Epicurious.host(): Epicurious,
    Food.host(): Food,
    FoodNetwork.host(): FoodNetwork,
    FoodRepublic.host(): FoodRepublic,
    Tasty.host(): Tasty
}


def url_path_to_dict(path):
    pattern = (r'^'
               r'((?P<schema>.+?)://)?'
               r'((?P<user>.+?)(:(?P<password>.*?))?@)?'
               r'(?P<host>.*?)'
               r'(:(?P<port>\d+?))?'
               r'(?P<path>/.*?)?'
               r'(?P<query>[?].*?)?'
               r'$'
               )
    regex = re.compile(pattern)
    matches = regex.match(path)
    url_dict = matches.groupdict() if matches is not None else None

    return url_dict


class WebsiteNotImplementedError(NotImplementedError):
    """ Error for when the website is not supported by this library. """
    def __init__(self, domain):
        self.domain = domain

    def __str__(self):
        return "Website ({}) is not supported".format(self.domain)


def get_domain(url):
    tldextract = TLDExtract(suffix_list_urls=None)
    url_info = tldextract(url)
    return '{}.{}'.format(url_info.domain, url_info.suffix)


def harvest(url, **options):
    domain = get_domain(url)
    if domain not in SCRAPERS:
        raise WebsiteNotImplementedError(domain)

    scraper = SCRAPERS[domain]
    options = {
        option: value for option, value in options.items()
        if option in inspect.signature(scraper).parameters
    }
    return scraper(url, **options)


def scrape_me(url_path, body=None):

    host_name = url_path_to_dict(url_path.replace('://www.', '://'))['host']
    host_name = host_name.lower()
    try:
        scraper = SCRAPERS[host_name]
    except KeyError:
        raise WebsiteNotImplementedError(host_name)

    return scraper(url_path, body)


__all__ = ['scrape_me']
name = "recipescraper"
