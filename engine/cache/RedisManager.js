"use strict";
const Q = require('q')
const redis = require('redis');

function RedisManager() {
	var client
	this.connect = function(url) {
		Q.Promise((resolve, reject) => {
            opts = opts || {no_ready_check: true}
			client = redis.createClient(url, opts)
			resolve()
		})
	}

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