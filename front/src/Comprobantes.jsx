import {useState, useEffect} from 'react'
import { useAuth } from './Auth'
import { COP } from './global'

import API_URL from './api'


const Factura = ({factura}) => {
  return <div>
  <h3>Facturado en: {factura.punto.nombre}</h3>
  <table>
    <tr>
      <th>Producto</th>
      <th>Precio Unitario</th>
      <th>Cantidad Vendida</th>
      <th>Precio Total</th>
    </tr>
    {factura.productos_facturados.map(pf => <tr>
      <td>{pf.producto.nombre}</td>
      <td>{COP.format(pf.producto.precio)}</td>
      <td>{pf.cantidad}</td>
      <td>{COP.format(pf.cantidad * pf.producto.precio)}</td>
    </tr>)}
  <tr>
    <th>Total</th>
    <td></td>
    <td></td>
    <th>{COP.format(factura.productos_facturados.reduce((acum, pf) =>
      (acum + pf.cantidad * pf.producto.precio), 0))
    }</th>
  </tr>
  </table>
  <hr/>
  </div>
}

const Comprobante = ({facturas, dia}) => {
  return <div>
    <h2>Comprobante {dia}</h2>
    <div>{facturas.map(fact => (<Factura factura={fact}/>))}</div>
  </div>
}

const Comprobantes = () => {
  const [comprobantes, setComprobantes] = useState([])
  const { token } = useAuth()

  const retrieve_comprobantes = async () => {
    try {
      const response = await fetch(`${API_URL}/comprobantes`, {
        headers: {
          "Authorization": "Bearer " + token
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
  console.log(comprobantes)

  return <>{comprobantes.map((c,i) => <Comprobante key={i} dia={c.dia} facturas={c.facturas}/>)}</>
}

export default Comprobantes;