/* istanbul ignore file */

const { conf } = require('./conf')

function formaDeExecucao () {
  if (process.env.USERNAME === 'docker' ||
      process.env.USERNAME === 'serverest.dev' ||
      process.env.USERNAME === 'staging.serverest.dev' ||
      process.env.USERNAME === 'agilizei' ||
      process.env.USERNAME === 'cesarschool' ||
      process.env.USERNAME === 'compassuol') {
    return process.env.USERNAME
  }
  return 'npm'
}

const aplicacaoExecutandoLocalmente = () => {
  return (formaDeExecucao() === 'npm' || formaDeExecucao() === 'docker')
}

function urlDocumentacao () {
  switch (formaDeExecucao()) {
    case 'serverest.dev':
      return 'https://serverest.dev'
    case 'staging.serverest.dev':
      return 'https://staging.serverest.dev'
    case 'agilizei':
      return 'https://agilizei.serverest.dev'
    case 'compassuol':
      return 'https://compassuol.serverest.dev'
    case 'cesarschool':
      return 'https://cesarschool.serverest.dev'
    default:
      return `http://localhost:${conf.porta}`
  }
}

module.exports = {
  aplicacaoExecutandoLocalmente,
  formaDeExecucao,
  urlDocumentacao
}
