import {useState, useEffect} from 'react'

import API_URL from './api'


const Factura = ({productosFacturados}) => {
  return <div><table>
    <tr>
      <th>Producto</th>
      <th>Precio Unitario</th>
      <th>Cantidad Vendida</th>
      <th>Precio Total</th>
    </tr>
    {productosFacturados.map(pf => <tr>
      <td>{pf.producto.nombre}</td>
      <td>{pf.producto.precio}</td>
      <td>{pf.cantidad}</td>
      <td>$ {pf.cantidad * pf.producto.precio}</td>
    </tr>)}
  <tr>
    <th>Total</th>
    <td></td>
    <td></td>
    <th>{productosFacturados.reduce((acum, pf) =>
      (acum + pf.cantidad * pf.producto.precio), 0)
    }</th>
  </tr>
  </table>
  <hr/>
  </div>
}

const Comprobante = ({facturas}) => {
  return <>{facturas.map(fact => (<Factura productosFacturados={fact.productos_facturados}/>)
  )}</>
}

const Comprobantes = () => {
  const [comprobantes, setComprobantes] = useState([])

  const retrieve_comprobantes = async () => {
    try {
      const response = await fetch(`${API_URL}/comprobantes`, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("auth_token"),
        }
      });
      if (response.ok)
        setComprobantes(await response.json())
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    retrieve_comprobantes()
  }, [])

  return <>{comprobantes.map((c,i) => <Comprobante key={i} facturas={c.facturas}/>)}</>
}

export default Comprobantes;