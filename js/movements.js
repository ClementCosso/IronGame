// var boardGame = [
//   [null, null, null, null],
//   [null, null, null, null],
//   [null, null, "black2", "black3"],
//   [null, null, "black4", "black1"]
// ];

var boardGame = [
  ["white1", null, null, "black1"],
  [null, "white2", "black2", null],
  [null, "black3", "white3", null],
  ["black4", null, null, "white4"]
];

var white1 = { name: "white1", x: 0, y: 0, family: "white", travelLog: [] };
var white2 = { name: "white2", x: 1, y: 1, family: "white", travelLog: [] };
var white3 = { name: "white3", x: 2, y: 2, family: "white", travelLog: [] };
var white4 = { name: "white4", x: 3, y: 3, family: "white", travelLog: [] };

var black1 = { name: "black1", x: 0, y: 3, family: "black", travelLog: [] };
var black2 = { name: "black2", x: 1, y: 2, family: "black", travelLog: [] };
var black3 = { name: "black3", x: 2, y: 1, family: "black", travelLog: [] };
var black4 = { name: "black4", x: 3, y: 0, family: "black", travelLog: [] };

let currentPion = null; // is a string ex: "white3" updated from jquery selection
let pionToPlay = null; // is a variable ex: white3
let availablePositions = [];
var numberOfMoves = 0;
var totalMoves = 0;
var firstPlayer = null;
var secondPlayer = null;
var currentPlayer = "TOSS & START";
var displayPlayerToPlay = document.getElementById("start-game");

function definePlayerToPlay() {
  if (totalMoves === 0) {
    var firstPlayerInit = ["WHITE", "BLACK"];
    firstPlayer = firstPlayerInit[Math.floor(Math.random() * 2)];
    firstPlayerInit.indexOf(firstPlayer);
    secondPlayer = firstPlayerInit[1 - firstPlayerInit.indexOf(firstPlayer)];
    currentPlayer = firstPlayer;
  }
  if (totalMoves >= 1) {
    if (totalMoves % 2 === 0) {
      currentPlayer = firstPlayer;
    } else {
      currentPlayer = secondPlayer;
    }
  }
  displayPlayerToPlay.innerHTML = currentPlayer;
}

function reload() {
  $("#resume").click(function() {
    document.location.reload(true);
  });
}

function gotit() {
  $("#gotit").click(function() {
    $("#start-game").removeClass("inactive");
    $("#resume").removeClass("inactive");
    $("#rule").removeClass("inactive");
    $("#boardGame").removeClass("inactive");
    $("#easy-mode").removeClass("inactive");
    $("#normal-mode").removeClass("inactive");
    $("#dont-try-mode").removeClass("inactive");
  });
}

function rules() {
  $("#rule").click(function() {
    $("#boardRule").toggleClass("inactive");
  });
  $(".btn").click(function() {
    $("#boardRule").toggleClass("inactive");
  });
}

function startGame() {
  $("#start-game").click(function() {
    if (totalMoves < 1) {
      definePlayerToPlay();
    }
  });
}

function definePionToPlay(pion) {
  switch (pion) {
    case "white1":
      pionToPlay = white1;
      break;
    case "white2":
      pionToPlay = white2;
      break;
    case "white3":
      pionToPlay = white3;
      break;
    case "white4":
      pionToPlay = white4;
      break;
    case "black1":
      pionToPlay = black1;
      break;
    case "black2":
      pionToPlay = black2;
      break;
    case "black3":
      pionToPlay = black3;
      break;
    case "black4":
      pionToPlay = black4;
      break;
  }
}

// ==============================Draw the Board Game=================//

function drawBoard() {
  let html = "";

  for (i = 0; i < 4; i++) {
    for (j = 0; j < 4; j++) {
      if (boardGame[i][j] === null) {
        html +=
          '<div id="' +
          i +
          "-" +
          j +
          '"' +
          ' class="board-position grey"' +
          'data-x="' +
          i +
          '"' +
          ' data-y="' +
          j +
          '"></div>';
      } else {
        html +=
          '<div id="' +
          i +
          "-" +
          j +
          '"' +
          ' class="board-position player ' +
          boardGame[i][j].slice(0, 5) +
          '" ' +
          'data-variable="' +
          boardGame[i][j] +
          '" ' +
          'data-x="' +
          i +
          '"' +
          ' data-y="' +
          j +
          '"' +
          ' data-color="' +
          boardGame[i][j].slice(0, 5).toUpperCase() +
          '"></div>';
      }
    }
  }
  $("#boardGame").html(html);

  setClickHandlers();
  setUpdateHandlers();
  defineMode();
}

function setClickHandlers() {
  $(".player").click(function() {
    if ($(this).data("color") === currentPlayer) {
      $(".start").removeClass("start");
      $(".board-position").removeClass("available");
      $(this).addClass("start");

      currentPion = $(this).data("variable");
      definePionToPlay(currentPion);
      defineAllPossiblePositions();

      if (mode < 1) {
        availablePositions.forEach(function(element) {
          $("#" + element).addClass("available");
          $("#" + element).addClass("availableHelp");
        });
      } else {
        availablePositions.forEach(function(element) {
          $("#" + element).addClass("available");
        });
      }

      setUpdateHandlers();
    }
  });
}

function setUpdateHandlers() {
  $(".available").click(function() {
    $(".start").removeClass("start");
    $(".board-position").removeClass("available");

    var origin = {
      x: pionToPlay.x,
      y: pionToPlay.y
    };

    var destination = {
      x: $(this).data("x"),
      y: $(this).data("y")
    };
    if (mode <= 1) {
      if (destination.x === origin.x && destination.y > origin.y) {
        moveRight();
      } else if (destination.x === origin.x && destination.y < origin.y) {
        moveLeft();
      } else if (destination.x > origin.x && destination.y === origin.y) {
        moveDown();
      } else if (destination.x < origin.x && destination.y === origin.y) {
        moveUp();
      } else if (destination.x < origin.x && destination.y < origin.y) {
        moveUpLeft();
      } else if (destination.x > origin.x && destination.y < origin.y) {
        moveDownLeft();
      } else if (destination.x > origin.x && destination.y > origin.y) {
        moveDownRight();
      } else if (destination.x < origin.x && destination.y > origin.y) {
        moveUpRight();
      }
    } else if (mode === 2) {
      if (totalMoves % modulo === 0 && totalMoves > 1) {
        return availableFunctions[
          Math.floor(Math.random() * availableFunctions.length)
        ]();
      } else {
        if (destination.x === origin.x && destination.y > origin.y) {
          moveRight();
        } else if (destination.x === origin.x && destination.y < origin.y) {
          moveLeft();
        } else if (destination.x > origin.x && destination.y === origin.y) {
          moveDown();
        } else if (destination.x < origin.x && destination.y === origin.y) {
          moveUp();
        } else if (destination.x < origin.x && destination.y < origin.y) {
          moveUpLeft();
        } else if (destination.x > origin.x && destination.y < origin.y) {
          moveDownLeft();
        } else if (destination.x > origin.x && destination.y > origin.y) {
          moveDownRight();
        } else if (destination.x < origin.x && destination.y > origin.y) {
          moveUpRight();
        }
      }
    }
  });
}

let prepareModulo = [3, 5, 7];
let modulo = prepareModulo[Math.floor(Math.random() * 3)];

$(document).ready(function() {
  drawBoard();
  if (totalMoves < 1) {
    startGame();
  }
  gotit();
  rules();

  reload();
});

// ==============================Simple moves functions=================//
function moveRight() {
  boardGame[pionToPlay.x][pionToPlay.y] = null;

  var origin = {
    x: pionToPlay.x,
    y: pionToPlay.y,
    position: "(" + pionToPlay.x + "," + pionToPlay.y + ")"
  };

  for (i = 1; i <= 4; i++) {
    if (pionToPlay.y < 3) {
      if (boardGame[pionToPlay.x][pionToPlay.y + 1] === null) {
        pionToPlay.y = pionToPlay.y + 1;
      }
    }
  }
  if ("(" + pionToPlay.x + "," + pionToPlay.y + ")" === origin.position) {
    numberOfMoves = 0;
  } else {
    numberOfMoves = pionToPlay.y - origin.y;
    totalMoves = totalMoves + 1;
  }

  boardGame[pionToPlay.x][pionToPlay.y] = pionToPlay.name;

  definePlayerToPlay();
  boardGame[pionToPlay.x][pionToPlay.y] = pionToPlay.name;
  if (numberOfMoves > 0 && totalMoves > 1 && checkWhiteVictory() === true) {
    drawBoard();
    removeBlack();
  } else if (
    numberOfMoves > 0 &&
    totalMoves > 1 &&
    checkBlackVictory() === true
  ) {
    drawBoard();
    removeWhite();
  } else {
    drawBoard();
    availablePositions = [];

    currentPion = null;
    pionToPlay = null;
  }
}

function moveLeft() {
  boardGame[pionToPlay.x][pionToPlay.y] = null;

  var origin = {
    x: pionToPlay.x,
    y: pionToPlay.y,
    position: "(" + pionToPlay.x + "," + pionToPlay.y + ")"
  };

  for (i = 1; i <= 4; i++) {
    if (pionToPlay.y > 0) {
      if (boardGame[pionToPlay.x][pionToPlay.y - 1] === null) {
        pionToPlay.y = pionToPlay.y - 1;
      }
    }
  }
  if ("(" + pionToPlay.x + "," + pionToPlay.y + ")" === origin.position) {
    numberOfMoves = 0;
  } else {
    numberOfMoves = origin.y - pionToPlay.y;
    totalMoves = totalMoves + 1;
  }

  definePlayerToPlay();
  boardGame[pionToPlay.x][pionToPlay.y] = pionToPlay.name;
  if (numberOfMoves > 0 && totalMoves > 1 && checkWhiteVictory() === true) {
    drawBoard();
    removeBlack();
  } else if (
    numberOfMoves > 0 &&
    totalMoves > 1 &&
    checkBlackVictory() === true
  ) {
    drawBoard();
    removeWhite();
  } else {
    drawBoard();
    availablePositions = [];

    currentPion = null;
    pionToPlay = null;
  }
}

function moveUp() {
  boardGame[pionToPlay.x][pionToPlay.y] = null;

  var origin = {
    x: pionToPlay.x,
    y: pionToPlay.y,
    position: "(" + pionToPlay.x + "," + pionToPlay.y + ")"
  };

  for (i = 1; i <= 4; i++) {
    if (pionToPlay.x > 0) {
      if (boardGame[pionToPlay.x - 1][pionToPlay.y] === null) {
        pionToPlay.x = pionToPlay.x - 1;
      }
    }
  }
  if ("(" + pionToPlay.x + "," + pionToPlay.y + ")" === origin.position) {
    numberOfMoves = 0;
  } else {
    numberOfMoves = origin.x - pionToPlay.x;
    totalMoves = totalMoves + 1;
  }

  definePlayerToPlay();
  boardGame[pionToPlay.x][pionToPlay.y] = pionToPlay.name;
  if (numberOfMoves > 0 && totalMoves > 1 && checkWhiteVictory() === true) {
    drawBoard();
    removeBlack();
  } else if (
    numberOfMoves > 0 &&
    totalMoves > 1 &&
    checkBlackVictory() === true
  ) {
    drawBoard();
    removeWhite();
  } else {
    drawBoard();
    availablePositions = [];

    currentPion = null;
    pionToPlay = null;
  }
}

function moveDown() {
  boardGame[pionToPlay.x][pionToPlay.y] = null;

  var origin = {
    x: pionToPlay.x,
    y: pionToPlay.y,
    position: "(" + pionToPlay.x + "," + pionToPlay.y + ")"
  };

  for (i = 1; i <= 4; i++) {
    if (pionToPlay.x < 3) {
      if (boardGame[pionToPlay.x + 1][pionToPlay.y] === null) {
        pionToPlay.x = pionToPlay.x + 1;
      }
    }
  }
  if ("(" + pionToPlay.x + "," + pionToPlay.y + ")" === origin.position) {
    numberOfMoves = 0;
  } else {
    numberOfMoves = pionToPlay.x - origin.x;
    totalMoves = totalMoves + 1;
  }
  definePlayerToPlay();
  boardGame[pionToPlay.x][pionToPlay.y] = pionToPlay.name;
  if (numberOfMoves > 0 && totalMoves > 1 && checkWhiteVictory() === true) {
    drawBoard();
    removeBlack();
  } else if (
    numberOfMoves > 0 &&
    totalMoves > 1 &&
    checkBlackVictory() === true
  ) {
    drawBoard();
    removeWhite();
  } else {
    drawBoard();
    availablePositions = [];

    currentPion = null;
    pionToPlay = null;
  }
}

// ==============================Diago moves functions=================//
function moveUpRight() {
  boardGame[pionToPlay.x][pionToPlay.y] = null;

  var origin = {
    x: pionToPlay.x,
    y: pionToPlay.y,
    position: "(" + pionToPlay.x + "," + pionToPlay.y + ")"
  };

  for (i = 1; i <= 4; i++) {
    if (pionToPlay.y < 3 && pionToPlay.x > 0) {
      if (boardGame[pionToPlay.x - 1][pionToPlay.y + 1] === null) {
        pionToPlay.x = pionToPlay.x - 1;
        pionToPlay.y = pionToPlay.y + 1;
      }
    }
  }
  if ("(" + pionToPlay.x + "," + pionToPlay.y + ")" === origin.position) {
    numberOfMoves = 0;
  } else {
    numberOfMoves = origin.x - pionToPlay.x;
    totalMoves = totalMoves + 1;
  }
  definePlayerToPlay();
  boardGame[pionToPlay.x][pionToPlay.y] = pionToPlay.name;
  if (numberOfMoves > 0 && totalMoves > 1 && checkWhiteVictory() === true) {
    drawBoard();
    removeBlack();
  } else if (
    numberOfMoves > 0 &&
    totalMoves > 1 &&
    checkBlackVictory() === true
  ) {
    drawBoard();
    removeWhite();
  } else {
    drawBoard();
    availablePositions = [];

    currentPion = null;
    pionToPlay = null;
  }
}

function moveUpLeft() {
  boardGame[pionToPlay.x][pionToPlay.y] = null;

  var origin = {
    x: pionToPlay.x,
    y: pionToPlay.y,
    position: "(" + pionToPlay.x + "," + pionToPlay.y + ")"
  };

  for (i = 1; i <= 4; i++) {
    if (pionToPlay.y > 0 && pionToPlay.x > 0) {
      if (boardGame[pionToPlay.x - 1][pionToPlay.y - 1] === null) {
        pionToPlay.x = pionToPlay.x - 1;
        pionToPlay.y = pionToPlay.y - 1;
      }
    }
  }
  if ("(" + pionToPlay.x + "," + pionToPlay.y + ")" === origin.position) {
    numberOfMoves = 0;
  } else {
    numberOfMoves = origin.x - pionToPlay.x;
    totalMoves = totalMoves + 1;
  }
  definePlayerToPlay();
  boardGame[pionToPlay.x][pionToPlay.y] = pionToPlay.name;
  if (numberOfMoves > 0 && totalMoves > 1 && checkWhiteVictory() === true) {
    drawBoard();
    removeBlack();
  } else if (
    numberOfMoves > 0 &&
    totalMoves > 1 &&
    checkBlackVictory() === true
  ) {
    removeWhite();
  } else {
    drawBoard();
    availablePositions = [];

    currentPion = null;
    pionToPlay = null;
  }
}

function moveDownLeft() {
  boardGame[pionToPlay.x][pionToPlay.y] = null;

  var origin = {
    x: pionToPlay.x,
    y: pionToPlay.y,
    position: "(" + pionToPlay.x + "," + pionToPlay.y + ")"
  };

  for (i = 1; i <= 4; i++) {
    if (pionToPlay.y > 0 && pionToPlay.x < 3) {
      if (boardGame[pionToPlay.x + 1][pionToPlay.y - 1] === null) {
        pionToPlay.x = pionToPlay.x + 1;
        pionToPlay.y = pionToPlay.y - 1;
      }
    }
  }
  if ("(" + pionToPlay.x + "," + pionToPlay.y + ")" === origin.position) {
    numberOfMoves = 0;
  } else {
    numberOfMoves = pionToPlay.y - origin.y;
    totalMoves = totalMoves + 1;
  }
  definePlayerToPlay();
  boardGame[pionToPlay.x][pionToPlay.y] = pionToPlay.name;
  if (numberOfMoves > 0 && totalMoves > 1 && checkWhiteVictory() === true) {
    drawBoard();
    removeBlack();
  } else if (
    numberOfMoves > 0 &&
    totalMoves > 1 &&
    checkBlackVictory() === true
  ) {
    drawBoard();
    removeWhite();
  } else {
    drawBoard();
    availablePositions = [];

    currentPion = null;
    pionToPlay = null;
  }
}

function moveDownRight() {
  boardGame[pionToPlay.x][pionToPlay.y] = null;

  var origin = {
    x: pionToPlay.x,
    y: pionToPlay.y,
    position: "(" + pionToPlay.x + "," + pionToPlay.y + ")"
  };

  for (i = 1; i <= 4; i++) {
    if (pionToPlay.y < 3 && pionToPlay.x < 3) {
      if (boardGame[pionToPlay.x + 1][pionToPlay.y + 1] === null) {
        pionToPlay.x = pionToPlay.x + 1;
        pionToPlay.y = pionToPlay.y + 1;
      }
    }
  }
  if ("(" + pionToPlay.x + "," + pionToPlay.y + ")" === origin.position) {
    numberOfMoves = 0;
  } else {
    numberOfMoves = pionToPlay.y - origin.y;
    totalMoves = totalMoves + 1;
  }
  definePlayerToPlay();
  boardGame[pionToPlay.x][pionToPlay.y] = pionToPlay.name;
  if (numberOfMoves > 0 && totalMoves > 1 && checkWhiteVictory() === true) {
    drawBoard();
    removeBlack();
  } else if (
    numberOfMoves > 0 &&
    totalMoves > 1 &&
    checkBlackVictory() === true
  ) {
    drawBoard();
    removeWhite();
  } else {
    drawBoard();
    availablePositions = [];

    currentPion = null;
    pionToPlay = null;
  }
}

// ===================define victory in corners=================//

function checkCornerVictoryWhite() {
  var corners = [
    boardGame[0][0],
    boardGame[0][3],
    boardGame[3][0],
    boardGame[3][3]
  ];
  var sortedCorners = corners.sort();
  if (
    sortedCorners[0] === "white1" &&
    sortedCorners[1] === "white2" &&
    sortedCorners[2] === "white3" &&
    sortedCorners[3] === "white4"
  ) {
    console.log("white wins");
    return true;
  }
}

function checkCornerVictoryBlack() {
  var corners = [
    boardGame[0][0],
    boardGame[0][3],
    boardGame[3][0],
    boardGame[3][3]
  ];
  var sortedCorners = corners.sort();
  if (
    sortedCorners[0] === "black1" &&
    sortedCorners[1] === "black2" &&
    sortedCorners[2] === "black3" &&
    sortedCorners[3] === "black4"
  ) {
    console.log("black wins");
    return true;
  }
}
// ================define victory in diagonal=================//
function removeBlack() {
  $(".black")
    .removeClass("black")
    .addClass("grey");

  $(".white")
    .removeClass("white")
    .addClass("whitevictory");
}

function removeWhite() {
  $(".white")
    .removeClass("white")
    .addClass("grey");

  $(".black")
    .removeClass("black")
    .addClass("blackvictory");
}

function checkTopLeftDiagVictoryWhite() {
  var diagonale = [
    boardGame[0][0],
    boardGame[1][1],
    boardGame[2][2],
    boardGame[3][3]
  ];
  var sortedDiagonale = diagonale.sort();
  if (
    sortedDiagonale[0] === "white1" &&
    sortedDiagonale[1] === "white2" &&
    sortedDiagonale[2] === "white3" &&
    sortedDiagonale[3] === "white4"
  ) {
    console.log("white wins");
    return true;
  }
}

function checkTopRightDiagVictoryWhite() {
  var diagonale = [
    boardGame[0][3],
    boardGame[1][2],
    boardGame[2][1],
    boardGame[3][0]
  ];
  var sortedDiagonale = diagonale.sort();
  if (
    sortedDiagonale[0] === "white1" &&
    sortedDiagonale[1] === "white2" &&
    sortedDiagonale[2] === "white3" &&
    sortedDiagonale[3] === "white4"
  ) {
    console.log("white wins");
    return true;
  }
}

function checkTopLeftDiagVictoryBlack() {
  var diagonale = [
    boardGame[0][0],
    boardGame[1][1],
    boardGame[2][2],
    boardGame[3][3]
  ];
  var sortedDiagonale = diagonale.sort();
  if (
    sortedDiagonale[0] === "black1" &&
    sortedDiagonale[1] === "black2" &&
    sortedDiagonale[2] === "black3" &&
    sortedDiagonale[3] === "black4"
  ) {
    console.log("black wins");
    return true;
  }
}

function checkTopRightDiagVictoryBlack() {
  var diagonale = [
    boardGame[0][3],
    boardGame[1][2],
    boardGame[2][1],
    boardGame[3][0]
  ];
  var sortedDiagonale = diagonale.sort();
  if (
    sortedDiagonale[0] === "black1" &&
    sortedDiagonale[1] === "black2" &&
    sortedDiagonale[2] === "black3" &&
    sortedDiagonale[3] === "black4"
  ) {
    console.log("black wins");
    return true;
  }
}

// =================define victory in line=================//

function checkVerticalWhite() {
  for (i = 0; i <= 3; i++) {
    var verticalLine = [
      boardGame[0][i],
      boardGame[1][i],
      boardGame[2][i],
      boardGame[3][i]
    ];
    var sortedLine = verticalLine.sort();

    if (
      sortedLine[0] === "white1" &&
      sortedLine[1] === "white2" &&
      sortedLine[2] === "white3" &&
      sortedLine[3] === "white4"
    ) {
      console.log("white wins");
      return true;
    }
  }
}

function checkVerticalBlack() {
  for (i = 0; i <= 3; i++) {
    var verticalLine = [
      boardGame[0][i],
      boardGame[1][i],
      boardGame[2][i],
      boardGame[3][i]
    ];
    var sortedLine = verticalLine.sort();

    if (
      sortedLine[0] === "black1" &&
      sortedLine[1] === "black2" &&
      sortedLine[2] === "black3" &&
      sortedLine[3] === "black4"
    ) {
      console.log("black wins");
      return true;
    }
  }
}

function checkHorizontalWhite() {
  for (i = 0; i <= 3; i++) {
    var horizontalLine = [
      boardGame[i][0],
      boardGame[i][1],
      boardGame[i][2],
      boardGame[i][3]
    ];
    var sortedLine = horizontalLine.sort();

    if (
      sortedLine[0] === "white1" &&
      sortedLine[1] === "white2" &&
      sortedLine[2] === "white3" &&
      sortedLine[3] === "white4"
    ) {
      console.log("white wins");
      return true;
    }
  }
}

function checkHorizontalBlack() {
  for (i = 0; i <= 3; i++) {
    var horizontalLine = [
      boardGame[i][0],
      boardGame[i][1],
      boardGame[i][2],
      boardGame[i][3]
    ];
    var sortedLine = horizontalLine.sort();

    if (
      sortedLine[0] === "black1" &&
      sortedLine[1] === "black2" &&
      sortedLine[2] === "black3" &&
      sortedLine[3] === "black4"
    ) {
      console.log("black wins");
      return true;
    }
  }
}

// ===============define victory in square=================//

function checkSquareWhite() {
  for (i = 0; i <= 2; i++) {
    for (j = 0; j <= 2; j++) {
      var square = [
        boardGame[i][j],
        boardGame[i][j + 1],
        boardGame[i + 1][j],
        boardGame[i + 1][j + 1]
      ];
      var sortedSquare = square.sort();

      if (
        sortedSquare[0] === "white1" &&
        sortedSquare[1] === "white2" &&
        sortedSquare[2] === "white3" &&
        sortedSquare[3] === "white4"
      ) {
        console.log("white wins");
        return true;
      }
    }
  }
}

function checkSquareBlack() {
  for (i = 0; i <= 2; i++) {
    for (j = 0; j <= 2; j++) {
      var square = [
        boardGame[i][j],
        boardGame[i][j + 1],
        boardGame[i + 1][j],
        boardGame[i + 1][j + 1]
      ];
      var sortedSquare = square.sort();

      if (
        sortedSquare[0] === "black1" &&
        sortedSquare[1] === "black2" &&
        sortedSquare[2] === "black3" &&
        sortedSquare[3] === "black4"
      ) {
        console.log("black wins");
        return true;
      }
    }
  }
}

// ===============check who wins=================//

function checkWhiteVictory() {
  if (
    checkCornerVictoryWhite() === true ||
    checkTopLeftDiagVictoryWhite() === true ||
    checkTopRightDiagVictoryWhite() === true ||
    checkVerticalWhite() === true ||
    checkHorizontalWhite() === true ||
    checkSquareWhite() === true
  )
    return true;
}
function checkBlackVictory() {
  if (
    checkCornerVictoryBlack() === true ||
    checkTopLeftDiagVictoryBlack() === true ||
    checkTopRightDiagVictoryBlack() === true ||
    checkVerticalBlack() === true ||
    checkHorizontalBlack() === true ||
    checkSquareBlack() === true
  )
    return true;
}

let mode = 1;

function defineEasyMode() {
  $("#easy-mode").click(function() {
    $(".selected").removeClass("selected");
    $(this).addClass("selected");

    mode = 0;
  });
}
function defineNormalMode() {
  $("#normal-mode").click(function() {
    $(".availableHelp").removeClass("availableHelp");
    $(".selected").removeClass("selected");
    $(this).addClass("selected");
    mode = 1;
  });
}

function defineHardMode() {
  $("#dont-try-mode").click(function() {
    $(".selected").removeClass("selected");
    $(this).addClass("selected");
    mode = 2;
  });
}

function defineMode() {
  defineEasyMode();
  defineNormalMode();
  defineHardMode();
}

function defineAllPossiblePositions() {
  availablePositions = [];
  availableFunctions = [];

  defineRight();
  defineLeft();
  defineDown();
  defineUp();
  defineUpRight();
  defineUpLeft();
  defineDownLeft();
  defineDownRight();
}

function defineRight() {
  var x = pionToPlay.x;
  var y = pionToPlay.y;
  var z = y;

  var i = 1;
  while (i < 4 && y < 3 && y + i <= 3) {
    if (boardGame[x][y + i] === null) {
      z = y + i;
      i++;
    } else {
      break;
    }
  }

  if (z > y) {
    availablePositions.push("" + x + "-" + z + "");
    availableFunctions.push(moveRight);
  }
}

function defineLeft() {
  var x = pionToPlay.x;
  var y = pionToPlay.y;
  var z = y;

  var i = 1;
  while (i < 4 && y > 0 && y - i >= 0) {
    if (boardGame[x][y - i] === null) {
      z = y - i;
      i++;
    } else {
      break;
    }
  }

  if (z < y) {
    availablePositions.push("" + x + "-" + z + "");
    availableFunctions.push(moveLeft);
  }
}

function defineDown() {
  var x = pionToPlay.x;
  var y = pionToPlay.y;
  var z = x;

  var i = 1;
  while (i < 4 && x < 3 && x + i <= 3) {
    if (boardGame[x + i][y] === null) {
      z = x + i;
      i++;
    } else {
      break;
    }
  }

  if (z > x) {
    availablePositions.push("" + z + "-" + y + "");
    availableFunctions.push(moveDown);
  }
}

function defineUp() {
  var x = pionToPlay.x;
  var y = pionToPlay.y;
  var z = x;

  var i = 1;
  while (i < 4 && x > 0 && x - i >= 0) {
    if (boardGame[x - i][y] === null) {
      z = x - i;
      i++;
    } else {
      break;
    }
  }

  if (z < x) {
    availablePositions.push("" + z + "-" + y + "");
    availableFunctions.push(moveUp);
  }
}

function defineUpRight() {
  var x = pionToPlay.x;
  var y = pionToPlay.y;
  var z = x;
  var a = y;

  var i = 1;
  while (i < 4 && x > 0 && y < 3 && x - i >= 0 && y + i <= 3) {
    if (boardGame[x - i][y + i] === null) {
      z = x - i;
      a = y + i;
      i++;
    } else {
      break;
    }
  }

  if (z < x) {
    availablePositions.push("" + z + "-" + a + "");
    availableFunctions.push(moveUpRight);
  }
}

function defineUpLeft() {
  var x = pionToPlay.x;
  var y = pionToPlay.y;
  var z = x;
  var a = y;

  var i = 1;
  while (i < 4 && x > 0 && y > 0 && x - i >= 0 && y - i >= 0) {
    if (boardGame[x - i][y - i] === null) {
      z = x - i;
      a = y - i;
      i++;
    } else {
      break;
    }
  }

  if (z < x) {
    availablePositions.push("" + z + "-" + a + "");
    availableFunctions.push(moveUpLeft);
  }
}

function defineDownLeft() {
  var x = pionToPlay.x;
  var y = pionToPlay.y;
  var z = x;
  var a = y;

  var i = 1;
  while (i < 4 && x < 3 && y > 0 && x + i <= 3 && y - i >= 0) {
    if (boardGame[x + i][y - i] === null) {
      z = x + i;
      a = y - i;
      i++;
    } else {
      break;
    }
  }

  if (z > x) {
    availablePositions.push("" + z + "-" + a + "");
    availableFunctions.push(moveDownLeft);
  }
}

function defineDownRight() {
  var x = pionToPlay.x;
  var y = pionToPlay.y;
  var z = x;
  var a = y;

  var i = 1;
  while (i < 4 && x < 3 && y < 3 && x + i <= 3 && y + i <= 3) {
    if (boardGame[x + i][y + i] === null) {
      z = x + i;
      a = y + i;
      i++;
    } else {
      break;
    }
  }

  if (z > x) {
    availablePositions.push("" + z + "-" + a + "");
    availableFunctions.push(moveDownRight);
  }
}
