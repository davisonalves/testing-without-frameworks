import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { createDefaultUser } from '../../utils/index.js'

describe('POST - login', () => {

  before( async () => {
    await createDefaultUser()
  });

  it('OK - valid credentials', async () => {
    //Arrange
    const payload = {
      email: 'fulano@qa.com',
      password: 'teste'
    }

    //Act
    const response = await fetch(process.env.BASEURL + '/login', {
      method: 'post',
      headers: { 'accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    })
    const body = await response.json()
    
    //Assert
    assert.strictEqual(response.status, 200)
    assert.strictEqual(body.message, 'Login realizado com sucesso')
  });

  it('Unauthorized - invalid password', async () => {
    //Arrange
    const payload = {
      email: 'fulano@qa.com',
      password: 'invalid'
    }

    //Act
    const response = await fetch(process.env.BASEURL + '/login', {
      method: 'post',
      headers: { 'accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    })
    const body = await response.json()
    
    //Assert
    assert.strictEqual(response.status, 401)
    assert.strictEqual(body.message, 'Email e/ou senha inválidos')
  });

});
