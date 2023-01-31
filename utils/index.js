function generateRandomFirstName(){
  const names = ['Ana', 'Joao', 'Fulano', 'Ciclano', 'Vinicius', 'Pedro']
  return names[Math.floor(Math.random() * names.length)]
}

function generateRandomLastName(){
  const lastNames = ['Silva', 'Alves', 'Costa', 'Gomes', 'Almeida', 'Martins']
  return lastNames[Math.floor(Math.random() * lastNames.length)]
}

function generateRandomEmail(){
  const email = generateRandomFirstName() + '.' + generateRandomLastName() + '@mailinator.com'
  return email.toLocaleLowerCase()
}

function generateRandomPass(){
  const pass = Math.random().toString(36).slice(-10)
  return pass
}

function generateRandomBoolean(){
  const boolean = Math.random() < 0.5
  return boolean.toString()
}

async function clearAllUsers(){
  const response = await fetch(process.env.BASEURL + '/usuarios', {
    method: 'get',
    headers: { 'accept': 'application/json'}
  })
  const body = await response.json()

  for (const element of body.usuarios){
    await fetch(process.env.BASEURL + `/usuarios/${element._id}`, {
      method: 'delete',
      headers: { 'accept': 'application/json', 'Content-Type': 'application/json'}
    })
  }
}

async function createDefaultUser(){
  const payload = {
    nome: 'Fulano da Silva',
    email: 'fulano@qa.com',
    password: 'teste',
    administrador: 'true'
  }

  const response = await fetch(process.env.BASEURL + '/usuarios', {
    method: 'post',
    headers: { 'accept': 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  })
  const body = await response.json()

  return body._id
}

export {
  generateRandomFirstName,
  generateRandomLastName,
  generateRandomEmail,
  generateRandomPass,
  generateRandomBoolean,
  clearAllUsers,
  createDefaultUser
}