import API_URL from './api';
import {useState, useEffect, useReducer} from 'react';
import { useAuth } from './Auth';
import Combobox from 'react-widgets/Combobox';

const nuevaRutaReducer = (nuevaRuta, action) => {
  switch (action.type) {
    case 'create': {
      return {nombre: '', puntos: []}
    }
    case 'change_nombre': {
      return {...nuevaRuta, nombre: action.text};
    }
    case 'add_punto': {
      return {...nuevaRuta, puntos: [...nuevaRuta.puntos, {
        id: null,
        nombre: ''
      }]}
    }
    case 'change_punto': {
      return {...nuevaRuta, puntos: nuevaRuta.puntos.with(action.index, {
        id: action.id,
        nombre: action.nombre
      })}
    }
    case 'reset': {
      return null
    }
  }
};

const RutaPath = ({ruta: {nombre, puntos}, dia}) => {
  return <>
    <h3>Ruta {nombre} {dia && <span>dia</span>}</h3>
    {puntos.map((p, i) => <span key={i}>{p.nombre}</span>)}
  </>
}

const Rutas = ({}) => {
  const {user, token} = useAuth();
  const [rutas, setRutas] = useState([]);
  const [puntos, setPuntos] = useState([]);
  const [nuevaRuta, dispatch] = useReducer(nuevaRutaReducer, null);

  const retrieveInfo = async(endpoint, callback) => {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`);
      if (response.ok)
        callback(await response.json())
      else
        throw Error("Error al obtener información del servidor.")
    } catch (e) {
      console.log(e);
    }
  };

  const guardarRuta = async () => {
    try {
      const response = await fetch(`${API_URL}/rutas`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevaRuta)
      })
      dispatch({type: 'reset'});
      retrieveInfo('rutas', setRutas);
    } catch (e) {
      console.log(e)
    }
  };

  useEffect(() => {
    retrieveInfo(user.role == 0 ? `assignedRoutes/${user.id}` : 'rutas',
                 setRutas);
    retrieveInfo('puntos', setPuntos);
  }, []);

  return <>
    <div>
      {rutas.length > 0 
        ? rutas.map((ruta, i) =>
          <RutaPath key={i} ruta={ruta.ruta || ruta} dia={ruta.dia}/>)
        : <h2>No hay rutas para mostrar</h2>}
    </div>
    <div>
      {user.role == 1 && nuevaRuta
        ? <div>
            <input type='text'
                   value={nuevaRuta.nombre}
                   onChange={e => dispatch({type: 'change_nombre',
                                            text: e.target.value})}
                   placeholder='Nombre de ruta'/>
            <div>
              {nuevaRuta.puntos.map((p,i) => <Combobox
                key={i}
                dataKey='id'
                value={p.nombre}
                data={puntos}
                textField='nombre'
                onChange={value => dispatch({type: 'change_punto',
                                             id: value.id || null,
                                             index: i,
                                             nombre: value.nombre || value})}
              />)}
            </div>
          <div>
            <button onClick={() => dispatch({type: 'add_punto'})}>
              Añadir punto
            </button>
            <button onClick={() => guardarRuta()}>Guardar ruta</button>
          </div>
          </div>
        : <button onClick={() => dispatch({type: 'create'})}>+</button>}
    </div>
  </>
};

export default Rutas;
