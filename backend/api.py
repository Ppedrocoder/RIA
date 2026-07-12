from ninja_extra import NinjaExtraAPI
from logica.schemas import RegistroUsuarioSchema
from logica.views import router as logica_router
from logica.models import Usuario
from ninja_jwt.controller import NinjaJWTDefaultController
from ninja_jwt.authentication import JWTAuth

api = NinjaExtraAPI()

api.register_controllers(NinjaJWTDefaultController)

@api.post("/registro/")
def registrar_usuario(request, data: RegistroUsuarioSchema):
    if Usuario.objects.filter(username=data.username).exists():
        return api.create_response(request, {"detail": "Este nome de usuário já está em uso."}, status=400)
        
    if Usuario.objects.filter(email=data.email).exists():
        return api.create_response(request, {"detail": "Este e-mail já está em uso."}, status=400)

    usuario = Usuario.objects.create_user(
        username=data.username,
        email=data.email,
        password=data.password
    )

    return {"success": True, "message": f"Usuário {usuario.username} criado com sucesso!"}

@api.get("/perfil/", auth=JWTAuth())
def ver_perfil(request):
    return {
        "id": request.user.id,
        "username": request.user.username,
        "email": request.user.email
    }

api.add_router("/logica/", logica_router)