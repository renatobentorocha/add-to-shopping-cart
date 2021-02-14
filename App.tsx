import React, { useRef } from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';

import {
  State,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
  TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';

import Animated, {
  block,
  clockRunning,
  cond,
  Easing,
  multiply,
  set,
  stopClock,
  timing,
  event,
  startClock,
  add,
  sub,
  or,
  greaterThan,
  diff,
  eq,
  useCode,
  interpolate,
  Extrapolate,
  not,
  and,
} from 'react-native-reanimated';
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

const withTiming = (clock: Animated.Clock) => {
  const state = {
    finished: new Animated.Value(0),
    position: new Animated.Value(0),
    frameTime: new Animated.Value(0),
    time: new Animated.Value(0),
  };

  const config = {
    toValue: new Animated.Value(1),
    duration: 300,
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    timing(clock, state, config),
    cond(
      state.finished,
      [
        stopClock(clock),
        set(state.finished, 0),
        set(state.frameTime, 0),
        set(state.time, 0),
        set(state.position, 0),
      ],
      state.position
    ),
  ]);
};

const ADD_CHART_CONTAINER_WIDTH = 320;
const ADD_CHART_CONTAINER_HEIGHT = 54;
const ADD_CHART_BUTTON_RADIUS = ADD_CHART_CONTAINER_WIDTH / 2;

export default function App() {
  const buttonClock = useRef(new Animated.Clock()).current;
  const cartClock = useRef(new Animated.Clock()).current;
  const productClock = useRef(new Animated.Clock()).current;
  const endAnimationClock = useRef(new Animated.Clock()).current;
  const endAnimationClockCart = useRef(new Animated.Clock()).current;

  const gestureState = useRef(new Animated.Value<State>(State.UNDETERMINED))
    .current;

  const gestureOldState = useRef(new Animated.Value<State>(State.UNDETERMINED))
    .current;

  const progressCart = useRef(new Animated.Value<number>(-90)).current;

  const endCartAnimation = useRef(new Animated.Value<number>(0)).current;

  const progressProduct = useRef(new Animated.Value<number>(1)).current;

  const endProductAnimation = useRef(new Animated.Value<number>(0)).current;

  const progressButton = useRef(new Animated.Value<number>(0)).current;

  const productTranslateX = useRef(new Animated.Value<number>(0)).current;

  const position = useRef({
    translateX: new Animated.Value<number>(0),
    translateY: new Animated.Value<number>(0),
  }).current;

  const scale = add(0.0001, multiply(progressButton, sub(2, 0.0001)));

  const isGoingUp = or(
    greaterThan(diff(progressButton), 0),
    eq(progressButton, 1)
  );

  const opacity = isGoingUp;

  useCode(
    () =>
      block([
        cond(eq(gestureState, State.BEGAN), [
          startClock(buttonClock),
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
          clockRunning(buttonClock),
          set(progressButton, withTiming(buttonClock))
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

  const onGestureEvent = event<
    TapGestureHandlerGestureEvent & TapGestureHandlerStateChangeEvent
  >([
    {
      nativeEvent: ({ oldState, state, x, y }) =>
        block([
          set(position.translateX, x),
          set(position.translateY, y),
          set(gestureState, state),
          set(gestureOldState, oldState),
        ]),
    },
  ]);

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
        <Animated.View
          style={{
            borderRadius: 320 / 2,

            width: 320,
            height: 320,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 9,
            },
            shadowOpacity: 0.48,
            shadowRadius: 8,
            elevation: 18,
            transform: [
              { translateY: productTranslateY },
              { scale: progressProduct },
            ],
          }}
        >
          <Image
            source={require('./hamburguer.jpg')}
            style={{
              borderRadius: 320 / 2,
              width: 320,
              height: 320,
            }}
          />
          <TapGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onGestureEvent}
          >
            <Animated.View
              style={[
                styles.add_to_cart_container,
                { overflow: 'hidden', transform: [{ scale: progressProduct }] },
              ]}
            >
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: '#696969' },
                ]}
              >
                <Animated.View
                  style={{
                    opacity,
                    backgroundColor: '#B5A3A3',
                    borderRadius: ADD_CHART_BUTTON_RADIUS,
                    width: ADD_CHART_BUTTON_RADIUS * 2,
                    height: ADD_CHART_BUTTON_RADIUS * 2,
                    transform: [
                      { translateX: multiply(-1, ADD_CHART_BUTTON_RADIUS) },
                      { translateY: multiply(-1, ADD_CHART_BUTTON_RADIUS) },
                      { translateX: position.translateX },
                      { translateY: position.translateY },
                      { scale },
                    ],
                  }}
                />
              </View>
              <Text style={styles.add_to_cart_text}>Add to cart</Text>
            </Animated.View>
          </TapGestureHandler>
        </Animated.View>

        <Animated.View
          style={{
            position: 'absolute',
            left: -90,
            bottom: 0,
            transform: [
              {
                translateX: progressCart,
              },
            ],
          }}
        >
          <ShoppingCart width={90} height={90} />
        </Animated.View>
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
  add_to_cart_container: {
    width: ADD_CHART_CONTAINER_WIDTH,
    height: ADD_CHART_CONTAINER_HEIGHT,
    backgroundColor: '#696969',
    alignItems: 'center',
    justifyContent: 'center',
  },
  add_to_cart_text: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.2,
    fontSize: 18,
  },
});
