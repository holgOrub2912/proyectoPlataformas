import { getInfo } from './global';
import {useState, useEffect} from 'react';
import {useAuth} from './Auth';
import moment from 'moment';
import { LineChart, BarChart, Line, Bar, Rectangle, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const gen_days = (n) => {
  let days = [];
  for (let i = 0; i < n; i++){
    days.push(moment().subtract(i, 'days'))
  }
  return days.reverse()
};

const totalPriceFact = ({productos_facturados: pf}) => pf
  .reduce((accum, prod) => accum + prod.producto.precio * prod.cantidad, 0);

const totalPrice = ({facturas}) => facturas
  .reduce((accum, fact) => accum + totalPriceFact(fact), 0);

const totalProdsFact = ({productos_facturados: pf}) => pf
  .reduce((accum, prod) => accum + prod.cantidad, 0);

const totalProds = ({facturas}) => facturas
  .reduce((accum, fact) => accum + totalPriceFact(fact), 0);

const totalVentas = comprobantes => comprobantes
  .reduce((accum, c) => accum + totalProds(c), 0);

const genDayDataset = (days, comprobantes) => {
  return days.map(d => ({
    name: d.format("DD/MM"),
    ventas: totalVentas(comprobantes
      .filter(c => d.isSame(c.dia, 'day'))
    )
  }));
};

const genDriverDataset = (since, comprobantes) => {
  const groupedComprobantes = Object.groupBy(
    comprobantes
      .filter(({dia}) => since.isSameOrBefore(dia, 'day')),
    ({usuario}) => usuario.nombre)

  return Object.keys(groupedComprobantes).map(driverName => ({
    name: driverName,
    ventas: totalVentas(groupedComprobantes[driverName])
  }));
}

const genPuntoDataset = (since, comprobantes) => {
  const groupedFacturas = Object.groupBy(
    comprobantes
      .filter(({dia}) => since.isSameOrBefore(dia, 'day'))
      .map(({facturas}) => facturas)
      .flat(),
    ({punto}) => punto.nombre
  );
  return Object.keys(groupedFacturas).map(nombrePunto => ({
    name: nombrePunto,
    ventas: totalProds({facturas: groupedFacturas[nombrePunto]})
  }));
};

const Reportes = ({}) => {
  const [comprobantes, setComprobantes] = useState([]);
  const [numberDays, setNumberDays] = useState(7);
  const { token } = useAuth();

  useEffect(() => {
    getInfo('comprobantes', setComprobantes, token)
  }, [token]);

  const days = gen_days(numberDays);
  const dayData = genDayDataset(days, comprobantes);
  const driverData = genDriverDataset(days[0], comprobantes);
  const puntosData = genPuntoDataset(days[0], comprobantes)
  // console.log(days)
  // console.log(comprobantes);
  // console.log(gen_dataset(days, comprobantes));
  // console.log(numberDays)

  return <div>
    <div className="text-center">
      <h2 className="inline mr-5 text-xl font-thin">Reportes del sistema</h2>
      <select className="inline" value={numberDays} onChange={e => setNumberDays(e.target.value)}>
        <option className="" value={7}>Última semana</option>
        <option value={30}>Último mes</option>
      </select>
    </div>
    <div className="flex flex-row flex-wrap items-center justify-center">
      <LineChart
        className="border-gray-200 border-2 pt-5 m-5"
        width={600}
        height={400}
        data={dayData}
        margin={{
          left: 30
        }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="ventas" stroke="#A3E635" activeDot={{ r: 8 }} />
      </LineChart>
      <BarChart
        className="border-gray-200 border-2 pt-5 m-5"
        width={600}
        height={400}
        data={driverData}
        margin={{
          left: 30
        }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar type="monotone" fill="#A3E635" dataKey="ventas" activeBar={<Rectangle fill="black"/>} />
      </BarChart>
      <BarChart
        width={600}
        height={400}
        className="border-gray-200 border-2 pt-5 m-5"
        data={puntosData}
        margin={{
          left: 30
        }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar type="monotone" fill="#A3E635" dataKey="ventas" activeBar={<Rectangle fill="black"/>} />
      </BarChart>
    </div>
  </div>;
};
export default Reportes
