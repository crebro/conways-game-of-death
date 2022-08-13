const controlPanelOpener = document.getElementById('control-panel-opener')
const controlPanel = document.getElementById('control-panel')

const simulationToggle = document.getElementById('simulation-status--toggle')

const simulationIndicator = document.getElementById(
  'simulation-status--indicator',
)

const dragToMoveCheckbox = document.getElementById('drag-to-move--toggle')

controlPanelOpener.addEventListener('click', function () {
  controlPanel.classList.toggle('control-panel-open')
})

simulationToggle.addEventListener('input', function () {
  simulationBegun = !simulationBegun
  simulationIndicator.innerHTML = simulationBegun ? 'Running' : 'Not Running'
  simulationIndicator.classList.toggle('simulation-status--indicator-running')
  simulationIndicator.classList.toggle('simulation-status--indicator-stopped')
})

dragToMoveCheckbox.addEventListener('input', function () {
  dragToMoveMode = !dragToMoveMode
})
