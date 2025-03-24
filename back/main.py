from typing import Annotated
import jwt
from jwt.exceptions import InvalidTokenError
from datetime import datetime, timedelta, timezone
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from models import UsuarioBase, UsuarioCreate, Usuario, Comprobante \
                 , Comprobante, Producto, Factura, FacturaCreate \
                 , engine
from sqlmodel import Session, select
from passlib.context import CryptContext
from pydantic import BaseModel
import os

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportException:
    pass

secret_key = os.getenv("SECRET_KEY")
if len(secret_key) == 0:
    raise EnvironmentError()

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

origins = [
    "http://localhost:5173"
]

app = FastAPI()
session = Session(engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Token(BaseModel):
    access_token: str
    token_type: str

def fake_hash(s: str) -> str:
    return "fakehash" + s

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def authenticate_user(username: str, password: str):
    user = session.exec(
        select(Usuario)
            .where(Usuario.nombre == username)
    ).first()
    if not user:
        return False
    if not verify_password(password, user.password_hash):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, secret_key, algorithm=ALGORITHM)

@app.get("/api/whoami")
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar los credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, secret_key, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception
    user = session.exec(select(Usuario)
        .where(Usuario.nombre == username)
    ).first()
    return user

# Login stuff

@app.post("/api/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales de acceso no válidos.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.nombre}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

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
        'password_hash': get_password_hash(usuario.password)
    }))
    session.commit()
    return usuario

# Endpoints de comprobantes

@app.post("/api/comprobantes")
async def create_comprobante(
    facturas: list[FacturaCreate],
    user: Annotated[Usuario, Depends(get_current_user)]
) -> Comprobante:
    comprobante = Comprobante(
        facturas = [Factura.model_validate(factura)
            for factura in facturas],
        id_usuario = user.id
    )
    session.add(comprobante)
    session.commit()
    session.refresh(comprobante)
    return comprobante

@app.get("/api/comprobantes", response_model=list[Comprobante])
async def get_comprobantes():
    return session.exec(select(Comprobante)).all()

# Endpoints de productos
@app.get("/api/productos")
async def get_productos() -> list[Producto]:
    return session.exec(select(Producto)).all()

# Mandar al front todas las requests que no son de la API
app.mount("/", StaticFiles(directory="../front/dist"), name="frontend")
