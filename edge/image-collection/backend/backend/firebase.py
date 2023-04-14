import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate("./cred.json")
firebase_admin.initialize_app(cred)

from firebase_admin import firestore

db = firestore.client()
