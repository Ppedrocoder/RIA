from typing import Optional
from ninja import Schema


class TipoArteSchema(Schema):
    id: Optional[int] = None
    name: str


class ArteSchema(Schema):
    id: int
    name: str
    tipoarte: TipoArteSchema
    description: str
    foto: str


class ArteInputSchema(Schema):
    name: str
    tipoarte: TipoArteSchema
    description: str
    foto: str


class ArtePatchSchema(Schema):
    name: Optional[str] = None
    tipoarte: Optional[TipoArteSchema] = None
    description: Optional[str] = None
    foto: Optional[str] = None