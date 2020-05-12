import json
from elasticsearch import exceptions


def insert_to_es(es, s, name):
    r = {}
    try:
        r['id'] = name + s.id()
    except (NotImplementedError, TypeError):
        print('failed to get ' + s.url)

    try:
        r['title'] = s.title()
    except (NotImplementedError, TypeError):
        r['title'] = None
        print('failed to get ' + s.url)

    try:
        r['ingredients'] = s.ingredients()
    except (NotImplementedError, TypeError):
        r['ingredients'] = None
        print('failed to get ' + s.url)
    try:
        r['link'] = s.url
    except (NotImplementedError, TypeError):
        r['link'] = None
        print('failed to get ' + s.url)
    try:
        r['image'] = s.image()
    except (NotImplementedError, TypeError):
        r['image'] = None
        print('failed to get ' + s.url)
    try:
        r['tags'] = s.tags()
    except (NotImplementedError, TypeError):
        r['tags'] = None
        print('failed to get ' + s.url)
    try:
        r['diet'] = s.suitable_for_diet()
    except (NotImplementedError, TypeError):
        r['diet'] = None
        print('failed to get ' + s.url)
    try:
        r['total_time'] = s.total_time()
    except (NotImplementedError, TypeError):
        r['total_time'] = None
        print('failed to get ' + s.url)

    try:
        r['rating'] = s.ratings()
    except (NotImplementedError, TypeError):
        r['rating'] = None
    try:
        s = es.create(index='recipes', doc_type='recipe', id=r['id'], body=json.dumps(r))
    except exceptions.ConflictError as e:
        if e.status_code == 409:
            return False
    return True

