from ninja import Schema

class TipoArteSchema(Schema):
    nome: str

class ArteSchema(Schema):
    nome: str
    tipoarte: TipoArteSchema
    descricao: str
    foto: str