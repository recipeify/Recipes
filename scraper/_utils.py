from datetime import datetime
import json
from elasticsearch import exceptions
import logging

PLACEHOLDER_IMAGE_URL = {
    'allrecipes': 'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fwww.allrecipes.com%2Fimg%2Fmisc%2Fog-default.png',
    'bbcfood': 'https://food.files.bbci.co.uk/kandl-food/3037/images/non-spriteable-images/bbc_placeholder.png',
    'bbcgoodfood': '',
    'bettycrocker': 'https://www.bettycrocker.com/-/media/Images/Shared/RecipeParts/ComingSoon_500x281',
    'bonappetit': '',
    'budgetbytes': '',
    'cookstr': '',
    'copykat': 'https://copykat.com/wp-content/uploads/2018/06/image-coming-soon.jpg',
    'delish': '',
    'epicurious':'https://www.epicurious.com/static/img/misc/epicurious-social-logo.png',
    'food':'https://img.sndimg.com/food/image/upload/q_92,fl_progressive,w_1200,c_scale/v1/gk-static/fdc-new/img/fdc-shareGraphic.png',
    'foodnetwork':'https://food.fnr.sndimg.com/content/dam/images/food/editorial/homepage/fn-feature.jpg.rend.hgtvcom.406.229.suffix/1474463768097.jpeg',
    'tasty':''

}


def insert_to_es(es, s, name):
    r = {}

    # Not Sure about this one. Scrapy seems to have trouble finding 'new' recipes quick enough.

    # try:
    #     date_published = s.date_published()
    # except (NotImplementedError, TypeError):
    #     logging.log(logging.ERROR, 'Scrapy failed to get datePublished from ' + s.url)
    #     date_published = None
    #
    # if date_published:
    #     time_difference = datetime.now() - date_published
    #     if init:
    #         if time_difference.days >= (10 * 365):
    #             return False
    #     else:
    #         if time_difference.days >= 7:
    #             return False
    try:
        r['id'] = name + '-' + s.id()
    except (NotImplementedError, TypeError):
        logging.log(logging.ERROR, 'Scrapy failed to get ID from ' + s.url)
        return False

    try:
        r['title'] = s.title()
    except (NotImplementedError, TypeError):
        r['title'] = None
        logging.log(logging.ERROR, 'Scrapy failed to get title from ' + s.url)
        return False

    try:
        r['ingredients'] = s.ingredients()
    except (NotImplementedError, TypeError):
        r['ingredients'] = None
        logging.log(logging.ERROR, 'Scrapy failed to get ingredients list from ' + s.url)
        return False

    r['link'] = s.url

    try:
        r['image'] = s.image()
    except (NotImplementedError, TypeError):
        r['image'] = None
        logging.log(logging.WARNING, 'Scrapy failed to get image from ' + s.url)

    r['image_placeholder_flag'] = s.image() == PLACEHOLDER_IMAGE_URL[name]

    try:
        r['tags'] = s.tags()
    except (NotImplementedError, TypeError):
        r['tags'] = []
        logging.log(logging.WARNING, 'Scrapy failed to get tags from ' + s.url)

    try:
        x = s.total_time()
        if x == 0:
            r['total_time'] = None
        else:
            r['total_time'] = x
    except (NotImplementedError, TypeError):
        r['total_time'] = None
        logging.log(logging.WARNING, 'Scrapy failed to get total time from ' + s.url)

    try:
        r['rating'] = s.ratings()
    except (NotImplementedError, TypeError, AttributeError):
        r['rating'] = None
        logging.log(logging.WARNING, 'Scrapy failed to get ratings from ' + s.url)

    try:
        r['number_of_raters'] = s.number_of_raters()
    except (NotImplementedError, TypeError, AttributeError):
        r['number_of_raters'] = None
        logging.log(logging.WARNING, 'Scrapy failed to get number of raters from ' + s.url)

    r['time_acquired'] = datetime.now().isoformat()

    try:
        s = es.create(index='recipes', id=r['id'], body=json.dumps(r))
    except exceptions.ConflictError as e:
        if e.status_code == 409:
            return False

    return True
