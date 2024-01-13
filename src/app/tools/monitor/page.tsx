'use client';
import { useEffect, useState, KeyboardEvent } from 'react';
import { io, Socket } from 'socket.io-client';
// eslint-disable-next-line no-unused-vars
import style from './style.module.scss';
import { Container } from './Container';
import { CpuData } from './type';
import { CpuChart } from './CpuChart';
import { Card, CardBody, Input, Tab, Tabs } from '@nextui-org/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { set } from '@/features/monitor/tabSelectedSlice';

export default function ToolsPage() {
  const [ serverName, setServerName ] = useState('');
  const [ serverNameInput, setServerNameInput ] = useState('');
  const [ socket, setSocket ] = useState<Socket|null>(null);
  const [ readData, setReadData ] = useState(false);
  const [ totalDataSave, setTotalDataSave ] = useState(0);
  const selectedTabs = useSelector((state: RootState) => state.selectedTabMonitor.value);

  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const [ cpuData, setCpuData ]: [ CpuData, any ] = useState({
    name: '-',
    speed: 0,
    threads: 0,
    usage: 0,
    uptime: '-',
    cores: [ ],
    coresAll: [],
  } as CpuData);

  useEffect(() => {
    const socket = io('https://socket-monitor.xyrus10.com');
    setServerName(localStorage.getItem('serverName') ?? 'xyrus10-vps1');

    socket.on('connect', () => {
      setSocket(socket);
    });

    socket.on('receiveLog', async (msg:any) => {
      const datas: Array<any> = msg.logData;
      const storageData: any = [];
      const cpuUsageAll: Number[] = [];
      if (datas.length == 0) return setReadData(true);

      const jsonData = JSON?.parse(datas[0]?? []) ?? [];
      const cpuCount = jsonData.cpus.length;

      for (let index = 0; index < cpuCount; index++) {
        const storageName: String = `${jsonData.target}-cpu-${index}`;
        storageData[storageName as keyof typeof storageData] = [];
      }

      for await (const data of datas) {
        const jsonData = JSON.parse(data);
        const cpus: Number[] = jsonData.cpus;
        const storageNameCpuAll: String = `${jsonData.target}-cpu-all`;

        cpus.forEach((cpu, index) => {
          const storageName: String = `${jsonData.target}-cpu-${index}`;
          const storageValue = storageData[storageName as keyof typeof storageData];
          storageValue.push(cpu);
          storageData[storageName as keyof typeof storageData] = storageValue;
        });
        cpuUsageAll.push(Number((cpus.reduce((partialSum: any, a: any) => partialSum + a, 0) / cpus.length).toFixed(2)));
        storageData[storageNameCpuAll as keyof typeof storageData] = cpuUsageAll;
      }

      // eslint-disable-next-line guard-for-in
      for (const key in storageData) {
        localStorage.setItem(key, JSON.stringify(storageData[key]));
      }
      setReadData(true);


      // setReadData(true);
    });

    socket.on('receiveDataMetrics', (msg) => {
      const CPUS: Array<number> = msg.cpus;
      const CPU_NAME: string = msg?.['cpu-name'];
      const CPU_SPEED: number = msg?.['cpu-speed'];
      const CPU_CORES: Array<number> = msg?.['cpus'];
      if (totalDataSave == 0) setTotalDataSave(msg?.['total-data-save']);

      const cpusUsage = Number(parseFloat(CPUS.reduce((partialSum: any, a: any) => partialSum + a, 0)).toFixed(2)) / msg.cpus.length;
      if (readData) {
        setCpuData({
          name: CPU_NAME,
          speed: Number(CPU_SPEED),
          threads: msg?.['cpu-count'],
          usage: cpusUsage,
          uptime: msg?.uptime,
          cores: CPU_CORES,
          coresAll: [ cpusUsage ],
        } as CpuData);
      }
    });

    socket?.emit('getLog', {
      serverName: serverName,
    });

    socket?.emit('join', serverName);

    return () => {
      socket.close();
      socket.disconnect();
    };
  }, [ serverName, readData, totalDataSave ]);

  const serverKeyUpHandlers = (event:KeyboardEvent<HTMLInputElement>) => {
    const input = (event.target as HTMLInputElement);
    if (event.key === 'Escape') {
      input.blur();
    }
    if (event.key === 'Enter') {
      setServerName(input.value.trim());
      window.localStorage.setItem('serverName', input.value.trim());
      input.blur();
      setReadData(false);
      setTotalDataSave(0);
      socket?.emit('getLog', {
        serverName: serverName,
      });
      socket?.emit('join', serverName);
    }
  };

  type tabsType = {
    id: string,
    label: string,
    active?: boolean,
    content: React.ReactNode
  }[]

  const tabsData: tabsType = [
    {
      id: 'chart-percore',
      label: 'Per Core',
      content: <CpuChart
        id="perCpuChart1"
        name={serverName}
        cores={cpuData.cores as number[]}
        threads={cpuData.threads}
        dataLenght={totalDataSave}
      />,
    },
    {
      id: 'chart-overall',
      label: 'Over All',
      active: true,
      content: <CpuChart
        id="perCpuChart2"
        name={serverName}
        cores={cpuData.coresAll as number[]}
        threads={cpuData.threads}
        dataLenght={totalDataSave}
        storageName={`${serverName}-cpu-all`}
      />,
    },
  ];

  return (
    <>
      <title>Server Monitor</title>
      <main className="flex-grow">
        <div className=''>
          <h3 className='text-2xl'>System Monitoring</h3>
          <Input type="text" className='bg-inherit lg:w-2/12 md:w-4/12 sm:w-6/12' variant='underlined' value={serverNameInput} placeholder={serverName}
            onKeyUp={serverKeyUpHandlers}
            onFocus={(e) => setServerNameInput(serverName)}
            onBlur={(e) => setServerNameInput('')}
            onChange={(e) => setServerNameInput(e.target.value)}
            name='serverName'
          />
        </div>
        <div className='flex space-x-4 mt-4'>
          <Container
            title={cpuData.name}
            content={(
              <div className='flex flex-col-reverse space-x-4  lg:flex-row md:flex-row'>
                <div className='lg:w-1/6 md:w-1/6 sm:w-full rounded-lg p-4 text-center md:text-left'>
                  <div className='flex justify-between md:flex-col'>
                    <div>Uptime</div>
                    <div className='font-bold'>{cpuData.uptime.split('.')[0]}</div>
                  </div>
                  <div className='flex justify-between md:flex-col'>
                    <div>Usage</div>
                    <div className='font-bold'>{cpuData.usage.toFixed(2)} %</div>
                  </div>
                  <div className='flex justify-between md:flex-col'>
                    <div>Speed</div>
                    <div className='font-bold'>{cpuData.speed.toLocaleString(undefined, { maximumFractionDigits: 0 })} Mhz</div>
                  </div>
                  <div className='flex justify-between md:flex-col'>
                    <div>Threads</div>
                    <div className='font-bold'>{cpuData.threads}</div>
                  </div>
                </div>
                <div className='lg:w-5/6 md:w-5/6 sm:w-full h-full pt-2' style={{ marginLeft: '0px' }}>
                  <Tabs aria-label="Dynamic tabs" className='w-full justify-center md:justify-end' items={tabsData} variant='underlined' selectedKey={selectedTabs} onSelectionChange={(key: React.Key) => {
                    dispatch(set(key as string));
                    localStorage.setItem('selectedTabs', key as string);
                    socket?.emit('getLog', {
                      serverName: serverName,
                    });
                  }}>
                    {(item) => (
                      <Tab key={item.id} title={item.label} className='h-full text-center'>
                        <Card className='max-h-full mb-4 h-[400px] md:h-[350px] lg:h-[350px] bg-transparent p-0 m-0 border-none shadow-none'>
                          <CardBody className='p-0'>
                            {item.content}
                          </CardBody>
                        </Card>
                      </Tab>
                    )}
                  </Tabs>
                </div>
              </div>
            )}
          />
        </div>
      </main>
    </>
  );
}
