import { createContext } from 'react'
import Login from './Login'
import GenerarComprobante from './GenerarComprobante'
import Comprobantes from './Comprobantes'
import AllComprobantes from './AllComprobantes'

export const COP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
});

export const tiposUsuario = [
  ['Comprobantes', 'Generar Comprobante', 'Soporte'],
  ['Comprobantes Generados', 'Programacion', 'Configuración'],
  ['Productos', 'Contacto']
]


export const RoleContext = createContext(null);
export const optionContent = {
    'Ver Reportes': { 
      route: '/reportes',
      content: 'Reportes del sistema',
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
      route: '/rutas',
      content: <GenerarComprobante/>
    },
    'Historial': { 
      route: '/historial',
      content: 'Historial de actividades',
    },
    'Soporte': { 
      route: '/soporte',
      content: 'Formulario de soporte técnico',
    },
    'Productos': { 
      route: '/productos',
      content: 'Catálogo de informacion',
    },
    'Comprobantes Generados': {
      route: '/gencomprobantes',
      content: <AllComprobantes/>
    },
    'Contacto': { 
      route: '/contacto',
      content: 'Información de contacto'
    },
};
