const getFaceImage = (level) => {
  switch (level) {
    case 0:
      return "./images/level_face/green_face.png";
    case 1:
      return "./images/level_face/yellow_face.png";
    case 2:
      return "./images/level_face/red_face.png";
    default:
      return "./images/level_face/red_face.png";
  }
};

const getBackgroundColor = (level) => {
  switch (level) {
    case 0:
      return "green";
    case 1:
      return "orange";
    case 2:
      return "red";
    default:
      return "red";
  }
};

// eslint-disable-next-line react/prop-types
const ConsumptionView = ({ alcLev, setAlcoLev }) => {
  const faceImage = getFaceImage(alcLev);
  const backgroundColor = getBackgroundColor(alcLev);

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "200px",
    width: "200px",
    borderRadius: "10px",
    backgroundColor: backgroundColor,
    color: "white",
    flexDirection: "column",
  };

  const imageStyle = {
    width: "100px",
    height: "100px",
  };

  return (
    <div style={containerStyle}>
      <img src={faceImage} alt={`${alcLev} face`} style={imageStyle} />
      <span>{alcLev === 0 ? "Safe" : alcLev === 1 ? "Caution" : "Danger"}</span>
      <button onClick={() => setAlcoLev((alcLev + 1) % 3)}>for debug</button>
    </div>
  );
};

export default ConsumptionView;
