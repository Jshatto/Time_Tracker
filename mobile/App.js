import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

const SERVER_URL = 'http://localhost:5000';

export default function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    let interval;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / 60000) % 60;
    const hours = Math.floor(ms / 3600000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const startTimer = async () => {
    try {
      await fetch(`${SERVER_URL}/api/timer/start`, { method: 'POST' });
      setIsRunning(true);
      setStartTime(Date.now());
    } catch (err) {
      console.error('Start failed', err);
    }
  };

  const stopTimer = async () => {
    try {
      await fetch(`${SERVER_URL}/api/timer/stop`, { method: 'POST' });
      setIsRunning(false);
      setStartTime(null);
      setElapsed(0);
    } catch (err) {
      console.error('Stop failed', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time Tracker</Text>
      <Text style={styles.timer}>{formatTime(elapsed)}</Text>
      <Button title={isRunning ? 'Stop' : 'Start'} onPress={isRunning ? stopTimer : startTimer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  timer: {
    fontSize: 32,
    marginVertical: 24,
  },
});