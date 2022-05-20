import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import './css/tailwind.css';
import './css/App.css';
import About from './views/About';

// const { ipcRenderer } = window.electron.ipcRenderer.require('electron');

// import { ipcRenderer } from 'electron';

const Hello = () => {
  const [port, setPort] = useState('3000');
  const [results, setResults] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);

  // window.electron.ipcRenderer.once('run-port-search', (result) => {
  //   console.log(result, 'result');
  // });

  const handlePortChange = async () => {
    window.electron.ipcRenderer.sendMessage('run-port-search', port);

    window.electron.ipcRenderer.once('run-port-search', (result) => {
      const data = [];
      result.forEach((process) => {
        const processInfo = process.split(' ');
        const processName = processInfo[0];
        const processPID = processInfo[1];
        const processUser = processInfo[2];
        const processExtra = processInfo[8];

        data.push({
          processName,
          processPID,
          processUser,
          processExtra,
        });
      });

      const processUniqueByPID = [
        ...new Map(
          data.map((process) => [process.processPID, process])
        ).values(),
      ];

      setResults(processUniqueByPID);

      if (processUniqueByPID.length === 0) {
        setIsEmpty(true);
      } else {
        setIsEmpty(false);
      }
    });
  };

  const stopPID = (pid) => {
    window.electron.ipcRenderer.sendMessage('run-port-stop', pid);
    window.electron.ipcRenderer.once('run-port-stop', () => {
      handlePortChange();
    });
  };

  return (
    <div>
      <main className="text-gray-200 h-screen overflow-hidden">
        <div className="p-6">
          <section>
            <div className="content-body">
              <div className="flex items-center mb-4 space-x-3">
                <input
                  type="text"
                  placeholder="Port"
                  className="form-control w-full border border-gray-200 shadow-sm"
                  value={port}
                  onChange={(event) => {
                    setPort(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handlePortChange();
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn primary large"
                  onClick={() => {
                    handlePortChange();
                  }}
                >
                  Search
                </button>
              </div>

              {results.length > 0 && (
                <div className="relative overflow-x-auto border border-gray-100 rounded">
                  <table className="w-full text-sm text-left text-gray-800">
                    <thead className="text-xs text-gray-800 uppercase bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Process
                        </th>
                        <th scope="col" className="px-6 py-3">
                          PID
                        </th>
                        <th scope="col" className="px-6 py-3">
                          {' '}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((item) => (
                        <tr
                          key={item.processPID}
                          className="bg-white border-b border-gray-100"
                        >
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                          >
                            <h3 className="font-extrabold text-lg">
                              {item.processName}
                            </h3>
                            <h4 className="text-xs text-gray-400">
                              {item.processUser}
                            </h4>
                            <h4 className="text-xs text-gray-400">
                              {item.processExtra}
                            </h4>
                          </th>
                          <td className="px-6 py-4 font-extrabold text-xl">
                            {item.processPID}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              className="btn primary"
                              onClick={() => {
                                stopPID(item.processPID);
                              }}
                            >
                              STOP
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {isEmpty && (
                <div className="text-center text-gray-600 p-12 w-full">
                  <h2 className="text-2xl font-extrabold">
                    Nothing running on this port.
                  </h2>
                  <h4>Hopefully this is a good thing!</h4>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}
