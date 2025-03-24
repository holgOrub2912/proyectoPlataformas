from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from models import Usuario, Comprobante, engine
from sqlmodel import Session, select

app = FastAPI()
session = Session(engine)

# Endpoints de Usuario

@app.get("/api/usuarios/{id}")
async def get_user(id: int):
    return session.exec(select(Usuario)
                        .where(Usuario.id == id)).first()

@app.get("/api/usuarios", response_model=list[Usuario])
async def get_users():
    return session.exec(select(Usuario)).all()

@app.post("/api/usuarios")
async def create_user(usuario: Usuario):
    session.add(usuario)
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

