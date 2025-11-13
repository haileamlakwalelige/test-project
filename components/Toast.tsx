import { useEffect, useState } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';

type ToastType = 'success' | 'error';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  onHide: () => void;
}

export function Toast({ visible, message, type = 'success' }: ToastProps) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, fadeAnim]);

  if (!visible) return null;

  const backgroundColor = type === 'success' ? '#10b981' : '#ef4444';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={[styles.toast, { backgroundColor }]}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

// Toast manager
let toastQueue: Array<{ message: string; type: ToastType }> = [];
let currentToast: { message: string; type: ToastType } | null = null;
let listeners: Array<() => void> = [];

export const showToast = (message: string, type: ToastType = 'success') => {
  toastQueue.push({ message, type });
  if (!currentToast) {
    processQueue();
  }
  listeners.forEach((listener) => listener());
};

const processQueue = () => {
  if (toastQueue.length > 0) {
    currentToast = toastQueue.shift() || null;
    listeners.forEach((listener) => listener());
    
    setTimeout(() => {
      currentToast = null;
      listeners.forEach((listener) => listener());
      if (toastQueue.length > 0) {
        processQueue();
      }
    }, 3000);
  }
};

export const useToast = () => {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    const updateToast = () => {
      setToast(currentToast);
    };
    listeners.push(updateToast);
    updateToast();

    return () => {
      listeners = listeners.filter((l) => l !== updateToast);
    };
  }, []);

  return toast;
};

