define({ "api": [
  {
    "type": "post",
    "url": "/authors/",
    "title": "CREATE an author",
    "name": "CreateAuthor",
    "group": "Author",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The authorization token.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/authors.js",
    "groupTitle": "Author",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/authors/"
      }
    ]
  },
  {
    "type": "delete",
    "url": "/authors/:id",
    "title": "DELETE an author",
    "name": "DeleteAuthor",
    "group": "Author",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The authorization token.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Author's unique ID.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/authors.js",
    "groupTitle": "Author",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/authors/:id"
      }
    ]
  },
  {
    "type": "get",
    "url": "/authors/:id",
    "title": "GET an author",
    "name": "GetAuthor",
    "group": "Author",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Author's unique ID.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "400",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>The request was not in a valid format.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "AuthorNotFound",
            "description": "<p>The <code>id</code> of the Author was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>You are not allowed access to the Author.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/authors.js",
    "groupTitle": "Author",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/authors/:id"
      }
    ]
  },
  {
    "type": "get",
    "url": "/authors",
    "title": "GET a group of authors",
    "name": "GetAuthors",
    "group": "Author",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "rows",
            "description": "<p>Maximum number of authors to return. Max 20.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>Page to return based on the rows.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "search",
            "description": "<p>Search string to limit the result to. Will search in author <code>name</code> only. (NYI)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"name\"",
              "\"id\""
            ],
            "optional": true,
            "field": "orderBy",
            "description": "<p>By what returned field to order by. Defaults to <code>name</code>. (NYI)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"ASC\"",
              "\"DESC\""
            ],
            "optional": true,
            "field": "order",
            "description": "<p>How to order the return set. Defaults to <code>ASC</code>. (NYI)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "count",
            "description": "<p>The total number of authors in the system</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "rows",
            "description": "<p>List of Authors (Array of Objects).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rows.id",
            "description": "<p>ID of the Author.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rows.name",
            "description": "<p>Name of the Author.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n \"count\":122,\n \"rows\":[\n    {\n       \"id\":31,\n       \"name\":\"Adam Daigle\",\n    },\n    {\n       \"id\":40,\n       \"name\":\"Alex Greenshields\",\n    }\n\t]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "400",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>The request was not in a valid format.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>You are not allowed access Authors.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": \"BadRequest\"\n}",
          "type": "400"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": \"Unauthorized\"\n}",
          "type": "401"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/authors.js",
    "groupTitle": "Author",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/authors"
      }
    ]
  },
  {
    "type": "put",
    "url": "/authors/:id",
    "title": "UPDATE an author",
    "name": "UpdateAuthor",
    "group": "Author",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The authorization token.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Author's unique ID.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/authors.js",
    "groupTitle": "Author",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/authors/:id"
      }
    ]
  },
  {
    "type": "post",
    "url": "/characters/",
    "title": "CREATE a character",
    "name": "CreateCharacter",
    "group": "Character",
    "version": "0.0.0",
    "filename": "routes/characters.js",
    "groupTitle": "Character",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/characters/"
      }
    ]
  },
  {
    "type": "delete",
    "url": "/characters/:id",
    "title": "DELETE a character",
    "name": "DeleteCharacter",
    "group": "Character",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Character's unique ID.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/characters.js",
    "groupTitle": "Character",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/characters/:id"
      }
    ]
  },
  {
    "type": "get",
    "url": "/characters/:id",
    "title": "GET a character",
    "name": "GetCharacter",
    "group": "Character",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Character's unique ID.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/characters.js",
    "groupTitle": "Character",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/characters/:id"
      }
    ]
  },
  {
    "type": "get",
    "url": "/character",
    "title": "GET a group of characters",
    "name": "GetCharacters",
    "group": "Character",
    "version": "0.0.0",
    "filename": "routes/characters.js",
    "groupTitle": "Character",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/character"
      }
    ]
  },
  {
    "type": "put",
    "url": "/characters/:id",
    "title": "UPDATE a character",
    "name": "UpdateCharacter",
    "group": "Character",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Character's unique ID.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/characters.js",
    "groupTitle": "Character",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/characters/:id"
      }
    ]
  },
  {
    "type": "post",
    "url": "/people/",
    "title": "CREATE a person",
    "name": "CreatePerson",
    "group": "People",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Person's name.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/people.js",
    "groupTitle": "People",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/people/"
      }
    ]
  },
  {
    "type": "delete",
    "url": "/people/:personId",
    "title": "DELETE a person",
    "name": "DeletePerson",
    "group": "People",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "personId",
            "description": "<p>Person's unique ID.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/people.js",
    "groupTitle": "People",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/people/:personId"
      }
    ]
  },
  {
    "type": "get",
    "url": "/people",
    "title": "GET a group of people",
    "name": "GetPeople",
    "group": "People",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "rows",
            "description": "<p>Amount of People to return. Max 20.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>Page of People to return.</p>"
          },
          {
            "group": "Parameter",
            "type": "Search",
            "optional": true,
            "field": "search",
            "description": "<p>String to limit results to. Searches on <code>name</code> and <code>pfsnumber</code>.</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>&quot;Bearer &quot; + [JSON Web Token (JWT)]</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/people.js",
    "groupTitle": "People",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/people"
      }
    ]
  },
  {
    "type": "get",
    "url": "/people/:personId",
    "title": "GET a person",
    "name": "GetPerson",
    "group": "People",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "personId",
            "description": "<p>Person's unique ID.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/people.js",
    "groupTitle": "People",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/people/:personId"
      }
    ]
  },
  {
    "type": "put",
    "url": "/people/:personId",
    "title": "UPDATE a person",
    "name": "UpdatePerson",
    "group": "People",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "personId",
            "description": "<p>Person's unique ID.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/people.js",
    "groupTitle": "People",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/people/:personId"
      }
    ]
  },
  {
    "type": "post",
    "url": "/scenarios/",
    "title": "CREATE a scenario",
    "name": "CreateScenario",
    "group": "Scenarios",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Scenario's name.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/scenarios.js",
    "groupTitle": "Scenarios",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/scenarios/"
      }
    ]
  },
  {
    "type": "delete",
    "url": "/scenarios/:scenarioId",
    "title": "DELETE a scenario",
    "name": "DeleteScenario",
    "group": "Scenarios",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "scenarioId",
            "description": "<p>Scenario's unique ID.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/scenarios.js",
    "groupTitle": "Scenarios",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/scenarios/:scenarioId"
      }
    ]
  },
  {
    "type": "get",
    "url": "/scenarios/:scenarioId",
    "title": "GET a scenario",
    "name": "GetScenario",
    "group": "Scenarios",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "scenarioId",
            "description": "<p>Scenario's unique ID.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/scenarios.js",
    "groupTitle": "Scenarios",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/scenarios/:scenarioId"
      }
    ]
  },
  {
    "type": "get",
    "url": "/scenarios",
    "title": "GET a group of scenarios",
    "name": "GetScenarios",
    "group": "Scenarios",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "rows",
            "description": "<p>Amount of Scenarios to return. Max 20.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>Page of Scenarios to return.</p>"
          },
          {
            "group": "Parameter",
            "type": "Search",
            "optional": true,
            "field": "search",
            "description": "<p>Search string to limit the result to. Will search in Scenario <code>name</code> only.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"name\"",
              "\"season\""
            ],
            "optional": true,
            "field": "orderBy",
            "description": "<p>By what field to order the response by. Defaults to <code>season</code>.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"ASC\"",
              "\"DESC\""
            ],
            "optional": true,
            "field": "order",
            "description": "<p>How to order the response. Defaults to <code>ASC</code>.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "modules",
            "description": "<p>Whether to include modules in the query.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "quests",
            "description": "<p>Whether to include quests in the query.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "aps",
            "description": "<p>Whether to include adventure paths in the query.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "scenarios",
            "description": "<p>Whether to include scenarios in the query.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "count",
            "description": "<p>total number of Scenarios that match your query.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "rows",
            "description": "<p>resulting Scenarios.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "rows.id",
            "description": "<p>ID of the Scenario.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rows.name",
            "description": "<p>Name of the Scenario.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rows.description",
            "description": "<p>Description of the Scenario.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "allowedValues": [
              "\"scenario\"",
              "\"mod\"",
              "\"ap\"",
              "\"query\""
            ],
            "optional": false,
            "field": "rows.type",
            "description": "<p>Type of the Scenario.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "rows.season",
            "description": "<p>Season of the Scenario. If not in a season, then this will show <code>99</code>.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "rows.number",
            "description": "<p>Number of the Scenario in it's season.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rows.tier",
            "description": "<p>Tier of the Scenario.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rows.levelrange",
            "description": "<p>Levels allowed, seperated by <code>|</code>, of the Scenario.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rows.link",
            "description": "<p>Paizo store link for the Scenario.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "rows.evergreen",
            "description": "<p>If the Scenario is a evergreen or not.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "rows.archived_at",
            "description": "<p>Date on which the Scenario was archived. <code>null</code> if not archived.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/scenarios.js",
    "groupTitle": "Scenarios",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/scenarios"
      }
    ]
  },
  {
    "type": "put",
    "url": "/scenarios/:scenarioId",
    "title": "UPDATE a scenario",
    "name": "UpdateScenario",
    "group": "Scenarios",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "scenarioId",
            "description": "<p>Scenario's unique ID.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/scenarios.js",
    "groupTitle": "Scenarios",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/scenarios/:scenarioId"
      }
    ]
  }
] });
