let grid = []
let rowNums
let colNums
let squareSize = 10
let simulationBegun = false
let framesPerSecond = 50
let p5Frames = 60
let frames = framesPerSecond * 60
let lastClickedSquare = {
  row: Number.POSITIVE_INFINITY,
  col: Number.NEGATIVE_INFINITY,
}
let originalSquareSize = squareSize
let mouseClicking = false

let dragToMoveMode = false
let dragDetails = {
  offset: { xOffset: 0, yOffset: 0 },
  lastMousePosition: { x: 0, y: 0 },
}
let previewingElement = false
let previewGrid = []

function initializeGrid(base) {
  grid = []
  for (let i = 0; i < rowNums; i++) {
    grid.push([])
    for (let j = 0; j < colNums; j++) {
      try {
        grid[i].push(base[i][j])
      } catch (e) {
        grid[i].push(0)
      }
    }
  }
}

async function loadTemplate(templateUrl) {
  const response = await fetch(templateUrl)
  const data = await response.json()
  previewingElement = true
  previewGrid = data
  return data
}

function setup() {
  rowNums = Math.floor(windowHeight / squareSize)
  colNums = Math.floor(windowWidth / squareSize)

  const canvas = createCanvas(squareSize * colNums, squareSize * rowNums)

  canvas.mouseReleased(() => (mouseClicking = false))
  canvas.mousePressed(() => (mouseClicking = true))

  document
    .getElementById('square-size-input')
    .addEventListener('input', (e) => {
      squareSize = originalSquareSize * (2 - e.currentTarget.value / 100)
    })

  initializeGrid()
}

function draw() {
  frameRate(p5Frames)
  background(0)

  translate(dragDetails.offset.xOffset, dragDetails.offset.yOffset)

  stroke(255, 255, 255)
  for (i = 0; i < rowNums; i++) {
    line(0, i * squareSize, squareSize * colNums, i * squareSize)
  }
  for (i = 0; i < colNums; i++) {
    line(i * squareSize, 0, i * squareSize, squareSize * rowNums)
  }

  fill(255, 255, 255)
  for (let i = 0; i < rowNums; i++) {
    for (let j = 0; j < colNums; j++) {
      if (grid[i][j] === 1) {
        rect(j * squareSize, i * squareSize, squareSize, squareSize)
      }
    }
  }

  if (previewingElement) {
    fill(200, 200, 200)
    let mouseRow = Math.floor(
      (mouseY - dragDetails.offset.yOffset) / squareSize,
    )
    let mouseCol = Math.floor(
      (mouseX - dragDetails.offset.xOffset) / squareSize,
    )
    for (let i = 0; i < previewGrid.length; i++) {
      for (let j = 0; j < previewGrid[0].length; j++) {
        if (previewGrid[i][j] === 1) {
          rect(
            (mouseCol + j) * squareSize,
            (mouseRow + i) * squareSize,
            squareSize,
            squareSize,
          )
        }
      }
    }
  }

  frames += 1
  if (frames > (1 / framesPerSecond) * p5Frames) {
    if (simulationBegun) {
      grid = calculateNextGeneration()
    }
    frames = 0
  }

  if (mouseClicking && mouseIsPressed) {
    mouseClickAction()
  }
}

function mouseClickAction() {
  if (previewingElement) {
    previewingElement = false
    let mouseRow = Math.floor(
      (mouseY - dragDetails.offset.yOffset) / squareSize,
    )
    let mouseCol = Math.floor(
      (mouseX - dragDetails.offset.xOffset) / squareSize,
    )
    for (let i = 0; i < previewGrid.length; i++) {
      grid[i + mouseRow].splice(mouseCol, previewGrid[i].length, ...previewGrid[i])
    }
    return
  }

  if (dragToMoveMode) {
    if (
      mouseX !== dragDetails.lastMousePosition.x &&
      mouseY !== dragDetails.lastMousePosition.y
    ) {
      dragDetails.offset.xOffset += mouseX - dragDetails.lastMousePosition.x
      dragDetails.offset.yOffset += mouseY - dragDetails.lastMousePosition.y
      dragDetails.lastMousePosition.x = mouseX
      dragDetails.lastMousePosition.y = mouseY
    } else if (
      mouseX === dragDetails.lastMousePosition.x &&
      mouseY === dragDetails.lastMousePosition.y
    ) {
      dragDetails.offset.xOffset += mouseX - dragDetails.lastMousePosition.x
      dragDetails.offset.yOffset += mouseY - dragDetails.lastMousePosition.y
    }
    return
  }

  let row = Math.floor((mouseY - dragDetails.offset.yOffset) / squareSize)
  let col = Math.floor((mouseX - dragDetails.offset.xOffset) / squareSize)

  if (
    !simulationBegun &&
    !(lastClickedSquare.row === row && lastClickedSquare.col === col)
  ) {
    let item = grid[row][col]
    grid[row][col] = item === 1 ? 0 : 1

    lastClickedSquare.row = row
    lastClickedSquare.col = col
  }
}

function mousePressed() {
  dragDetails.lastMousePosition.x = mouseX
  dragDetails.lastMousePosition.y = mouseY
}

function keyPressed() {
  if (keyCode === 32) {
    updateSimulationStatus()
  }
}

function calculateNextGeneration() {
  let newGrid = []
  for (let i = 0; i < rowNums; i++) {
    newGrid.push([])
    for (let j = 0; j < colNums; j++) {
      if (i === 0 || j === 0 || i === rowNums - 1 || j === colNums - 1) {
        newGrid[i].push(0)
        continue
      }

      let aliveCells = 0
      for (let r = i - 1; r <= i + 1; r++) {
        for (let c = j - 1; c <= j + 1; c++) {
          if (r === i && c === j) {
            continue
          }

          if (grid[r][c] === 1) {
            aliveCells += 1
          }
        }
      }

      if (grid[i][j] === 0 && aliveCells === 3) {
        newGrid[i].push(1)
        continue
      }
      if (grid[i][j] === 1 && (aliveCells === 2 || aliveCells === 3)) {
        newGrid[i].push(1)
        continue
      }

      newGrid[i].push(0)
    }
  }

  return newGrid
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}

function setGridSize(squareSize) {
  squareSize = squareSize
}

function mouseWheel(event) {
  if (event.deltaY < 0) {
    squareSize += 1
  } else if (event.deltaY > 0 && squareSize > originalSquareSize) {
    squareSize -= 1
  }
  setGridSize(squareSize)
}
