from models import *

sample_products = [
    Producto(nombre="Galletas", precio="5000"),
    Producto(nombre="Lecho descremada", precio="9000"),
    Producto(nombre="Queso cremoso", precio="3940"),
    Producto(nombre="Yogurt", precio="7000"),
]

if __name__ == "__main__":
    with Session(engine) as session:
        for product in sample_products:
            session.add(product)
        session.commit()
