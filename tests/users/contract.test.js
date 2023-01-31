import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createDefaultUser, clearAllUsers } from '../../utils/index.js'

describe('CONTRACT', () => {

  beforeEach( async () => {
    await clearAllUsers()
  });

  describe('GET - usuarios', () => {

    it('Get One', async () => {
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
      assert.strictEqual(typeof body, 'object')
      assert.strictEqual(typeof body.email, 'string')
      assert.strictEqual(typeof body.password, 'string')
      assert.strictEqual(typeof body.administrador, 'string')
      assert.strictEqual(typeof body._id, 'string')
    });

    it('Get All', async () => {
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

      assert.strictEqual(typeof body.quantidade, 'number')
      assert.ok(Array.isArray(body.usuarios))
      assert.strictEqual(typeof body.usuarios[0].nome, 'string')
      assert.strictEqual(typeof body.usuarios[0].email, 'string')
      assert.strictEqual(typeof body.usuarios[0].password, 'string')
      assert.strictEqual(typeof body.usuarios[0].administrador, 'string')
      assert.strictEqual(typeof body.usuarios[0]._id, 'string')
    });
    
  });

});