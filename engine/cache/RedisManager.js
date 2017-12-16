"use strict";
const Q = require('q')
const redis = require('redis');

const globals = require('../globals')
const switchboard = require('../switchboard')
const promiseUtils = switchboard.require('util.promises')

function RedisManager() {
	var client
	this.connect = function(url) {
		return promiseUtils.promise(() => {
            opts = opts || {no_ready_check: true}
			client = redis.createClient(url, opts)
			return
		})
	}

	this.isConnected = () => !!client
	this.getClient = () => client;
	
	this.set = set
	this.get = get
	this.getString = getString
	this.unset = unset
	
	function set(key, value) {
		return client.set(key, value)
	}

	function unset(key) {
		return client.set(key, '')
	}

	function get(key) {
		return Q.Promise((resolve, reject) => {
			client.get(key, function (err, reply) {
				if(err) return resolve()
				resolve(reply)
			});	
		})
	}

	function getString(key) {
		return Q.Promise((resolve, reject) => {
			client.get(key, function (err, reply) {
				if(err) return resolve()
				resolve(reply.toString())
			});	
		})
	}
}

module.exports = RedisManager