import { useState } from 'preact/hooks';

interface IEndPoint {
  project: string;
  version: string;
  method: string;
  endPoint: string;
}

const Devtools = () => {
  const [endPoints, setEndPoints] = useState<IEndPoint[]>([]);
  const [project, setProject] = useState<string>('');
  const [version, setVersion] = useState<string>('');
  const [method, setMethod] = useState<string>('');
  const [endPoint, setEndPoint] = useState<string>('');

  return (
    <div className='-mx-3 flex h-screen flex-1 flex-col justify-center p-8 text-center text-lg'>
      <div className='flex'>
        <input
          className=' mx-3 block w-full flex-1 appearance-none rounded border-2 border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none'
          placeholder='project'
          value={project}
          onChange={(e: any) => setProject(e.target?.value)}
        />
        <input
          className='mx-3 block w-full flex-1 appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
          placeholder='version'
          value={version}
          onChange={(e: any) => setVersion(e.target?.value)}
        />

        <select
          className='focus:shadow-outline bg-gray-200px-4 block flex-1 appearance-none rounded border border-gray-400 py-2  leading-tight text-gray-700 shadow hover:border-gray-500 focus:outline-none'
          value={method}
          onChange={(e: any) => setMethod(e.target?.value)}
          defaultValue='GET'
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
      </div>
      <input
        className='m-3 w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 py-2 px-4 leading-tight text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none'
        placeholder='your end point'
        value={endPoint}
        onChange={(e: any) => setEndPoint(e.target?.value)}
      />

      <button
        className='mx-3 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700'
        onClick={() => {
          setEndPoints([
            ...endPoints,
            {
              project,
              version,
              method,
              endPoint,
            },
          ]);
          setProject('');
          setVersion('');
          setMethod('');
          setEndPoint('');
        }}
      >
        Button
      </button>

      <div>
        <h1 className='text-2xl'>End Points</h1>
        <table className='table-auto border-collapse border border-slate-400'>
          <thead>
            <tr>
              <th className='border-b p-4 pl-8 pt-0 pb-3 text-left text-slate-800 dark:border-slate-600 dark:text-slate-200'>
                Project
              </th>
              <th className='border-b p-4 pl-8 pt-0 pb-3 text-left text-slate-800 dark:border-slate-600 dark:text-slate-200'>
                Version
              </th>
              <th className='border-b p-4 pl-8 pt-0 pb-3 text-left text-slate-800 dark:border-slate-600 dark:text-slate-200'>
                Method
              </th>
              <th className='border-b p-4 pl-8 pt-0 pb-3 text-left text-slate-800 dark:border-slate-600 dark:text-slate-200'>
                End Point
              </th>
            </tr>
          </thead>
          <tbody className='bg-white dark:bg-slate-800'>
            {endPoints.map((endPoint: IEndPoint) => (
              <tr key={`${project}${version}${method}${endPoints}`}>
                <td className='border-b border-slate-100 p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400'>
                  {endPoint.project}
                </td>
                <td className='border-b border-slate-100 p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400'>
                  {endPoint.version}
                </td>
                <td className='border-b border-slate-100 p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400'>
                  {endPoint.method}
                </td>
                <td className='border-b border-slate-100 p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400'>
                  {endPoint.endPoint}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='flex flex-col'>
          {endPoints.map((endPoint: IEndPoint) => (
            <div
              className='flex'
              key={`${project}${version}${method}${endPoints}`}
            >
              <div className='flex-1'>{endPoint.project}</div>
              <div className='flex-1'>{endPoint.version}</div>
              <div className='flex-1'>{endPoint.method}</div>
              <div className='flex-1'>{endPoint.endPoint}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

let extPanelWindow: Window | undefined;
const SPECIAL_CASE_URL = {
  NO_URI: '~NO_API~',
};

function getHeaderString(headers: Headers): string {
  let responseHeader = '';
  headers.forEach((header, key) => {
    responseHeader += `${key}:${header}\n`;
  });
  return responseHeader;
}

async function ajaxMe(
  url: string,
  headers: Headers,
  method: string,
  postData: string,
  success: (response: any) => void,
  error: (response: any) => void
): Promise<void> {
  const finalResponse: any = {};
  const response = await fetch(url, {
    method,
    mode: 'cors',
    headers,
    redirect: 'follow',
    body: postData,
  });
  finalResponse.response = await response.text();
  finalResponse.headers = getHeaderString(response.headers);
  if (response.ok) {
    success(finalResponse);
  } else {
    error(finalResponse);
  }
}

function replaceResponse(
  response: string,
  filteredData: any[],
  callback: (response: string) => void
): void {
  filteredData.forEach(filteredDatum => {
    const find = new RegExp(filteredDatum.find, 'g');
    response = response.replace(find, filteredDatum.replace);
  });
  callback(response);
}

function checkURLTagged(url: string, replaceData: any[]): any[] {
  return replaceData.filter(replaceDatum => {
    if (replaceDatum.url === SPECIAL_CASE_URL.NO_URI) {
      return new URL(url).pathname === '/';
    }
    return url.includes(replaceDatum.url);
  });
}

function submitResponse(filteredData: any, continueParams: any): void {
  const responseLines: string[] = [];
  if (filteredData.contentType) {
    responseLines.push(`Content-Type: ${filteredData.contentType}`);
  }
  continueParams.responseCode = 200;
  continueParams.binaryResponseHeaders = btoa(
    `Content-Type: ${filteredData.contentType}`
  );
  continueParams.body = btoa(
    unescape(encodeURIComponent(filteredData.replace))
  );
  chrome.debugger.sendCommand(debugee, 'Fetch.fulfillRequest', continueParams);
}

let debugee: chrome.debugger.Debuggee;
function setupDebugger(target: any): void {
  debugee = { tabId: target.id };

  chrome.debugger.attach(debugee, '1.0', () => {
    chrome.debugger.sendCommand(debugee, 'Fetch.enable', {
      patterns: [{ urlPattern: '*' }],
    });
  });

  chrome.debugger.onEvent.addListener((source, method, params: any) => {
    const request = params.request;
    const continueParams: any = {
      requestId: params.requestId,
    };
    if (source.tabId === target.id) {
      if (method === 'Fetch.requestPaused') {
        chrome.storage.local.get('replaceData', storageData => {
          const filteredData = checkURLTagged(
            params.request.url,
            storageData.replaceData
          );
          if (filteredData.length > 0) {
            if (filteredData[0].find === '~NO_API~') {
              submitResponse(filteredData[0], continueParams);
            } else {
              ajaxMe(
                request.url,
                request.headers,
                request.method,
                request.postData,
                data => {
                  replaceResponse(data.response, filteredData, replacedData => {
                    continueParams.responseCode =
                      filteredData[0].status > 0
                        ? parseInt(filteredData[0].status)
                        : 200;
                    continueParams.binaryResponseHeaders = btoa(
                      unescape(
                        encodeURIComponent(
                          data.headers.replace(/(?:\r\n|\r|\n)/g, '\0')
                        )
                      )
                    );
                    continueParams.body = btoa(
                      unescape(encodeURIComponent(replacedData))
                    );
                    chrome.debugger.sendCommand(
                      debugee,
                      'Fetch.fulfillRequest',
                      continueParams
                    );
                  });
                },
                status => {
                  chrome.debugger.sendCommand(
                    debugee,
                    'Fetch.continueRequest',
                    continueParams
                  );
                }
              );
            }
          } else {
            chrome.debugger.sendCommand(
              debugee,
              'Fetch.continueRequest',
              continueParams
            );
          }
        });
      }
    }
  });
}

function setupActions(): void {
  extPanelWindow?.addEventListener('message', event => {
    if (event.source !== extPanelWindow) {
      return;
    }
    const message = event.data;
    if (message && message.source !== 'override-debug') {
      return;
    }
    switch (message.action) {
      case 'start': {
        startOverride();
        break;
      }
      case 'stop': {
        destroyDebugger();
      }
    }
  });
}

function startOverride(): void {
  const queryOptions = { active: true, currentWindow: true };
  chrome.tabs.query(queryOptions, tab => {
    setupDebugger(tab[0]);
  });
}

export function pinTab(panelWindow: Window): void {
  extPanelWindow = panelWindow;
  setupActions();
}

function destroyDebugger(): void {
  chrome.debugger.detach(debugee);
}

function init() {
  document.addEventListener('DOMContentLoaded', function (event) {
    document.getElementById('start')?.addEventListener('click', () => {
      window.postMessage(
        {
          action: 'start',
          source: 'override-debug',
        },
        '*'
      );
    });
    document.getElementById('stop')?.addEventListener('click', () => {
      window.postMessage(
        {
          action: 'stop',
          source: 'override-debug',
        },
        '*'
      );
    });
  });
}

init();

export default Devtools;
