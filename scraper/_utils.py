import json
from elasticsearch import exceptions


def insert_to_es(es, s, name):
    r = {}
    try:
        r['title'] = s.title()
        r['ingredients'] = s.ingredients()
        r['link'] = s.url
        r['image'] = s.image()
        r['total_time'] = s.total_time()
        r['tags'] = s.tags()
        r['diet'] = s.suitable_for_diet()
        r['id'] = name + s.id()
    except Exception as e:
        print(e)
        print('failed to get ' + s.url)
    try:
        r['rating'] = s.ratings()
    except (NotImplementedError, TypeError) as e:
        r['rating'] = None
    try:
        s = es.create(index='recipes', doc_type='recipe', id=r['id'], body=json.dumps(r))
    except exceptions.ConflictError as e:
        if e.status_code == 409:
            return False
    return True
