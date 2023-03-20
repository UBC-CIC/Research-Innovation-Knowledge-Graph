/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["NEPTUNE_ENDPOINT","NEPTUNE_PORT"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/

const gremlin = require('gremlin');
const aws = require('aws-sdk');

const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
const Graph = gremlin.structure.Graph;
const P = gremlin.process.P
const Order = gremlin.process.order
const Scope = gremlin.process.scope
const Column = gremlin.process.column

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["NEPTUNE_ENDPOINT","NEPTUNE_PORT"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

exports.handler = async (event, context, callback) => {
    const dc = new DriverRemoteConnection(`wss://${Parameters.NEPTUNE_ENDPOINT}:${Parameters.NEPTUNE_PORT}/gremlin`,{});
    const graph = new Graph();
    const g = graph.traversal().withRemote(dc);
    try {
        const result = await g.V().toList()
        const vertex =  result.map(r => {
            return {'id':r.id,'label':r.label}
        })
        const result2 = await g.E().toList()
        const edge = result2.map(r => {
            console.log(r)
            return {"source": r.outV.id,"target": r.inV.id,'value':r.label}
        })
        return {'nodes':vertex,"links":edge}
      } catch (error) {
        console.error(JSON.stringify(error))
        return { error: error.message }
      }
}
