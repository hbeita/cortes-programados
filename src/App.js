import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";

function App() {
  const [nise, setNise] = useState("");
  const [data, setData] = useState(null);
  const [dayMessage, setDayMessage] = useState("");

  useEffect(() => {
    const fetchDay = async () => {
      // hardcoding 101 for now since is just our zone
      try {
        const response = await axios.get(
          `https://apps.grupoice.com/Servicios/rac/texto/101`
        );
        setDayMessage(response.data.valor);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchData = async () => {
      if (!nise) {
        return;
      }
      try {
        const response = await axios.get(
          `https://apps.grupoice.com/Servicios/rac/1/${nise}`
        );
        setData(response.data);
        Cookies.set("nise", nise, { expires: 30 }); // Set cookie to expire in 7 days
        fetchDay();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const savedNise = Cookies.get('nise');
    if (savedNise) {
      setNise(savedNise);
    }
    fetchData();
  }, [nise]);

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
        };
        mergedData[niseKey].horarios = [item.horario];
      }
    });
    return Object.values(mergedData);
  };

  const handleInputChange = (e) => {
    setNise(e.target.value);
    Cookies.set("nise", e.target.value, { expires: 30 }); // Set cookie to expire in 7 days
  }

  return (
    <div className="container mx-auto py-8">
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-700">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-4">
            Racionamientos de energía programados
          </h2>

          <div class="relative flex h-10 w-full min-w-[200px] max-w-[24rem]">
            <button
              class="!absolute right-1 top-1 z-10 select-none rounded bg-yellow-500 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-yellow-500/20 transition-all hover:shadow-lg hover:shadow-yellow-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-blue-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none"
              type="button"
              data-ripple-light="true"
            >
              Buscar
            </button>
            <input
              type="email"
              class="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-yellow-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
              placeholder=" "
              value={nise}
              onChange={handleInputChange}
              required
            />
            <label class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-yellow-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-yellow-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-yellow-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              NISE
            </label>
          </div>
          {data && (
            <div className="mt-4 border rounded p-4 align-center">
              {mergeDataWithSameNise(data).map((mergedItem, index) => (
                <div key={index} className="p-4 mb-4">
                  <h3 className="text-lg font-semibold mb-2">
                    NISE: {mergedItem.id.nise}
                  </h3>
                  <p>
                    <strong>Tipo de Plan:</strong> {mergedItem.tipoPlan}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {mergedItem.id.fecha}
                  </p>
                  <p>
                    <strong>Medidor:</strong> {mergedItem.medidor}
                  </p>
                  <p className="pt-4">{dayMessage}</p>
                  <p>
                    <strong>{mergedItem.horarios.join(", ")}</strong>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
