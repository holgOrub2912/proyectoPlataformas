#!/usr/bin/env python3

from sqlmodel import Field, Relationship, Session, SQLModel, create_engine, Enum, Column
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

    comprobante: "Comprobante" = Relationship(back_populates="facturas")
    productos_facturados: list["ProductoFacturado"] = Relationship(
        back_populates="factura"
    )

class FacturaOnReq(SQLModel):
    productos_facturados: list["ProductoFacturadoDetails"]

class FacturaCreate(SQLModel):
    productos_facturados: list["ProductoFacturado"]

class Producto(SQLModel, table=True):
    id: int = Field(primary_key=True)
    nombre: str
    precio: int

class Comprobante(SQLModel, table=True):
    id: int = Field(primary_key=True)
    id_usuario: int = Field(foreign_key="usuario.id")

    usuario: "Usuario" = Relationship(back_populates="comprobantes")
    facturas: list["Factura"] = Relationship(
        back_populates="comprobante"
    )

class ComprobanteOnReq(SQLModel):
    facturas: list["FacturaOnReq"]

class ProductoFacturado(SQLModel, table=True):
    id_producto: int = Field(foreign_key="producto.id"
                                            , primary_key=True)
    id_factura: int = Field(foreign_key="factura.id"
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

if __name__ == "__main__":
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)
