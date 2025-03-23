from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from models import Usuario, engine
from sqlmodel import Session, select

app = FastAPI()
session = Session(engine)

@app.get("/api/usuarios/{id}")
async def get_user(id: int):
    return session.exec(select(Usuario)
                        .where(Usuario.id == id)).first()

@app.get("/api/usuarios")
async def get_users():
    return [
        usuario for usuario in
        session.exec(select(Usuario))
    ]

@app.post("/api/usuarios")
async def create_user(usuario: Usuario):
    session.add(usuario)
    session.commit()
    return usuario

app.mount("/", StaticFiles(directory="../front/dist"), name="frontend")

