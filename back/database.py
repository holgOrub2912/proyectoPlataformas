from sqlalchemy import create_engine

engine = create_engine("postgresql+psycopg2://postgres@localhost/jarana", echo=True)
