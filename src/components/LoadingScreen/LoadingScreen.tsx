import { useSprings, animated, config } from '@react-spring/web';
import './LoadingScreen.scss';

const LoadingScreen = () => {
  const config = { mass: 1, tension: 200, friction: 18, delay: 50 };

  const [springs, set] = useSprings(3, (index) => ({
    from: { y: 0, opacity: 1 },
    to: async (next) => {
      while (1) {
        await next({ y: 20, opacity: 1, config });
        await next({ y: 0, opacity: 0.5, config });
        await next({ y: -20, opacity: 0, config });
      }
    },
    delay: index * 150,
    loop: true
  }));

  return (
    <div className="loading-screen">
      <div className="bubbles-container">
        {springs.map((props, i) => (
          <animated.div style={props} className="bubble" key={`bubble-${i}`}></animated.div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
