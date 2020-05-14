from datetime import datetime
import json
from elasticsearch import exceptions
import logging


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

    try:
        r['tags'] = s.tags()
    except (NotImplementedError, TypeError):
        r['tags'] = []
        logging.log(logging.WARNING, 'Scrapy failed to get tags from ' + s.url)

    try:
        r['diet'] = s.suitable_for_diet()
    except (NotImplementedError, TypeError):
        r['diet'] = []
        logging.log(logging.WARNING, 'Scrapy failed to get dietary preferences from ' + s.url)

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
    except (NotImplementedError, TypeError):
        r['rating'] = None
        logging.log(logging.WARNING, 'Scrapy failed to get ratings from ' + s.url)

    try:
        s = es.create(index='recipes', id=r['id'], body=json.dumps(r))
    except exceptions.ConflictError as e:
        if e.status_code == 409:
            return False

    return True

