'use strict'

const Datastore = require('nedb-promises')
const { join } = require('path')

const alterarValoresParaRegex = require('../utils/alterarValoresParaRegex')
const authService = require('../services/auth-service')
const usuariosService = require('../services/usuarios-service')
const produtosService = require('../services/produtos-service')

const datastore = Datastore.create({ filename: join(__dirname, '../data/carrinhos.db'), autoload: true })

exports.getAll = queryString => {
  queryString = alterarValoresParaRegex(queryString)
  return datastore.find(queryString)
}

exports.getOne = id => {
  return datastore.findOne({ _id: id })
}

exports.existeCarrinho = pesquisa => {
  return datastore.count(pesquisa)
}

exports.criarCarrinho = async body => {
  return datastore.insert(body)
}

exports.extrairProdutosDuplicados = arrayProdutos => {
  const sortedArr = arrayProdutos.slice().sort()
  const produtosDuplicados = []
  for (let i = 0; i < sortedArr.length - 1; i++) {
    if (sortedArr[i + 1].idProduto === sortedArr[i].idProduto) {
      produtosDuplicados.push(sortedArr[i].idProduto)
    }
  }
  return produtosDuplicados
}

exports.getProdutosComPrecoUnitarioOuErro = async arrayProdutos => {
  const produtosComPrecoUnitario = []
  for (const produto of arrayProdutos) {
    const { precoUnitario: preco, error } = await produtosService.getPrecoUnitarioOuErro(produto)
    if (error) {
      const index = arrayProdutos.indexOf(produto)
      const item = { ...error.item, index }
      return { error: { ...error, item } }
    }
    produtosComPrecoUnitario.push({ ...produto, precoUnitario: preco })
  }
  return { produtosComPrecoUnitario }
}

exports.deleteById = async id => {
  return datastore.remove({ _id: id }, {})
}

exports.concluiCompra = async carrinho => {
  await this.deleteById(carrinho._id)
}

exports.removeCarrinho = async carrinho => {
  const { produtos, _id } = carrinho
  this.reabasteceEstoque(produtos)
  await this.deleteById(_id)
}

exports.getCarrinhoDoUsuario = async (authorization) => {
  const _id = await idUsuario(authorization)
  return this.getAll({ idUsuario: _id })
}

exports.usuarioJaPossuiCarrinho = async (authorization) => {
  const _id = await idUsuario(authorization)
  return {
    idUsuario: _id,
    possuiCarrinho: await this.existeCarrinho({ idUsuario: _id })
  }
}

exports.precoTotal = async (produtos) => {
  return produtos.reduce(async (precoAnterior, produto) => {
    return (await precoAnterior) + produto.precoUnitario * produto.quantidade
  }, Promise.resolve(0))
}

exports.quantidadeTotal = async (produtos) => {
  return produtos.reduce(async (quantidadeAnterior, produto) => {
    await produtosService.updateQuantidade(produto)
    return (await quantidadeAnterior) + produto.quantidade
  }, Promise.resolve(0))
}

exports.reabasteceEstoque = produtos => {
  produtos.forEach(async (produto) => {
    const { idProduto, quantidade } = produto
    const { quantidade: quantidadeEmEstoque } = await produtosService.getDadosDoProduto({ _id: idProduto })
    await produtosService.updateById(idProduto, { $set: { quantidade: quantidadeEmEstoque + quantidade } })
  })
}

const idUsuario = async (authorization) => {
  const { email, password } = authService.verifyToken(authorization)
  const { _id } = await usuariosService.getDadosDoUsuario({ email, password })
  return _id
}
