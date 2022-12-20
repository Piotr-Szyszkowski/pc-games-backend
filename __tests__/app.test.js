console.log("*** app.test.js file firing up! ***");

const db = require(`../db/connection`);
const app = require("../app.js");
const request = require("supertest");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const endpoints = require(`../all-endpoints`);
