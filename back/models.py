#!/usr/bin/env python3
from typing import List
from database import engine
from sqlalchemy import create_engine
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import Integer
from sqlalchemy import Float
from sqlalchemy import ForeignKey
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

class Base(DeclarativeBase):
    pass

class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(primary_key=True)
    cedula: Mapped[int] = mapped_column(Integer())
    nombre: Mapped[str] = mapped_column(String(30))

    comprobantes: Mapped[List["Comprobante"]] = relationship(
        back_populates="usuario", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"User(id={self.id!r}, nombre={self.name!r})"

class Factura(Base):
    __tablename__ = "facturas"
    id: Mapped[int] = mapped_column(primary_key=True)
    id_comprobante: Mapped[int] = mapped_column(ForeignKey("comprobantes.id"))

    comprobante: Mapped["Comprobante"] = relationship(back_populates="facturas")
    productos_vendidos: Mapped[List["ProductoFacturado"]] = relationship()

class Producto(Base):
    __tablename__ = "productos"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(40))
    precio: Mapped[int] = mapped_column(Float())

class Comprobante(Base):
    __tablename__ = "comprobantes"

    id: Mapped[int] = mapped_column(primary_key=True)
    id_usuario: Mapped[int] = mapped_column(ForeignKey("usuarios.id"))

    usuario: Mapped["User"] = relationship(back_populates="comprobantes")
    facturas: Mapped[List["Facturas"]] = relationship(
        back_populates="comprobante", cascade="all, delete-orphan"
    )

class ProductoFacturado(Base):
    __tablename__ = "producto_facturado"
    id_producto: Mapped[int] = mapped_column(ForeignKey("productos.id")
                                            , primary_key=True)
    id_factura: Mapped[int] = mapped_column(ForeignKey("facturas.id")
                                            , primary_key=True)
    cantidad: Mapped[int] = mapped_column(Integer())

    producto: Mapped["Producto"] = relationship()

if __name__ == "__main__":
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine, checkfirst=False)
