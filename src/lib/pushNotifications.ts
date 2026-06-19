export const requestPushPermission = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('Este navegador no soporta notificaciones de escritorio.');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Permiso de notificaciones concedido.');
      return true;
    } else {
      console.warn('Permiso de notificaciones denegado.');
      return false;
    }
  } catch (error) {
    console.error('Error pidiendo permiso de notificaciones:', error);
    return false;
  }
};

export const registerServiceWorker = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registrado con éxito:', registration.scope);
    return registration;
  } catch (error) {
    console.error('Error registrando el Service Worker:', error);
    return null;
  }
};

export const triggerLocalPush = async (title: string, body: string, icon?: string) => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  const registration = await navigator.serviceWorker.ready;
  if (registration && Notification.permission === 'granted') {
    registration.showNotification(title, {
      body,
      icon: icon || '/favicon.ico',
      badge: '/favicon.ico',
      
      requireInteraction: true
    });
  }
};
