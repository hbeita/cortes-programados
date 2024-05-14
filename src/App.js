import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';

function App() {
  const [nise, setNise] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    const savedNise = Cookies.get('nise');
    if (savedNise) {
      setNise(savedNise);
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://apps.grupoice.com/Servicios/rac/1/${nise}`);
      setData(response.data);
      Cookies.set('nise', nise, { expires: 7 }); // Set cookie to expire in 7 days
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const mergeDataWithSameNise = (data) => {
    const mergedData = {};
    data.forEach((item) => {
      const niseKey = item.id.nise;
      if (mergedData[niseKey]) {
        mergedData[niseKey].horarios.push(item.horario);
        mergedData[niseKey].tipoPlan += `, ${item.id.tipoPlan}`;
      } else {
        mergedData[niseKey] = {
          ...item,
          tipoPlan: item.id.tipoPlan,
        }
        mergedData[niseKey].horarios = [item.horario];
      }
    });
    return Object.values(mergedData);
  };

  return (
    <div className="container mx-auto py-8">
      <input
        type="text"
        className="border rounded py-2 px-4"
        placeholder="Enter NISE"
        value={nise}
        onChange={(e) => setNise(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded ml-2"
        onClick={fetchData}
      >
        Search
      </button>
      {data && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Results:</h2>
          {mergeDataWithSameNise(data).map((mergedItem, index) => (
            <div key={index} className="border rounded p-4 mb-4">
              <h3 className="text-lg font-semibold mb-2">NISE: {mergedItem.id.nise}</h3>
              <p><strong>Tipo de Plan:</strong> {mergedItem.tipoPlan}</p>
              <p><strong>Fecha:</strong> {mergedItem.id.fecha}</p>
              <p><strong>Medidor:</strong> {mergedItem.medidor}</p>
              <p><strong>Sub Estación:</strong> {mergedItem.sub_estacion}</p>
              <p><strong>Horarios:</strong> {mergedItem.horarios.join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
