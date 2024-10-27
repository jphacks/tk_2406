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
  const imageSize = 35;
  const debug = false;
  // debug時は倍率を1にする
  const sizeMagnification = debug ? 1 : 1.5;


  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: `${imageSize * 2}px`,
    width: `${imageSize * 2}px`,
    borderRadius: `${imageSize / 10}px`,
    backgroundColor: backgroundColor,
    color: "white",
    flexDirection: "column",
    fontSize: `${imageSize * sizeMagnification / 5}px`,
  };

  const imageStyle = {
    width: `${imageSize * sizeMagnification}px`,
    height: `${imageSize * sizeMagnification}px`,
  };

  return (
    <div style={containerStyle}>
      <img src={faceImage} alt={`${alcLev} face`} style={imageStyle} />
      <span>{alcLev === 0 ? "Safe" : alcLev === 1 ? "Caution" : "Danger"}</span>
      {debug && (
        <button
          onClick={() => {
            console.log("fjdsaklfao", alcLev);
            setAlcoLev((alcLev + 1) % 3);
          }}
        >
          for debug
        </button>
      )}
    </div>
  );
};

export default ConsumptionView;
