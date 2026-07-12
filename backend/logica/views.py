from ninja import Router
from .schemas import *
from .models import *
# Create your views here.

router = Router()


def _arte_to_schema(arte: Arte) -> ArteSchema:
    return ArteSchema(
        id=arte.id,
        name=arte.nome,
        tipoarte=TipoArteSchema(id=arte.tipoarte.id, name=arte.tipoarte.nome),
        description=arte.descricao,
        foto=arte.foto,
    )


def _resolve_tipoarte(tipo_input: TipoArteSchema) -> TipoArte:
    if tipo_input.id:
        return TipoArte.objects.get(id=tipo_input.id)
    return TipoArte.objects.get(nome=tipo_input.name)

@router.get("/artes")
def listar_artes(request):
    artes = Arte.objects.all()
    return [_arte_to_schema(arte) for arte in artes]

@router.post("/artes")
def criar_arte(request, arte: ArteInputSchema):
    tipoarte = _resolve_tipoarte(arte.tipoarte)
    nova_arte = Arte.objects.create(
        nome=arte.name,
        tipoarte=tipoarte,
        descricao=arte.description,
        foto=arte.foto,
    )
    return _arte_to_schema(nova_arte)

@router.get("/artes/{id}")
def obter_arte(request, id: int):
    try:
        arte = Arte.objects.get(id=id)
        return _arte_to_schema(arte)
    except Arte.DoesNotExist:
        return {"error": "Arte não encontrada"}

@router.put("/artes/{id}")
def atualizar_arte(request, id: int, arte: ArteInputSchema):
    try:
        arte_existente = Arte.objects.get(id=id)
        tipoarte = _resolve_tipoarte(arte.tipoarte)
        arte_existente.nome = arte.name
        arte_existente.tipoarte = tipoarte
        arte_existente.descricao = arte.description
        arte_existente.foto = arte.foto
        arte_existente.save()
        return _arte_to_schema(arte_existente)
    except Arte.DoesNotExist:
        return {"error": "Arte não encontrada"}

@router.patch("/artes/{id}")
def atualizar_parcial_arte(request, id: int, arte: ArtePatchSchema):
    try:
        arte_existente = Arte.objects.get(id=id)
        if arte.name:
            arte_existente.nome = arte.name
        if arte.tipoarte:
            tipoarte = _resolve_tipoarte(arte.tipoarte)
            arte_existente.tipoarte = tipoarte
        if arte.description:
            arte_existente.descricao = arte.description
        if arte.foto:
            arte_existente.foto = arte.foto
        arte_existente.save()
        return _arte_to_schema(arte_existente)
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
    return [TipoArteSchema(id=tipo.id, name=tipo.nome) for tipo in tipos_arte]

@router.post("/tiposarte")
def criar_tipo_arte(request, tipo: TipoArteSchema):
    nova_tipo = TipoArte.objects.create(nome=tipo.name)
    return TipoArteSchema(id=nova_tipo.id, name=nova_tipo.nome)

@router.get("/tiposarte/{id}")
def obter_tipo_arte(request, id: int):
    try:
        tipo = TipoArte.objects.get(id=id)
        return TipoArteSchema(id=tipo.id, name=tipo.nome)
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