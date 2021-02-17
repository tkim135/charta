import os
import sys
import yaml

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


def query_data(service_account_key_path, collection_name):
    try:
        cred = credentials.Certificate(service_account_key_path)
        firebase_admin.initialize_app(cred)

        db = firestore.client()

        doc_ref = db.collection(collection_name)

        docs = doc_ref.where(u'Title', u'==', u'Programming Abstractions').stream()

        for doc in docs:
            print(f'{doc.id} => {doc.to_dict()}')

    except Exception as error:
        print("\nERROR: {}".format(str(error)))
    else:
        print("\nQuery complete")


if __name__ == '__main__':
    try:
        if len(sys.argv) == 3:
            service_account_path = sys.argv[1]
            name_of_collection = sys.argv[2]
        else:
            service_account_path = input("Path to serviceAccountKey.json: ")
            name_of_collection = input("Name of collection: ")
        query_data(service_account_path, name_of_collection)
    except KeyboardInterrupt as keyboard_error:
        print("\nProcess interrupted")
    finally:
        print("\nGood Bye!")