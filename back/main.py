from typing import Annotated
import jwt
from jwt.exceptions import InvalidTokenError
from datetime import datetime, timedelta, timezone, date
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from models import *
from sqlmodel import Session, select
from sqlalchemy.exc import NoResultFound
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
    user: Usuario

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

async def get_current_driver(user: Annotated[Usuario, Depends(get_current_user)]):
    if user.role != UserRole.DRIVER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sólo usuarios de de rol conductor están autorizados a acceder a este recurso."
        )
    return user

async def get_current_admin(user: Annotated[Usuario, Depends(get_current_user)]):
    if user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sólo usuarios de de rol conductor están autorizados a acceder a este recurso."
        )
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
    return Token(access_token=access_token, token_type="bearer", user=user)

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
        'role': usuario.role,
        'nombre': usuario.nombre,
        'password_hash': get_password_hash(usuario.password)
    }))
    session.commit()
    return usuario

# Endpoints de comprobantes

@app.post("/api/comprobantes/{dia}")
async def create_day_comprobante(
    dia: date,
    facturas: list[FacturaCreate],
    user: Annotated[Usuario, Depends(get_current_driver)]
) -> Comprobante:
    comprobante = Comprobante(
        facturas = [
            Factura(
                id_punto=f.id_punto,
                productos_facturados=[ProductoFacturado.model_validate(pf)
                    for pf in f.productos_facturados]
            ) for f in facturas],
        id_usuario = user.id,
        dia = dia
    )
    session.add(comprobante)
    session.commit()
    session.refresh(comprobante)
    return comprobante

@app.post("/api/comprobantes")
async def create_comprobante(
    facturas: list[FacturaCreate],
    user: Annotated[Usuario, Depends(get_current_driver)]
) -> Comprobante:
    return await create_day_comprobante(dia=date.today(), facturas=facturas, user=user)


@app.get("/api/comprobantes", response_model=list[ComprobanteOnReq])
async def get_comprobantes(
    user: Annotated[Usuario, Depends(get_current_user)]):
    query = select(Comprobante)
    if user.role == UserRole.DRIVER:
        query = query.where(Comprobante.id_usuario == user.id)
    query = query.order_by(Comprobante.dia.desc())
    return [ComprobanteOnReq.model_validate(comprobante)
        for comprobante in session.exec(query).all()]

# Endpoints de productos
@app.get("/api/productos")
async def get_productos() -> list[Producto]:
    return session.exec(select(Producto)).all()

@app.post("/api/productos")
async def create_producto(
    producto: ProductoCreate,
    user: Annotated[Usuario, Depends(get_current_admin)]
) -> Producto:
    producto = Producto.model_validate(producto)
    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto

def query_if_not_id(model, seq):
    """Bind the instances of a model with an id to an actual database
    entry. Leave the ones without id alone."""
    retrieved = session.exec(
        select(model).where(model.id.in_([m.id for m in seq if m.id is not None]))
    ).all()

    for m in seq:
        if m.id is None:
            yield m
        else:
            yield next(r for r in retrieved if r.id == m.id)

# Endpoints de rutas
@app.post("/api/rutas")
async def create_ruta(
    ruta: RutaCreate,
    user: Annotated[Usuario, Depends(get_current_admin)]
) -> Ruta:
    ruta.puntos = [PuntoEnRuta(pos=i, punto=p) for i,p in enumerate(query_if_not_id(Punto, ruta.puntos))]
    ruta = Ruta.model_validate(ruta)
    session.add(ruta)
    session.commit()
    session.refresh(ruta)
    return ruta

@app.get("/api/rutas")
async def get_rutas() -> list[RutaOnReq]:
    query = select(Ruta)
    return [RutaOnReq(nombre=r.nombre,
                      puntos=[p.punto for p in
                      sorted(r.puntos, key=lambda p: p.pos)])
              for r in session.exec(query).all()]

@app.post("/api/assignedRoutes")
async def post_assigned_ruta(
    enlace: RutaUsuarioEnlace,
    user: Annotated[Usuario, Depends(get_current_admin)]
) -> RutaUsuarioEnlace:
    session.add(enlace)
    session.commit()
    session.refresh(enlace)
    return enlace

@app.get("/api/assignedRoutes/{user_id}")
async def get_assigned_rutas(
    user_id: int
) -> list[RutaUsuarioEnlaceOnReq]:
    query = select(RutaUsuarioEnlace) \
        .where(RutaUsuarioEnlace.id_usuario == user_id) \
        .order_by(RutaUsuarioEnlace.dia.desc())
    return [RutaUsuarioEnlaceOnReq(
        dia=re.dia,
        ruta=RutaOnReq(
            nombre=re.ruta.nombre,
            puntos=[p.punto for p in sorted(re.ruta.puntos, key=lambda p: p.pos)])
        ) for re in session.exec(query).all()]

@app.get("/api/assignedRoutes/{user_id}/{day}")
async def get_day_ruta(
    user_id: int,
    day: date
) -> RutaOnReq:
    query = select(RutaUsuarioEnlace) \
        .where(RutaUsuarioEnlace.id_usuario == user_id) \
        .where(RutaUsuarioEnlace.dia == day)
    try:
        ruta = session.exec(query).one().ruta
        return RutaOnReq(
            nombre=ruta.nombre,
            puntos=[p.punto for p in sorted(ruta.puntos, key=lambda p: p.pos)]
        )
    except NoResultFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se pudo encontrar la ruta especificada"
        )

# Endpoints de punto de ruta

@app.get("/api/puntos")
async def get_puntos() -> list[Punto]:
    return session.exec(select(Punto)).all()

# Mandar al front todas las requests que no son de la API
app.mount("/", StaticFiles(directory="../front/dist"), name="frontend")
