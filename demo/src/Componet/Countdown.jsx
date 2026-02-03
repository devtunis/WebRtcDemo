import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";

const MyCountdown = ({ minutes = 44, seconds = 4 }) => {
  const Nav = useNavigate();
  const totalTime = Date.now() + minutes * 60 * 1000 + seconds * 1000;

  

  return (
    <Countdown
      date={totalTime}
      onComplete={()=>Nav("/")} // هذا أفضل حل
      renderer={({ minutes, seconds }) => (
        <span style={{
          fontSize: "2rem",
          fontWeight: "700",
          color: "#4f46e5",
          fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
        }}>
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </span>
      )}
    />
  );
};

export default MyCountdown;
