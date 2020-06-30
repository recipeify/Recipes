from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan
from dotenv import load_dotenv
import os
from recombee_api_client.api_client import RecombeeClient
from recombee_api_client.exceptions import APIException
from recombee_api_client.api_requests import SetItemValues, Batch


BATCH_SIZE = 1000

def main():
    load_dotenv(dotenv_path='.env')

    elastic_search_host = os.getenv("ELASTIC_SEARCH_HOST")
    es = Elasticsearch(
        [elastic_search_host],
        use_ssl=False)

    client = RecombeeClient(os.getenv("RECOMBEE_DATABASE_ID"),os.getenv("RECOMBEE_PRIVATE_TOKEN"))
    num_recipes = es.count(index=os.getenv("ELASTIC_SEARCH_INDEX"),body={"query": {"match_all": {}}})["count"]

    recipes = scan(client=es, index=os.getenv("ELASTIC_SEARCH_INDEX"), query={"query": {"match_all": {}}}, size = BATCH_SIZE, scroll='1ms')
    requests = [SetItemValues(
        recipe['_id'],
        {
            'title': recipe['_source']['title'],
            'ingredients': recipe['_source']['ingredients'],
            'link': recipe['_source']['link'],
            'image': recipe['_source']['image'],
            'tags': recipe['_source']['tags'],
            'total_time': recipe['_source']['total_time'],
            'rating': recipe['_source']['rating'],
            'time_acquired': recipe['_source']['time_acquired'],
        },
        cascade_create=True
    ) for recipe in recipes]
    client.send(Batch(requests))

if __name__ == "__main__":
    main()
