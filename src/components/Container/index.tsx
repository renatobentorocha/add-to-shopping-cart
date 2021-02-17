import React from 'react';
import Animated from 'react-native-reanimated';

export type ContainerProps = {
  translateY: Animated.Node<number>;
  scale: Animated.Value<number>;
};

const Container: React.FC<ContainerProps> = ({
  translateY,
  scale,
  children,
}) => {
  return (
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
        transform: [{ translateY }, { scale }],
      }}
    >
      {children}
    </Animated.View>
  );
};

export default Container;
