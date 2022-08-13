const simulationStatusElement = document.getElementById('simulation-status')
const simulationToggle = document.getElementById('simulation-status--toggle')
const simulationIndicator = document.getElementById(
  'simulation-status--indicator',
)

function updateSimulationStatus() {
  simulationBegun = !simulationBegun

  simulationStatusElement.innerHTML = simulationBegun
    ? 'Simulation Running ...'
    : 'Simulation not Running ...'
  simulationStatusElement.classList.toggle('alert-red')
  simulationStatusElement.classList.toggle('alert-blue')

  simulationToggle.checked = simulationBegun
  simulationIndicator.innerHTML = simulationBegun ? 'Running' : 'Not Running'
  simulationIndicator.classList.toggle('simulation-status--indicator-running')
  simulationIndicator.classList.toggle('simulation-status--indicator-stopped')
}
