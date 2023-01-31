import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createDefaultUser, clearAllUsers } from '../../utils/index.js'

describe('GET - usuarios', () => {

  beforeEach( async () => {
    await clearAllUsers()
  });

  describe('Get One', () => {

    it('OK - user found', async () => {
      //Arrange
      const id = await createDefaultUser()

      //Act
      const response = await fetch(process.env.BASEURL + `/usuarios/${id}`, {
        method: 'get',
        headers: { 'accept': 'application/json', 'Content-Type': 'application/json'}
      })
      const body = await response.json()
      
      //Assert
      assert.strictEqual(response.status, 200)
      assert.strictEqual(body.nome, 'Fulano da Silva')
    });
  
    it('Bad Request - user not found', async () => {
      //Act
      const response = await fetch(process.env.BASEURL + '/usuarios/123', {
        method: 'get',
        headers: { 'accept': 'application/json', 'Content-Type': 'application/json'}
      })
      const body = await response.json()
  
      //Assert
      assert.strictEqual(response.status, 400)
      assert.strictEqual(body.message, 'Usuário não encontrado')
    });

  });

  describe('Get All', () => {
    
    it('OK - users found', async () => {
      //Arrange
      await createDefaultUser()

      //Act
      const response = await fetch(process.env.BASEURL + '/usuarios', {
        method: 'get',
        headers: { 'accept': 'application/json'}
      })
      const body = await response.json()

      //Assert
      assert.strictEqual(response.status, 200)
      assert.ok(Array.isArray(body.usuarios)) //Valida se a lista de usuarios é um array
    });

    it('Bad Request - users not found', async () => {
      //Arrange
      const params = { nonexistent: 'asd' }

      //Act
      const response = await fetch(process.env.BASEURL + '/usuarios?' + new URLSearchParams(params), {
        method: 'get',
        headers: { 'accept': 'application/json'}
      })
      const body = await response.json()

      //Assert
      assert.strictEqual(response.status, 400)
      assert.strictEqual(body.nonexistent, 'nonexistent não é permitido')
    });

  });

});