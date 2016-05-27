"use strict"

const database = require('lib/db/database')()
var Sequelize = require('sequelize')

var DeploymentEnvironment = database.define('DeploymentEnvironment', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // Defines a vertical, non-sharable and unique label, applied
  // to all nodes in the environment. When a node is added to an
  // environment, the primary label is applied to the node, thus
  // tying it to it. If a node is removed from the environment,
  // the primary label is removed from the node. A node should only
  // be released from an environment if all containers are removed from it.
  primaryLabel: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
})

var Label = database.define('Label', {
  label: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

var Cluster = database.define('Cluster', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  provider: {
    type: Sequelize.STRING,
    allowNull: false
  }
  region: {
    type: Sequelize.STRING,
    allowNull: false
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

var Provider = database.define('Provider', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

var Node = database.define('Node', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  host: {
    type: Sequelize.STRING
  },
  ipv4: {
    type: Sequelize.STRING
  },
  ipv6: {
    type: Sequelize.STRING
  }
})

// Stack label is derived from the stack name and
// the environment label. To identify a container in a
// particular stack its labels would be:
//  deployment-env="foo"
//  stack="bar"
// Redeploy means killing all containers in the stack and reqcreate them.
var Stack = database.define('Stack', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  composeFile: {
    type: Sequelize.STRING,
    allowNull: false
  },
  upgradeStrategy: {
    type: Sequelize.ENUM('HARBORMASTER-1', 'HARBORMASTER-2'),
    allowNull: false
  }
})


Stack.belongsTo(DeploymentEnvironment)
Label.belongsToMany(Cluster, {through: 'NodeLabel'})
Cluster.hasMany(Label)
Node.belongsTo(Cluster)
Cluster.hasMany(Node)
Cluster.hasOne(Provider)
Provider.belongsToMany(Cluster, {through: 'ClusterProvider'})
DeploymentEnvironment.hasMany(Cluster)
DeploymentEnvironment.hasMany(Stack)

module.exports = {
  DeploymentEnvironment: DeploymentEnvironment,
  Stack: Stack,
  Label: Label,
  Node: Node
}
