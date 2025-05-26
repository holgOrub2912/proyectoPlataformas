import API_URL from './api';
import {useState, useEffect} from 'react';
import {useAuth} from './Auth';
import {COP, getInfo, postInfo} from './global';
import Table from 'rc-table';

const Productos = ({}) => {
  const {user, token} = useAuth();
  const [products, setProducts] = useState([]);
  const [addingProduct, setAddingProduct] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');

  const setAndFormatProducts = (products) => setProducts(products.map(p => ({
    ...p,
    precio: COP.format(p.precio),
  })));

  const setOnlyNumbers = (input) =>
    setNewProductPrice(input.replaceAll(/[^0-9]/g, ''));

  const saveProduct = () => {
    postInfo('productos', {nombre: newProductName,
                           precio: newProductPrice},
             token, () => {getInfo('productos', setAndFormatProducts);
                           setAddingProduct(false);}
            );
  };

  useEffect(() => {
    getInfo('productos', setAndFormatProducts);
  }, []);

  const inputClasses = "my-1 mx-2";

  const newProductRow = {id: -1,
     nombre: <input value={newProductName}
                    placeholder="Nombre"
                    className={inputClasses}
                    onChange={e => setNewProductName(e.target.value)}
                    type='text'/>,
     precio: <input value={newProductPrice}
                    onChange={e => setOnlyNumbers(e.target.value)}
                    placeholder="Precio"
                    className={inputClasses}
                    type='text'/>}

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      className: 'py-1',
      key: 'precio',
    },
  ];

  return <div className="flex flex-col items-center">
    <Table
      rowKey={'id'}
      className="text-center my-3"
      columns={columns}
      data={[...products, addingProduct && newProductRow]}
      rowClassName={(c,i) => "border-t-1 " + ((i % 2 == 1) ? " bg-gray-100" : "")}
    />
    {user && user.role == 1 && (addingProduct
      ? <button onClick={saveProduct}>Guardar Producto</button>
      : <button onClick={() => setAddingProduct(true)}>Añadir Producto</button>)
    }
  </div>
};

export default Productos;
