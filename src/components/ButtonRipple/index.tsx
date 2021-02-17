import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  State,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
  TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';

import Animated, {
  event,
  block,
  set,
  multiply,
  add,
  or,
  greaterThan,
  diff,
  eq,
  sub,
  Easing,
  timing,
  cond,
  stopClock,
  useCode,
  clockRunning,
  startClock,
} from 'react-native-reanimated';

const ADD_CHART_CONTAINER_WIDTH = 320;
const ADD_CHART_CONTAINER_HEIGHT = 54;
const ADD_CHART_BUTTON_RADIUS = ADD_CHART_CONTAINER_WIDTH / 2;

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

export type ButtonRippleProps = {
  containerScale: Animated.Value<number>;
  gestureState: Animated.Value<State>;
};

const ButtonRipple: React.FC<ButtonRippleProps> = ({
  containerScale,
  gestureState,
}) => {
  const buttonClock = useRef(new Animated.Clock()).current;
  const progressButton = useRef(new Animated.Value<number>(0)).current;

  const gestureOldState = useRef(new Animated.Value<State>(State.UNDETERMINED))
    .current;

  const position = useRef({
    translateX: new Animated.Value<number>(0),
    translateY: new Animated.Value<number>(0),
  }).current;

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

  useCode(
    () =>
      block([
        cond(eq(gestureState, State.BEGAN), startClock(buttonClock)),
        cond(
          clockRunning(buttonClock),
          set(progressButton, withTiming(buttonClock))
        ),
      ]),
    []
  );

  const scale = add(0.0001, multiply(progressButton, sub(2, 0.0001)));

  const isGoingUp = or(
    greaterThan(diff(progressButton), 0),
    eq(progressButton, 1)
  );

  const opacity = isGoingUp;

  return (
    <TapGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onGestureEvent}
    >
      <Animated.View
        style={[
          styles.add_to_cart_container,
          { overflow: 'hidden', transform: [{ scale: containerScale }] },
        ]}
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#696969' }]}>
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
  );
};

const styles = StyleSheet.create({
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

export default ButtonRipple;
