#!/usr/bin/env python3

from sqlmodel import Field, Relationship, Session, SQLModel, create_engine, Enum, Column
from datetime import date
import enum

engine = create_engine("postgresql+psycopg2://postgres@localhost/jarana")

class UserRole(enum.Enum):
    DRIVER = 0
    ADMIN = 1

class UsuarioBase(SQLModel):
    cedula: int
    role: UserRole = Field(sa_column=Column(Enum(UserRole), default=UserRole.DRIVER))
    nombre: str = Field(index=True)

class Usuario(UsuarioBase, table=True):
    id: int = Field(default=None, primary_key=True)
    password_hash: str

    comprobantes: list["Comprobante"] = Relationship(back_populates="usuario")

class UsuarioCreate(UsuarioBase):
    password: str

class Factura(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    id_comprobante: int = Field(default=None, foreign_key="comprobante.id")
    id_punto: int = Field(foreign_key="punto.id")

    punto: "Punto" = Relationship()
    comprobante: "Comprobante" = Relationship(back_populates="facturas")
    productos_facturados: list["ProductoFacturado"] = Relationship(
        back_populates="factura"
    )

class FacturaOnReq(SQLModel):
    productos_facturados: list["ProductoFacturadoDetails"]
    punto: "Punto"

class FacturaCreate(SQLModel):
    productos_facturados: list["ProductoFacturadoCreateFromFact"]
    id_punto: int

class ProductoCreate(SQLModel):
    nombre: str
    precio: int

class Producto(ProductoCreate, table=True):
    id: int = Field(default=None, primary_key=True)

class Comprobante(SQLModel, table=True):
    id: int = Field(primary_key=True)
    id_usuario: int = Field(foreign_key="usuario.id")
    dia: date = Field(default_factory=date.today)

    usuario: "Usuario" = Relationship(back_populates="comprobantes")
    facturas: list["Factura"] = Relationship(
        back_populates="comprobante"
    )

class ComprobanteOnReq(SQLModel):
    facturas: list["FacturaOnReq"]
    usuario: "Usuario"

class ProductoFacturado(SQLModel, table=True):
    id_producto: int = Field(foreign_key="producto.id"
                                            , primary_key=True)
    id_factura: int = Field(default=None, foreign_key="factura.id"
                                            , primary_key=True)
    cantidad: int

    producto: "Producto" = Relationship()
    factura: Factura = Relationship(back_populates="productos_facturados")

class ProductoFacturadoDetails(SQLModel):
    producto: Producto
    cantidad: int

class ProductoFacturadoCreateFromFact(SQLModel):
    id_producto: int
    cantidad: int

class PuntoEnRuta(SQLModel, table=True):
    id_ruta: int = Field(default=None, foreign_key="ruta.id", primary_key=True)
    pos: int = Field(default=None, primary_key=True)
    id_punto: int = Field(default=None, foreign_key="punto.id")
    
    punto: "Punto" = Relationship()
    ruta: "Ruta" = Relationship(back_populates="puntos")

class RutaUsuarioEnlace(SQLModel, table=True):
    id_ruta: int = Field(default=None, foreign_key="ruta.id", primary_key=True)
    id_usuario: int = Field(default=None, foreign_key="punto.id", primary_key=True)
    dia: date = Field(primary_key=True)

    ruta: "Ruta" = Relationship()

class RutaUsuarioEnlaceOnReq(SQLModel):
    dia: date
    ruta: "RutaOnReq"

class Ruta(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    nombre: str = Field(default=None, index=True)
    puntos: list[PuntoEnRuta] = Relationship(back_populates="ruta")

class RutaOnReq(SQLModel):
    nombre: str
    puntos: list["Punto"]

class RutaCreate(SQLModel):
    nombre: str = Field(default=None, index=True)
    puntos: list["Punto"]

class Punto(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    nombre: str = Field(default=None)

if __name__ == "__main__":
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)
