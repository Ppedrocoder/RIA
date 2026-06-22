from ninja import Router
from .schemas import *
from .models import *
# Create your views here.

router = Router()

@router.get("/artes")
def listar_artes(request):
    artes = Arte.objects.all()
    return [ArteSchema(nome=arte.nome, tipoarte=TipoArteSchema(nome=arte.tipoarte.nome), descricao=arte.descricao, foto=arte.foto.url) for arte in artes]

@router.post("/artes")
def criar_arte(request, arte: ArteSchema):
    tipoarte = TipoArte.objects.get(nome=arte.tipoarte.nome)
    nova_arte = Arte.objects.create(nome=arte.nome, tipoarte=tipoarte, descricao=arte.descricao, foto=arte.foto)
    return ArteSchema(nome=nova_arte.nome, tipoarte=TipoArteSchema(nome=nova_arte.tipoarte.nome), descricao=nova_arte.descricao, foto=nova_arte.foto.url)

@router.get("/artes/{id}")
def obter_arte(request, id: int):
    try:
        arte = Arte.objects.get(id=id)
        return ArteSchema(nome=arte.nome, tipoarte=TipoArteSchema(nome=arte.tipoarte.nome), descricao=arte.descricao, foto=arte.foto.url)
    except Arte.DoesNotExist:
        return {"error": "Arte não encontrada"}

@router.put("/artes/{id}")
def atualizar_arte(request, id: int, arte: ArteSchema):
    try:
        arte_existente = Arte.objects.get(id=id)
        tipoarte = TipoArte.objects.get(nome=arte.tipoarte.nome)
        arte_existente.nome = arte.nome
        arte_existente.tipoarte = tipoarte
        arte_existente.descricao = arte.descricao
        arte_existente.foto = arte.foto
        arte_existente.save()
        return ArteSchema(nome=arte_existente.nome, tipoarte=TipoArteSchema(nome=arte_existente.tipoarte.nome), descricao=arte_existente.descricao, foto=arte_existente.foto.url)
    except Arte.DoesNotExist:
        return {"error": "Arte não encontrada"}

@router.patch("/artes/{id}")
def atualizar_parcial_arte(request, id: int, arte: ArteSchema):
    try:
        arte_existente = Arte.objects.get(id=id)
        if arte.nome:
            arte_existente.nome = arte.nome
        if arte.tipoarte:
            tipoarte = TipoArte.objects.get(nome=arte.tipoarte.nome)
            arte_existente.tipoarte = tipoarte
        if arte.descricao:
            arte_existente.descricao = arte.descricao
        if arte.foto:
            arte_existente.foto = arte.foto
        arte_existente.save()
        return ArteSchema(nome=arte_existente.nome, tipoarte=TipoArteSchema(nome=arte_existente.tipoarte.nome), descricao=arte_existente.descricao, foto=arte_existente.foto.url)
    except Arte.DoesNotExist:
        return {"error": "Arte não encontrada"}

@router.delete("/artes/{id}")
def deletar_arte(request, id: int):
    try:
        arte = Arte.objects.get(id=id)
        arte.delete()
        return {"message": "Arte deletada com sucesso"}
    except Arte.DoesNotExist:
        return {"error": "Arte não encontrada"}
        
@router.get("/tiposarte")
def listar_tipos_arte(request):
    tipos_arte = TipoArte.objects.all()
    return [TipoArteSchema(nome=tipo.nome) for tipo in tipos_arte]

@router.post("/tiposarte")
def criar_tipo_arte(request, tipo: TipoArteSchema):
    nova_tipo = TipoArte.objects.create(nome=tipo.nome)
    return TipoArteSchema(nome=nova_tipo.nome)

@router.get("/tiposarte/{id}")
def obter_tipo_arte(request, id: int):
    try:
        tipo = TipoArte.objects.get(id=id)
        return TipoArteSchema(nome=tipo.nome)
    except TipoArte.DoesNotExist:
        return {"error": "Tipo de arte não encontrado"}
    
@router.delete("/tiposarte/{id}")
def deletar_tipo_arte(request, id: int):
    try:
        tipo = TipoArte.objects.get(id=id)
        tipo.delete()
        return {"message": "Tipo de arte deletado com sucesso"}
    except TipoArte.DoesNotExist:
        return {"error": "Tipo de arte não encontrado"}