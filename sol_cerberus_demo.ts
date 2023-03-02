export type SolCerberusDemo = {
  "version": "0.1.0",
  "name": "sol_cerberus_demo",
  "instructions": [
    {
      "name": "initializeDemo",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "demo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "solCerberusApp",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "addSquare",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "demo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solCerberusApp",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solCerberusRule",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusRole",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusTokenAcc",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberus",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "color",
          "type": "string"
        },
        {
          "name": "size",
          "type": "u16"
        }
      ]
    },
    {
      "name": "addCircle",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "demo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solCerberusApp",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solCerberusRule",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusRole",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusTokenAcc",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberus",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "color",
          "type": "string"
        },
        {
          "name": "size",
          "type": "u16"
        }
      ]
    },
    {
      "name": "addTriangle",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "demo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solCerberusApp",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solCerberusRule",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusRole",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusTokenAcc",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberus",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "color",
          "type": "string"
        },
        {
          "name": "size",
          "type": "u16"
        }
      ]
    },
    {
      "name": "updateSquare",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "demo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solCerberusApp",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solCerberusRule",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusRole",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusTokenAcc",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberus",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "color",
          "type": "string"
        },
        {
          "name": "size",
          "type": "u16"
        }
      ]
    },
    {
      "name": "updateCircle",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "demo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solCerberusApp",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solCerberusRule",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusRole",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusTokenAcc",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberus",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "color",
          "type": "string"
        },
        {
          "name": "size",
          "type": "u16"
        }
      ]
    },
    {
      "name": "updateTriangle",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "demo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solCerberusApp",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solCerberusRule",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusRole",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusTokenAcc",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberus",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "color",
          "type": "string"
        },
        {
          "name": "size",
          "type": "u16"
        }
      ]
    },
    {
      "name": "deleteSquare",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "demo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solCerberusApp",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solCerberusRule",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusRole",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusTokenAcc",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberus",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "deleteCircle",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "demo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solCerberusApp",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solCerberusRule",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusRole",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusTokenAcc",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberus",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "deleteTriangle",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "demo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solCerberusApp",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solCerberusRule",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusRole",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusTokenAcc",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberus",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "demo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "solCerberusApp",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "square",
            "type": {
              "option": {
                "defined": "Square"
              }
            }
          },
          {
            "name": "circle",
            "type": {
              "option": {
                "defined": "Circle"
              }
            }
          },
          {
            "name": "triangle",
            "type": {
              "option": {
                "defined": "Triangle"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Square",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "size",
            "type": "u16"
          },
          {
            "name": "color",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "Circle",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "size",
            "type": "u16"
          },
          {
            "name": "color",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "Triangle",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "size",
            "type": "u16"
          },
          {
            "name": "color",
            "type": "string"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidColor",
      "msg": "Invalid color! The color must have 6 ASCII alphanumeric characters"
    },
    {
      "code": 6001,
      "name": "ShapeAlreadyExists",
      "msg": "Shape already exists!"
    }
  ]
};

export const IDL: SolCerberusDemo = {
  "version": "0.1.0",
  "name": "sol_cerberus_demo",
  "instructions": [
    {
      "name": "initializeDemo",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "demo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "solCerberusApp",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "addSquare",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "demo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solCerberusApp",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solCerberusRule",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusRole",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusTokenAcc",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberus",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "color",
          "type": "string"
        },
        {
          "name": "size",
          "type": "u16"
        }
      ]
    },
    {
      "name": "addCircle",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "demo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solCerberusApp",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solCerberusRule",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusRole",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusTokenAcc",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberus",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "color",
          "type": "string"
        },
        {
          "name": "size",
          "type": "u16"
        }
      ]
    },
    {
      "name": "addTriangle",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "demo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solCerberusApp",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solCerberusRule",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusRole",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusTokenAcc",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberus",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "color",
          "type": "string"
        },
        {
          "name": "size",
          "type": "u16"
        }
      ]
    },
    {
      "name": "updateSquare",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "demo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solCerberusApp",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solCerberusRule",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusRole",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusTokenAcc",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberus",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "color",
          "type": "string"
        },
        {
          "name": "size",
          "type": "u16"
        }
      ]
    },
    {
      "name": "updateCircle",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "demo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solCerberusApp",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solCerberusRule",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusRole",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusTokenAcc",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberus",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "color",
          "type": "string"
        },
        {
          "name": "size",
          "type": "u16"
        }
      ]
    },
    {
      "name": "updateTriangle",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "demo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solCerberusApp",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solCerberusRule",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusRole",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusTokenAcc",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberus",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "color",
          "type": "string"
        },
        {
          "name": "size",
          "type": "u16"
        }
      ]
    },
    {
      "name": "deleteSquare",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "demo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solCerberusApp",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solCerberusRule",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusRole",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusTokenAcc",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberus",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "deleteCircle",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "demo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solCerberusApp",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solCerberusRule",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusRole",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusTokenAcc",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberus",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "deleteTriangle",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "demo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solCerberusApp",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solCerberusRule",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusRole",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusTokenAcc",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberusMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "solCerberus",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "demo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "solCerberusApp",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "square",
            "type": {
              "option": {
                "defined": "Square"
              }
            }
          },
          {
            "name": "circle",
            "type": {
              "option": {
                "defined": "Circle"
              }
            }
          },
          {
            "name": "triangle",
            "type": {
              "option": {
                "defined": "Triangle"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Square",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "size",
            "type": "u16"
          },
          {
            "name": "color",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "Circle",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "size",
            "type": "u16"
          },
          {
            "name": "color",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "Triangle",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "size",
            "type": "u16"
          },
          {
            "name": "color",
            "type": "string"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidColor",
      "msg": "Invalid color! The color must have 6 ASCII alphanumeric characters"
    },
    {
      "code": 6001,
      "name": "ShapeAlreadyExists",
      "msg": "Shape already exists!"
    }
  ]
};
