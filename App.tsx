import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Animated, {
  block,
  clockRunning,
  cond,
  Easing,
  set,
  stopClock,
  timing,
} from 'react-native-reanimated';
import ShoppingCart from './src/components/svg/ShoppingCart';

const withTiming = (clock: Animated.Clock, toValue: Animated.Value<number>) => {
  const state: Animated.TimingState = {
    finished: new Animated.Value<number>(0),
    frameTime: new Animated.Value<number>(0),
    position: new Animated.Value<number>(0),
    time: new Animated.Value<number>(0),
  };

  const config: Animated.TimingConfig = {
    duration: 1000,
    easing: Easing.inOut(Easing.linear),
    toValue,
  };

  return block([
    cond(clockRunning(clock), [
      timing(clock, state, config),
      cond(state.finished, [
        stopClock(clock),
        set(state.finished, 0),
        set(state.frameTime, 0),
        set(state.time, 0),
      ]),
    ]),
  ]);
};

export default function App() {
  return (
    <View style={styles.container}>
      <View
        style={{
          width: 320,
          height: 479,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 9,
          },
          shadowOpacity: 0.48,
          shadowRadius: 8,
          elevation: 18,
        }}
      >
        <Image
          source={require('./hamburguer.jpg')}
          style={{
            width: 320,
            height: 479,
          }}
        />
      </View>
      <View style={styles.add_to_cart_container}>
        <Text>Add to cart</Text>
      </View>
      {/* <ShoppingCart width={150} height={150} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  add_to_cart_container: {
    width: 320,
    height: 54,
    backgroundColor: '#696969',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
