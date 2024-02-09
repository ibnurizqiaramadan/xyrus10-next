'use client';

import React, { useEffect } from 'react';
import { useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Image } from '@nextui-org/react';

type Car = {
  id: string;
  node: React.ReactNode;
  honk: boolean;
  pageX: number;
  pageY: number;
};

type SocketData = {
  id: string,
  hidden: boolean,
  honk: boolean,
  pageX: number,
  pageY: number
}

export default function FunPage() {
  const [ socket, setSocket ] = useState<Socket|null>(null);
  const [ Cars, setCars ] = useState<Car[]>([]);
  const [ myId, setMyId ] = useState('');
  const [ honks, setHonks ] = useState<{id: string, honk: boolean}[]>([]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL as string);
    socket.on('connect', () => {
      setSocket(socket);
      setMyId(socket.id);
      socket?.emit('carJoin', {
        id: socket.id,
        hidden: true,
        honk: false,
        pageX: 0,
        pageY: 0,
      });
    });

    socket.on('disconnect', () => {
      setSocket(null);
      setMyId('');
    });

    socket.on('honkHonk', (data: SocketData[]) => {
      const honksData = data.map((car) => {
        return {
          id: car.id,
          honk: car.honk,
        };
      });
      setHonks(honksData);
    });

    socket.on('carsMoving', (data: SocketData[]) => {
      const carsData:Car[] = data.map((car) => {
        return {
          id: car.id,
          node:
          <div key={car.id} className={`absolute ${car.hidden ? 'hidden' : ''}`} style={{ left: car.pageX, top: car.pageY }}>
            <Image src="car.svg" width={50} height={50} id='myCars' className="text-white" alt="" loading='lazy'/>
            <p>{car.id}</p>
          </div>,
          honk: car.honk,
          pageX: car.pageX,
          pageY: car.pageY,
        };
      });
      setCars(carsData);
    });

    return () => {
      socket.close();
      socket.disconnect();
      setMyId('');
    };
  }, [ ]);

  return (
    <>
      <div
        className="w-full h-screen bg-slate-700 rounded-lg select-none overflow-hidden"
        onClick={(e) => {
          socket?.emit('carHonk', socket.id);
        }}
        onMouseMove={(e) => {
          socket?.emit('carMove', { id: myId, pageX: e.pageX, pageY: e.pageY });
        }}
        onMouseLeave={(e) => {
          const myCars = Cars.filter((item) => item.id != myId);
          setCars([ ...myCars ]);
          socket?.emit('carLeave', socket.id);
        }}
      >
        {Cars.map((item) => {
          return item.node;
        })}
        {honks.map((item) => {
          if (!item.honk) return null;
          return <audio key={item.id} src="honk.mp3" autoPlay onEnded={() => socket?.emit('carStopHonk', item.id)}></audio>;
        })}
      </div>
    </>
  );
}
