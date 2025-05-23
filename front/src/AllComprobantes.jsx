import { useState, useEffect } from 'react';
import { COP } from './global'
import { useAuth } from './Auth';
import Table from 'rc-table';
const API_URL = import.meta.env.VITE_API_URL;

const totalPriceFact = ({productos_facturados: pf}) => pf
  .reduce((accum, prod) => accum + prod.producto.precio * prod.cantidad, 0);

const totalPrice = ({facturas}) => facturas
  .reduce((accum, fact) => accum + totalPriceFact(fact), 0);

const totalProdsFact = ({productos_facturados: pf}) => pf
  .reduce((accum, prod) => accum + prod.cantidad, 0);

const totalProds = ({facturas}) => facturas
  .reduce((accum, fact) => accum + totalProdsFact(fact), 0);

const AllComprobantes = ({}) => {
  const {token} = useAuth();
  const [comprobantes, setComprobantes] = useState([]);

  const retrieveComprobantes = async () => {
    try {
      const response = await fetch(`${API_URL}/comprobantes`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      if (response.ok){
        setComprobantes((await response.json()).map(comprobante => ({
          nombreUsuario: comprobante.usuario.nombre,
          cedulaUsuario: comprobante.usuario.cedula,
          precio: COP.format(totalPrice(comprobante)),
          productos: totalProds(comprobante),
        })));
      
      }
    } catch (err) {
      console.log("Error");
      console.log(err);
    }
  };

  useEffect(() => {
    retrieveComprobantes()
  }, []);

  const columns = [
    {
      title: 'Conductor',
      dataIndex: 'nombreUsuario',
      key: 'nombreUsuario',
    },
    {
      title: 'Cédula',
      dataIndex: 'cedulaUsuario',
      key: 'cedulaUsuario',
    },
    {
      title: 'Total facturado',
      dataIndex: 'precio',
      key: 'precio',
    },
    {
      title: 'Productos Facturados',
      dataIndex: 'productos',
      key: 'productos',
    },
  ];

  return <Table columns={columns} data={comprobantes}/>
};

export default AllComprobantes;
