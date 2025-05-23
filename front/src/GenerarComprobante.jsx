import { useState, useEffect } from 'react'
import API_URL from './api'
import { useAuth } from './Auth'

const replace = (arr, index, by) => arr.map((e, i) => (i == index) ? by : e)
const replace_attr = (arr, index, attr, by) =>
  replace(arr, index, {...arr[index], [attr]: by})

const ProductBox = ({ availableProducts
                    , selId
                    , setSelId
                    , quantity
                    , setQuantity}) => {
  return <label>
  <select value={selId} onChange={e => setSelId(parseInt(e.target.value))}>
    {availableProducts.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
  </select>
  <input value={quantity} type="number" onChange={e => setQuantity(parseInt(e.target.value))}/>  
  </label>
}

const FacturaBox = ({availableProducts
                   , productosFacturados
                   , setProductosFacturados}) => {

  return <div><div>{productosFacturados.map((p, i) =>
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
  <button onClick={e =>
    setProductosFacturados([...productosFacturados, {id_producto: 1, cantidad: 1}])}>+</button>
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
  const { token } = useAuth()

  const retrieve_products = async () => {
    const response = await fetch(`${API_URL}/productos`);
    if (response.ok)
      setProducts(await response.json())
  }

  useEffect(() => {retrieve_products()}, []);

  return <div><div>{facturas.map((f, i) => <div key={i}>
    <FacturaBox key={i}
                availableProducts={products}
                productosFacturados={f.productos_facturados}
                setProductosFacturados={prods => setFacturas(replace(
                  facturas, i, ({productos_facturados: prods})
                ))}/>
    <hr/></div>
  )}</div>
  <button onClick={e => setFacturas([...facturas, {productos_facturados: []}])}>+</button>
  <button onClick={e => post_comprobante(facturas, token)}>Enviar</button>
  </div>
}

export default GenerarComprobante;
