'use client';

import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function useSignalR(
  userId: string | null,
  onMessage: (msg: any) => void
) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!userId) return;

    if (!connectionRef.current) {
      console.log('Creating SignalR connection...');

      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${apiUrl}/notificationHub`)
        .withAutomaticReconnect()
        .build();

      connectionRef.current = connection;

      connection.on('ReceiveMessage', (message) => {
        onMessage(message);
      });

      connection
        .start()
        .then(() => {
          return connection.invoke('JoinUserGroup', userId.toString());
        })
        .then(() => {
          console.log('SignalR Connected');
        })
        .catch((err) => console.error('Lỗi khi kết nối SignalR:', err));
    }

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [userId]);
}
