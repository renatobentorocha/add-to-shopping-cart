import React, { useRef } from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';

import { State } from 'react-native-gesture-handler';

import Animated, {
  block,
  clockRunning,
  cond,
  Easing,
  set,
  stopClock,
  timing,
  startClock,
  sub,
  eq,
  useCode,
  interpolate,
  Extrapolate,
  not,
  and,
} from 'react-native-reanimated';

import ButtonRipple from './src/components/ButtonRipple';
import Container from './src/components/Container';
import ShoppingCart from './src/components/svg/ShoppingCart';

const { width } = Dimensions.get('window');

const withTimingCart = (
  clock: Animated.Clock,
  toValue: Animated.Value<number>,
  duration: number,
  position: Animated.Value<number>,
  endAnimation: Animated.Value<number>
) => {
  const state: Animated.TimingState = {
    finished: new Animated.Value<number>(0),
    frameTime: new Animated.Value<number>(0),
    position,
    time: new Animated.Value<number>(0),
  };

  const config: Animated.TimingConfig = {
    duration,
    easing: Easing.inOut(Easing.linear),
    toValue,
  };

  return block([
    timing(clock, state, config),
    cond(state.finished, [
      stopClock(clock),
      set(state.finished, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
      set(endAnimation, not(endAnimation)),
    ]),
    state.position,
  ]);
};

export default function App() {
  const cartClock = useRef(new Animated.Clock()).current;
  const productClock = useRef(new Animated.Clock()).current;
  const endAnimationClock = useRef(new Animated.Clock()).current;
  const endAnimationClockCart = useRef(new Animated.Clock()).current;

  const gestureState = useRef(new Animated.Value<State>(State.UNDETERMINED))
    .current;

  const progressCart = useRef(new Animated.Value<number>(-90)).current;

  const endCartAnimation = useRef(new Animated.Value<number>(0)).current;

  const progressProduct = useRef(new Animated.Value<number>(1)).current;

  const endProductAnimation = useRef(new Animated.Value<number>(0)).current;

  const productTranslateX = useRef(new Animated.Value<number>(0)).current;

  useCode(
    () =>
      block([
        cond(eq(gestureState, State.BEGAN), [
          startClock(cartClock),
          startClock(productClock),
        ]),
        cond(
          clockRunning(productClock),
          set(
            progressProduct,
            withTimingCart(
              productClock,
              new Animated.Value<number>(0.2),
              2000,
              new Animated.Value<number>(1),
              endProductAnimation
            )
          )
        ),
        cond(
          clockRunning(cartClock),
          set(
            progressCart,
            withTimingCart(
              cartClock,
              new Animated.Value<number>(width / 2),
              1500,
              new Animated.Value<number>(-90),
              endCartAnimation
            )
          )
        ),
        cond(and(endCartAnimation, endProductAnimation), [
          startClock(endAnimationClock),
          startClock(endAnimationClockCart),
          set(endCartAnimation, 0),
          set(endProductAnimation, 0),
        ]),
        cond(
          clockRunning(endAnimationClock),
          set(
            productTranslateX,
            withTimingCart(
              endAnimationClock,
              new Animated.Value<number>(width + 45),
              3000,
              new Animated.Value<number>(0),
              endProductAnimation
            )
          )
        ),
      ]),
    []
  );

  const progressProductInvert = sub(1, progressProduct);

  const productTranslateY = interpolate(progressProductInvert, {
    inputRange: [0, 0.8],
    outputRange: [0, 370],
    extrapolate: Extrapolate.CLAMP,
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateX: productTranslateX }] },
        ]}
      >
        <Container translateY={productTranslateY} scale={progressProduct}>
          <Image
            source={require('./hamburguer.jpg')}
            style={{
              borderRadius: 320 / 2,
              width: 320,
              height: 320,
            }}
          />
          <ButtonRipple
            gestureState={gestureState}
            containerScale={progressProduct}
          />
        </Container>

        <ShoppingCart translateX={progressCart} width={90} height={90} />
      </Animated.View>
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
});
