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

const RutaPath = ({puntos, nombre}) => {
  return <div className="m-2">
    <h3 className="text-xl font-bold">{nombre}</h3>
    <div className="flex flex-wrap flex-col md:flex-row items-end">
      {puntos.map((p, i) => <div
        className="md:py-3 flex md:flex-col"
        key={i}
      >
        <div className="text-lg font-thin py-2 px-10">{p}</div>
        <div className="flex flex-col md:flex-row items-center">
          <div
            className="border-r-3 h-1/2 md:border-b-3 md:w-1/2 border-lime-200"
          />
          <div className="h-3 w-3 border-3 rounded-full border-lime-200"/>
          <div
            className="border-l-3 h-1/2 md:border-b-3 md:w-1/2 border-lime-200"
          />
        </div>
      </div>)}
    </div>
  </div>
}

const Rutas = ({}) => {
  const {user, token} = useAuth();
  const [rutas, setRutas] = useState([]);
  const [puntos, setPuntos] = useState([]);
  const [nuevaRuta, dispatch] = useReducer(nuevaRutaReducer, null);
  const [visibleMenus, setVisibleMenus] = useState([]);

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

  const nuevaRutaNombreInpt = nuevaRuta && <input type='text'
                   value={nuevaRuta.nombre}
                   onChange={e => dispatch({type: 'change_nombre',
                                            text: e.target.value})}
                   placeholder='Nombre de ruta'/>;

  const nuevaRutaPuntosInpts = nuevaRuta &&
    nuevaRuta.puntos.map((p,i) => <Combobox
                  key={i*2 + 1*visibleMenus[i]}
                  hideEmptyPopup
                  onFocus={() => setVisibleMenus(visibleMenus.with(i, true))}
                  onBlur={() => setVisibleMenus(visibleMenus.with(i, false))}
                  placeholder="Punto"
                  hideCaret
                  listProps={visibleMenus[i]
                    ? {className: "absolute bg-white text-md shadow-xl"}
                    : {className: "hidden"}
                  }
                  renderListItem={({item}) => (
                    <div className="hover:cursor-pointer hover:bg-gray-100 px-2 py-1">
                      {visibleMenus[i] && item.nombre}
                    </div>
                  )}
                  dataKey='id'
                  value={p.nombre}
                  data={puntos}
                  textField='nombre'
                  onChange={value => dispatch({type: 'change_punto',
                                               id: value.id || null,
                                               index: i,
                                               nombre: value.nombre || value})}
                  />);

  return <>
    <div>
      {rutas.length > 0 
        ? rutas.map((ruta, i) =>
          <RutaPath
            key={i}
            nombre={ruta.ruta ? ruta.ruta.nombre : ruta.nombre}
            puntos={(ruta.ruta
              ? ruta.ruta.puntos
              : ruta.puntos).map(({nombre}) => nombre)
              }
          />)
        : <h2>No hay rutas para mostrar</h2>}
    </div>
    <div>
      {user.role == 1 && nuevaRuta
        ? <div>
            <RutaPath nombre={nuevaRutaNombreInpt} puntos={nuevaRutaPuntosInpts}/>
            <button onClick={() => {setVisibleMenus([...visibleMenus, true]); dispatch({type: 'add_punto'})}}>
              Añadir punto
            </button>
            <button onClick={() => guardarRuta()}>Guardar ruta</button>
          </div>
        : <button onClick={() => dispatch({type: 'create'})}>+</button>}
    </div>
  </>
};

export default Rutas;
