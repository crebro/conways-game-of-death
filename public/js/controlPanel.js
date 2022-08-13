const controlPanelOpener = document.getElementById('control-panel-opener')
const controlPanel = document.getElementById('control-panel')

const dragToMoveCheckbox = document.getElementById('drag-to-move--toggle')

controlPanelOpener.addEventListener('click', function () {
  controlPanel.classList.toggle('control-panel-open')
})

simulationToggle.addEventListener('input', function () {
  updateSimulationStatus()
})

dragToMoveCheckbox.addEventListener('input', function () {
  dragToMoveMode = !dragToMoveMode
})
