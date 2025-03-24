from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from models import UsuarioBase, UsuarioCreate, Usuario, Comprobante, engine
from sqlmodel import Session, select

app = FastAPI()
session = Session(engine)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")

def fake_hash(s: str) -> str:
    return "fakehash" + s

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    user = session.exec(select(Usuario)
        .where(Usuario.nombre == token[8:])
    ).first()
    return user

# Login stuff

@app.post("/api/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = session.exec(
        select(Usuario)
            .where(Usuario.nombre == form_data.username)
            .where(Usuario.password_hash == fake_hash(form_data.password))
    ).first()
    if user is None:
        raise HTTPException(status_code=400, detail="Credenciales de acceso incorrectos.")
    return {"access_token": user.nombre, "token_type": "bearer"}

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
async def create_comprobante(comprobante: Comprobante,
                             user: Annotated[Usuario, Depends(get_current_user)]):
    session.add(comprobante)
    session.commit()
    return comprobante

@app.get("/api/comprobantes", response_model=list[Comprobante])
async def get_comprobantes():
    return session.exec(select(Comprobante)).all()
    

# Mandar al front todas las requests que no son de la API
app.mount("/", StaticFiles(directory="../front/dist"), name="frontend")

