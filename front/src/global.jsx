import { createContext } from 'react'

export const tiposUsuario = {
  admin: ['Ver Reportes', 'Programacion', 'Configuración'],
  cliente: ['Mis rutas', 'Historial', 'Soporte'],
  invitado: ['Productos', 'Contacto']
};


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
    'Mis rutas': { 
      route: '/rutas',
      content: 'Tus rutas recientes',
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
    'Contacto': { 
      route: '/contacto',
      content: 'Información de contacto'
    },
};
