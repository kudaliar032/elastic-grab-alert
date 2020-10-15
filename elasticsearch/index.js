'use strict'
const {Client} = require('@elastic/elasticsearch')

const indexName = process.env.ES_INDEX

const client = new Client({
  node: {
    url: new URL(`${process.env.ES_SSL_ENABLE ? 'https' : 'http'}://${process.env.ES_HOST}:${process.env.ES_PORT}`),
    ssl: {
      rejectUnauthorized: false
    }
  },
  auth: {
    username: process.env.ES_USERNAME,
    password: process.env.ES_PASSWORD
  }
})

const getLatest = range => (new Promise(async (resolve, reject) => {
  try {
    const {body} = await client.search({
      index: indexName,
      body: {
        "from": 0,
        "size": 100,
        "query": {
          "bool": {
            "filter": [
              {
                "range": {
                  "@timestamp": {
                    "gte": `now-${range}`,
                    "lte": "now",
                  }
                }
              }
            ],
          }
        }
      }
    })
    resolve(body.hits.hits)
  } catch (e) {
    reject(e)
  }
}))

exports.getLatest = getLatest;