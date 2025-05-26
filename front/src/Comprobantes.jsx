import {useState, useEffect} from 'react'
import { useAuth } from './Auth'
import { COP } from './global'

import API_URL from './api'


const Factura = ({factura}) => {
  return <div className="my-2">
  <h3 className="text-center bg-gray-100 font-thin">Facturado en: {factura.punto.nombre}</h3>
  <table className="w-full">
    <tr className="border-b-1 border-gray-300">
      <th className="w-20 p-2">Producto</th>
      <th className="w-20 p-2">Precio Unitario</th>
      <th className="w-20 p-2">Cantidad Vendida</th>
      <th className="w-20 p-2">Precio Total</th>
    </tr>
    {factura.productos_facturados.map(pf => <tr>
      <td className="p-2">{pf.producto.nombre}</td>
      <td className="p-2">{COP.format(pf.producto.precio)}</td>
      <td className="p-2">{pf.cantidad}</td>
      <td className="p-2">{COP.format(pf.cantidad * pf.producto.precio)}</td>
    </tr>)}
  <tr className="border-t-1 border-gray-300">
    <th>Total</th>
    <td></td>
    <td></td>
    <th className="p-2">{COP.format(factura.productos_facturados.reduce((acum, pf) =>
      (acum + pf.cantidad * pf.producto.precio), 0))
    }</th>
  </tr>
  </table>
  </div>
}

const Comprobante = ({facturas, dia}) => {
  return <div className="md:m-4 bg-gray-50 rounded-md shadow-sm">
    <h2 className="my-2 text-center text-lg font-bold" key="title">{dia}</h2>
    <div key="facturas">{facturas.map(fact => (<Factura key={fact.id} factura={fact}/>))}</div>
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

  return <div className="flex flex-wrap content-start items-start">
    {comprobantes.map((c,i) => <Comprobante
      key={i}
      dia={c.dia}
      facturas={c.facturas}
    />)}
    </div>
}

export default Comprobantes;