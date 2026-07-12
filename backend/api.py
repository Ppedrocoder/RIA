from ninja import NinjaAPI
from logica.views import router as logica_router

api = NinjaAPI()

api.add_router("/logica/", logica_router)