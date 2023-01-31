import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { generateRandomFirstName, generateRandomLastName, generateRandomEmail, generateRandomPass, generateRandomBoolean, clearAllUsers } from '../../utils/index.js';

describe('POST - usuarios', () => {

  beforeEach(() => {
    clearAllUsers()
  });

  it('Created - registered user', async () => {
    //Arrange
    const payload = {
      nome: generateRandomFirstName() + generateRandomLastName(),
      email: generateRandomEmail(),
      password: generateRandomPass(),
      administrador: generateRandomBoolean()
    }

    //Act
    const response = await fetch(process.env.BASEURL + '/usuarios', {
      method: 'post',
      headers: { 'accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    })
    const body = await response.json()

    //Assert
    assert.strictEqual(response.status, 201)
    assert.strictEqual(body.message, 'Cadastro realizado com sucesso')
  });

  it('Bad Request - e-mail already registered', async () => {
    //Arrange
    const payload = {
      nome: generateRandomFirstName() + generateRandomLastName(),
      email: generateRandomEmail(),
      password: generateRandomPass(),
      administrador: generateRandomBoolean()
    }

    //Act
    //First register
    await fetch(process.env.BASEURL + '/usuarios', {
      method: 'post',
      headers: { 'accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    })
    //Second register with e-mail already used
    const response = await fetch(process.env.BASEURL + '/usuarios', {
      method: 'post',
      headers: { 'accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    })
    const body = await response.json()

    //Assert
    assert.strictEqual(response.status, 400)
    assert.strictEqual(body.message, 'Este email já está sendo usado')
  });

  it.todo('Bad Request - empty required fields');

});