import {useState, useEffect, useId} from 'react';
import Calendar from 'react-widgets/Calendar';
import {useAuth} from './Auth';
import moment from 'moment';
import {getInfo, postInfo} from './global';
import Modal from 'react-modal';

const AssignRouteDialog = ({ruta, close, ...props}) => {
  const [drivers, setDrivers] = useState([]);
  const [selUser, setSelUser] = useState(0);
  const [date, setDate] = useState("");
  const {token} = useAuth();

  const driverSelId = useId();

  const assignRoute = () => {
    postInfo('assignedRoutes', {
      id_ruta: ruta.id,
      id_usuario: selUser,
      dia: date
    }, token, close)
  };

  useEffect(() => {
    getInfo('usuarios', (users) => {
      let filteredUsers = users.filter(u => u.role == 0);
      setDrivers(filteredUsers);
      setSelUser(filteredUsers[0].id);
    });
  }, []);

  return <Modal
    className="w-full h-full flex justify-center items-center"
    {...props}>
      <div className="flex flex-col bg-white shadow-xl p-4 border-1 border-gray-300 rounded-lg">
        <h1 className="mx-2 text-xl font-thin text-center">Asignar ruta
          <b className="ml-2">{ruta && ruta.nombre}</b></h1>
        <div className="m-3 w-full">
          <input
            type="date"
            value={date}
            min={moment().subtract(1, 'days').format("YYYY-MM-DD")}
            onChange={e => setDate(e.target.value)}
          />
          <label className="inline-block m-4" htmlFor={driverSelId}>
            <b>Conductor:</b>
            <select className="ml-2" id={driverSelId} value={selUser} onChange={e => setSelUser(e.target.value)}>
              {drivers.map(driver => <option 
                Key={driver.id}
                value={driver.id}
              >{driver.nombre}
              </option>)}
            </select>
          </label>
        </div>
        <button onClick={assignRoute}>Asignar</button>
      </div>
  </Modal>;
};

export default AssignRouteDialog;
