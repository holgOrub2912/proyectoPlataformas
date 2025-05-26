import { useState, useEffect, useId } from 'react'
import {getInfo} from './global'
import API_URL from './api'
import { useAuth } from './Auth'
import moment from 'moment';
import { DocumentCurrencyDollarIcon, PlusIcon } from '@heroicons/react/24/solid';

const replace = (arr, index, by) => arr.map((e, i) => (i == index) ? by : e)
const replace_attr = (arr, index, attr, by) =>
  replace(arr, index, {...arr[index], [attr]: by})

const ProductBox = ({ availableProducts
                    , selId
                    , setSelId
                    , quantity
                    , setQuantity}) => {
  return <div className="flex flex-nowrap my-2 justify-between">
  <select value={selId} onChange={e => setSelId(parseInt(e.target.value))}>
    {availableProducts.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
  </select>
  <input value={quantity}
  type="number" onChange={e => setQuantity(parseInt(e.target.value))}/>  
  </div>
}

const FacturaBox = ({availableProducts
                   , availablePuntos
                   , id_punto
                   , setPunto
                   , productosFacturados
                   , setProductosFacturados}) => {
  const puntoId = useId();
  return <div className="h-full text-center m-2 border-gray-200 border-1 shadow-md rounded-sm">
      <label  className="flex justify-between p-2 md:p-5 text-lg md-2 bg-gray-100" htmlFor={puntoId}>
        Punto de venta
        <select id={puntoId}
                className="ml-3"
                value={id_punto}
                onChange={e => setPunto(parseInt(e.target.value))}>{availablePuntos.map(p => 
          <option value={p.id} key={p.id}>{p.nombre}</option>
        )}</select>
      </label>
    <div className="flex mx-2 md:mx-5 flex-col my-2">
    {productosFacturados.map((p, i) =>
    <ProductBox availableProducts={availableProducts}
                key={i}
                selId={p.id_producto}
                setSelId={id => setProductosFacturados(replace_attr(
                    productosFacturados, i, "id_producto", id
                ))}
                quantity={p.cantidad}
                setQuantity={qt => setProductosFacturados(replace_attr(
                    productosFacturados, i, "cantidad", qt
                ))}
    />
  )}</div>
  <button
    className="my-2"
    onClick={e =>
    setProductosFacturados([...productosFacturados, {id_producto: 1, cantidad: 1}])}
  >
    Nuevo Producto
    <PlusIcon className="inline ml-2 w-5"/>
  </button>
  </div>
  
}

const post_comprobante = async (facturas, token) => {
  console.log(JSON.stringify(facturas))
  try {
    const response = await fetch(`${API_URL}/comprobantes`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(facturas)
    })
  } catch (e) {
    console.log(e)
  }
}

const GenerarComprobante = () => {
  const [products, setProducts] = useState([])
  const [facturas, setFacturas] = useState([])
  const [puntos, setPuntos] = useState([])
  const { user, token } = useAuth()

  const retrieve_products = async () => {
    const response = await fetch(`${API_URL}/productos`);
    if (response.ok)
      setProducts(await response.json())
  }

  useEffect(() => {
    retrieve_products();
    const today = moment().format("YYYY-MM-DD")
    getInfo(`assignedRoutes/${user.id}/${today}`,
      ({puntos}) => setPuntos(puntos));
    }, []);

  return <div><div className="flex mb-5 items-stretch flex-wrap flex-row">
    {facturas.map((f, i) => <div key={i}>
      <FacturaBox key={i}
                  availableProducts={products}
                  productosFacturados={f.productos_facturados}
                  id_punto={f.id_punto}
                  availablePuntos={puntos}
                  setPunto={id => setFacturas(replace_attr(facturas, i, 'id_punto', id))}
                  setProductosFacturados={prods => setFacturas(replace_attr(
                    facturas, i, 'productos_facturados', prods))}
                  />
      </div>
  )}</div>
  <div className="flex flex-row justify-between">
    <button
      onClick={e => setFacturas([...facturas, {id_punto: 1, productos_facturados: []}])}
    >
    Nueva Factura <DocumentCurrencyDollarIcon className="inline w-5"/>
    </button>
    <button onClick={e => post_comprobante(facturas, token)}>Enviar</button>
  </div>
  </div>
}

export default GenerarComprobante;
