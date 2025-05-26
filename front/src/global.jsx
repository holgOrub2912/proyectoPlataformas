import { createContext } from 'react'
import Login from './Login'
import GenerarComprobante from './GenerarComprobante'
import Comprobantes from './Comprobantes'
import Rutas from './Rutas'
import AllComprobantes from './AllComprobantes'
import Productos from './Productos'
import Reportes from './Reportes'
import Soporte from './Soporte'
import API_URL from './api'

export const COP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
});

export const tiposUsuario = [
  ['Mis Rutas', 'Comprobantes', 'Generar Comprobante', 'Soporte'], // Driver
  ['Rutas', 'Comprobantes Generados', 'Productos', 'Reportes'], // Admin
  ['Productos', 'Contacto']
]


export const RoleContext = createContext(null);
export const optionContent = {
    'Reportes': { 
      route: '/reportes',
      content: <Reportes/>,
    },
    'Programacion': { 
      route: '/programacion',
      content: 'Panel de administración de fletes',
    },
    'Configuración': { 
      route: '/configuracion',
      content: 'Ajustes del sistema',
    },
    'Iniciar Sesion': {
      route: '/login',
      content: <Login/>
    },
    'Comprobantes': {
      route: '/comprobantes',
      content: <Comprobantes/>
    },
    'Generar Comprobante': { 
      route: '/addcomprobante',
      content: <GenerarComprobante/>
    },
    'Historial': { 
      route: '/historial',
      content: 'Historial de actividades',
    },
    'Soporte': { 
      route: '/soporte',
      content: <Soporte/>
    },
    'Productos': { 
      route: '/productos',
      content: <Productos/>
    },
    'Comprobantes Generados': {
      route: '/gencomprobantes',
      content: <AllComprobantes/>
    },
    'Contacto': {
      route: '/contacto',
      content: 'Información de contacto'
    },
    'Rutas': {
      route: '/rutas',
      content: <Rutas/>
    },
    'Mis Rutas': {
      route: '/rutas',
      content: <Rutas/>
    }
};

export const getInfo = async(endpoint, callback, token) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        ...(token && {"Authorization": "Bearer " + token})
      },
    });
    if (response.ok)
      callback(await response.json())
    else
      throw Error("Error al obtener información del servidor.")
  } catch (e) {
    console.log(e);
  }
};

export const postInfo = async(endpoint, obj, token, callback) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
        ...(token && {"Authorization": "Bearer " + token})
      },
      body: JSON.stringify(obj)
    })
    if (response.ok && callback)
      callback(await response.json());
    else
      throw Error('Error al crear el objeto.')
  } catch (e) {
    console.log(e)
  }
};
