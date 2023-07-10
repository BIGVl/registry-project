import './LoadingScreen.scss';

const LoadingScreen = () => {
  const bubbles = Array.from({ length: 3 }, (_, index) => index + 1);

  return (
    <div className="loading-screen">
      <div className="bubbles-container">
        {bubbles.map((i) => (
          <div className="bubble" key={`bubble-${i}`}></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
