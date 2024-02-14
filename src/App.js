import React, { useState, useEffect } from "react";
import playerImg from "./images/player.png";
import platform1Img from "./images/platform1.png";
import platform2Img from "./images/platform2.png";
import platform3Img from "./images/platform3.png";
import platform4Img from "./images/platform4.png";
import "./App.css";

const LEVEL_WIDTH = 1000;
const LEVEL_HEIGHT = 1000;
const PLAYER_WIDTH = 70;
const PLAYER_HEIGHT = 70;
const PLATFORM1_WIDTH = 239; // Szerokość platformy 1
const PLATFORM1_HEIGHT = 42; // Wysokość platformy 1
const PLATFORM2_WIDTH = 104; // Szerokość platformy 2
const PLATFORM2_HEIGHT = 171; // Wysokość platformy 2
const PLATFORM3_WIDTH = 53; // Szerokość platformy 3
const PLATFORM3_HEIGHT = 122; // Wysokość platformy 3
const PLATFORM4_WIDTH = 192; // Szerokość platformy 4
const PLATFORM4_HEIGHT = 269; // Wysokość platformy 4
const GRAVITY = 1.2;
const JUMP_FORCE = 20;
const MOVE_SPEED = 5; // Prędkość ruchu postaci
const BOTTOM_MARGIN = 57; // Margines od dolnej krawędzi ekranu, poniżej którego postać nie spada
const INITIAL_PLAYER_POSITION = { x: 0, y: 56 };
const INITIAL_PLATFORMS = [
  { x: 100, y: 770, type: "platform2" },
  { x: 270, y: 600, type: "platform1" },
  { x: 700, y: 300, type: "platform1" },
  { x: 580, y: 770, type: "platform2" },
  { x: 420, y: 350, type: "platform3" },
  { x: 70, y: 450, type: "platform1" },
  { x: 100, y: 200, type: "platform1" },
  { x: 610, y: 450, type: "platform3" },
  { x: 500, y: 150, type: "platform1" },
  { x: 766, y: 618, type: "platform4" },
];

function App() {
  const [playerPosition, setPlayerPosition] = useState(INITIAL_PLAYER_POSITION);
  const [velocity, setVelocity] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [isMovingLeft, setIsMovingLeft] = useState(false);
  const [isMovingRight, setIsMovingRight] = useState(false);
  const [platforms] = useState(INITIAL_PLATFORMS);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === " " && !isJumping) {
        setIsJumping(true);
        setVelocity(-JUMP_FORCE);
      }
      if (e.key === "ArrowLeft" || e.key === "a") {
        setIsMovingLeft(true);
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        setIsMovingRight(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === " ") {
        setIsJumping(false);
      }
      if (e.key === "ArrowLeft" || e.key === "a") {
        setIsMovingLeft(false);
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        setIsMovingRight(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [isJumping, isMovingLeft, isMovingRight]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      let newPlayerX =
        playerPosition.x +
        (isMovingRight ? MOVE_SPEED : 0) -
        (isMovingLeft ? MOVE_SPEED : 0);
      let newPlayerY = playerPosition.y + velocity;
      const newVelocity = velocity + GRAVITY;

      if (newPlayerY > LEVEL_HEIGHT - PLAYER_HEIGHT - BOTTOM_MARGIN) {
        setVelocity(0);
        setIsJumping(false);
        newPlayerY = LEVEL_HEIGHT - PLAYER_HEIGHT - BOTTOM_MARGIN;
      }

      if (newPlayerX < 0) {
        newPlayerX = 0;
      } else if (newPlayerX > LEVEL_WIDTH - PLAYER_WIDTH) {
        newPlayerX = LEVEL_WIDTH - PLAYER_WIDTH;
      }

      setVelocity(newVelocity);
      setPlayerPosition((prevPosition) => ({
        ...prevPosition,
        x: newPlayerX,
        y: newPlayerY,
      }));
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [playerPosition, velocity, isMovingLeft, isMovingRight]);

  useEffect(() => {
    const checkCollisions = () => {
      platforms.forEach((platform) => {
        if (
          playerPosition.x <
            platform.x +
              (platform.type === "platform1"
                ? PLATFORM1_WIDTH
                : platform.type === "platform2"
                ? PLATFORM2_WIDTH
                : platform.type === "platform3"
                ? PLATFORM3_WIDTH
                : PLATFORM4_WIDTH) &&
          playerPosition.x + PLAYER_WIDTH > platform.x &&
          playerPosition.y + PLAYER_HEIGHT >= platform.y &&
          playerPosition.y + PLAYER_HEIGHT - velocity <= platform.y &&
          velocity > 0
        ) {
          console.log("Wskoczono na platformę!");
          console.log("Pozycja platformy:", platform.x, platform.y);
          console.log("Pozycja gracza:", playerPosition.x, playerPosition.y);
          setVelocity(0);
          setIsJumping(false);
          setPlayerPosition((prevPosition) => ({
            ...prevPosition,
            y: platform.y - PLAYER_HEIGHT,
          }));
        }
      });
    };

    checkCollisions();
  }, [playerPosition, velocity, platforms, isJumping]);

  return (
    <div className="App">
      <h1 className="Title">Merito's Adventures</h1>
      <p className="Legend">
        Legenda: spacja - skok, strzałki w lewo i prawo aby poruszać się
        <br />
        Legend: space - jump, arrow left and arrow right to move poruszać się
      </p>
      <div
        className="Level"
        style={{ width: LEVEL_WIDTH, height: LEVEL_HEIGHT }}
      >
        <img
          src={playerImg}
          alt="Player"
          className="Player"
          style={{
            position: "absolute",
            left: playerPosition.x,
            top: playerPosition.y,
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT,
          }}
        />
        {platforms.map((platform, index) => (
          <img
            key={index}
            src={
              platform.type === "platform1"
                ? platform1Img
                : platform.type === "platform2"
                ? platform2Img
                : platform.type === "platform3"
                ? platform3Img
                : platform.type === "platform4" // Poprawiono
                ? platform4Img // Poprawiono
                : null
            }
            alt="Platform"
            className="Platform"
            style={{
              position: "absolute",
              left: platform.x,
              top: platform.y,
              width:
                platform.type === "platform1"
                  ? PLATFORM1_WIDTH
                  : platform.type === "platform2"
                  ? PLATFORM2_WIDTH
                  : platform.type === "platform3"
                  ? PLATFORM3_WIDTH
                  : platform.type === "platform4" // Poprawiono
                  ? PLATFORM4_WIDTH // Poprawiono
                  : null,
              height:
                platform.type === "platform1"
                  ? PLATFORM1_HEIGHT
                  : platform.type === "platform2"
                  ? PLATFORM2_HEIGHT
                  : platform.type === "platform3"
                  ? PLATFORM3_HEIGHT
                  : platform.type === "platform4" // Poprawiono
                  ? PLATFORM4_HEIGHT // Poprawiono
                  : null,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
