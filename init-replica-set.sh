#!/bin/bash
set -e

mongosh <<EOF
var config = {
    "_id": "rs0",
    "members": [
        {
            "_id": 0,
            "host": "localhost:27017"
        }
    ]
};
rs.initiate(config);
EOF
