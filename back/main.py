from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from models import UsuarioBase, UsuarioCreate, Usuario, Comprobante, engine
from sqlmodel import Session, select

app = FastAPI()
session = Session(engine)

def fake_hash(s: str) -> str:
    return "fakehash" + s

# Endpoints de Usuario

@app.get("/api/usuarios/{id}", response_model=UsuarioBase)
async def get_user(id: int):
    return session.exec(select(Usuario)
                        .where(Usuario.id == id)).first()

@app.get("/api/usuarios", response_model=list[Usuario])
async def get_users():
    return session.exec(select(Usuario)).all()

@app.post("/api/usuarios")
async def create_user(usuario: UsuarioCreate):
    session.add(Usuario.model_validate({
        'cedula': usuario.cedula,
        'nombre': usuario.nombre,
        'password_hash': fake_hash(usuario.password)
    }))
    session.commit()
    return usuario

# Endpoints de comprobantes

@app.post("/api/comprobantes")
async def create_comprobante(comprobante: Comprobante):
    session.add(comprobante)
    session.commit()
    return comprobante

@app.get("/api/comprobantes", response_model=list[Comprobante])
async def get_comprobantes():
    return session.exec(select(Comprobante)).all()
    

# Mandar al front todas las requests que no son de la API
app.mount("/", StaticFiles(directory="../front/dist"), name="frontend")

