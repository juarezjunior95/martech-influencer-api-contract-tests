
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/v1/actuator/health/liveness": {
        "get": {
          "operationId": "HealthController_liveness_v1",
          "parameters": [],
          "responses": {
            "200": {
              "description": "The Health Check is successful",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "string",
                        "example": "ok"
                      },
                      "info": {
                        "type": "object",
                        "example": {
                          "database": {
                            "status": "up"
                          }
                        },
                        "additionalProperties": {
                          "type": "object",
                          "required": [
                            "status"
                          ],
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": true
                        },
                        "nullable": true
                      },
                      "error": {
                        "type": "object",
                        "example": {},
                        "additionalProperties": {
                          "type": "object",
                          "required": [
                            "status"
                          ],
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": true
                        },
                        "nullable": true
                      },
                      "details": {
                        "type": "object",
                        "example": {
                          "database": {
                            "status": "up"
                          }
                        },
                        "additionalProperties": {
                          "type": "object",
                          "required": [
                            "status"
                          ],
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": true
                        }
                      }
                    }
                  }
                }
              }
            },
            "503": {
              "description": "The Health Check is not successful",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "string",
                        "example": "error"
                      },
                      "info": {
                        "type": "object",
                        "example": {
                          "database": {
                            "status": "up"
                          }
                        },
                        "additionalProperties": {
                          "type": "object",
                          "required": [
                            "status"
                          ],
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": true
                        },
                        "nullable": true
                      },
                      "error": {
                        "type": "object",
                        "example": {
                          "redis": {
                            "status": "down",
                            "message": "Could not connect"
                          }
                        },
                        "additionalProperties": {
                          "type": "object",
                          "required": [
                            "status"
                          ],
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": true
                        },
                        "nullable": true
                      },
                      "details": {
                        "type": "object",
                        "example": {
                          "database": {
                            "status": "up"
                          },
                          "redis": {
                            "status": "down",
                            "message": "Could not connect"
                          }
                        },
                        "additionalProperties": {
                          "type": "object",
                          "required": [
                            "status"
                          ],
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": true
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "Health"
          ]
        }
      },
      "/v1/actuator/health/readiness": {
        "get": {
          "operationId": "HealthController_readiness_v1",
          "parameters": [],
          "responses": {
            "200": {
              "description": "The Health Check is successful",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "string",
                        "example": "ok"
                      },
                      "info": {
                        "type": "object",
                        "example": {
                          "database": {
                            "status": "up"
                          }
                        },
                        "additionalProperties": {
                          "type": "object",
                          "required": [
                            "status"
                          ],
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": true
                        },
                        "nullable": true
                      },
                      "error": {
                        "type": "object",
                        "example": {},
                        "additionalProperties": {
                          "type": "object",
                          "required": [
                            "status"
                          ],
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": true
                        },
                        "nullable": true
                      },
                      "details": {
                        "type": "object",
                        "example": {
                          "database": {
                            "status": "up"
                          }
                        },
                        "additionalProperties": {
                          "type": "object",
                          "required": [
                            "status"
                          ],
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": true
                        }
                      }
                    }
                  }
                }
              }
            },
            "503": {
              "description": "The Health Check is not successful",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "string",
                        "example": "error"
                      },
                      "info": {
                        "type": "object",
                        "example": {
                          "database": {
                            "status": "up"
                          }
                        },
                        "additionalProperties": {
                          "type": "object",
                          "required": [
                            "status"
                          ],
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": true
                        },
                        "nullable": true
                      },
                      "error": {
                        "type": "object",
                        "example": {
                          "redis": {
                            "status": "down",
                            "message": "Could not connect"
                          }
                        },
                        "additionalProperties": {
                          "type": "object",
                          "required": [
                            "status"
                          ],
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": true
                        },
                        "nullable": true
                      },
                      "details": {
                        "type": "object",
                        "example": {
                          "database": {
                            "status": "up"
                          },
                          "redis": {
                            "status": "down",
                            "message": "Could not connect"
                          }
                        },
                        "additionalProperties": {
                          "type": "object",
                          "required": [
                            "status"
                          ],
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": true
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "Health"
          ]
        }
      },
      "/v1/campaigns": {
        "post": {
          "operationId": "CampaignController_create_v1",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateCampaignRequestDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CreateCampaignResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "campaigns"
          ]
        }
      },
      "/v1/campaigns/{id}": {
        "patch": {
          "operationId": "CampaignController_update_v1",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateCampaignRequestDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UpdateCampaignResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "campaigns"
          ]
        }
      },
      "/v1/brands": {
        "get": {
          "operationId": "BrandController_list_v1",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ListBrandsResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "brands"
          ]
        },
        "post": {
          "operationId": "BrandController_create_v1",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateBrandRequestDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CreateBrandResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "brands"
          ]
        }
      },
      "/v1/brands/{id}": {
        "patch": {
          "operationId": "BrandController_update_v1",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateBrandRequestDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UpdateBrandResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "brands"
          ]
        }
      },
      "/v1/markets": {
        "get": {
          "operationId": "MarketController_list_v1",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ListMarketsResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "markets"
          ]
        },
        "post": {
          "operationId": "MarketController_create_v1",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateMarketRequestDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CreateMarketResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "markets"
          ]
        }
      },
      "/v1/markets/{id}": {
        "patch": {
          "operationId": "MarketController_update_v1",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateMarketRequestDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UpdateMarketResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "markets"
          ]
        }
      },
      "/v1/megaplatforms": {
        "get": {
          "operationId": "MegaplatformController_list_v1",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ListMegaplatformsResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "megaplatforms"
          ]
        },
        "post": {
          "operationId": "MegaplatformController_create_v1",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateMegaplatformRequestDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CreateMegaplatformResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "megaplatforms"
          ]
        }
      },
      "/v1/megaplatforms/{id}": {
        "patch": {
          "operationId": "MegaplatformController_update_v1",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateMegaplatformRequestDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UpdateMegaplatformResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "megaplatforms"
          ]
        }
      },
      "/v1/platforms": {
        "get": {
          "operationId": "PlatformController_list_v1",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ListPlatformsResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "platforms"
          ]
        },
        "post": {
          "operationId": "PlatformController_create_v1",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreatePlatformRequestDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CreatePlatformResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "platforms"
          ]
        }
      },
      "/v1/platforms/{id}": {
        "patch": {
          "operationId": "PlatformController_update_v1",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdatePlatformRequestDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UpdatePlatformResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "platforms"
          ]
        }
      },
      "/v1/partner-types": {
        "get": {
          "operationId": "PartnerTypeController_listAll_v1",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ListPartnerTypesResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "partner-types"
          ]
        },
        "post": {
          "operationId": "PartnerTypeController_createOne_v1",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreatePartnerTypeRequestDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CreatePartnerTypeResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "partner-types"
          ]
        }
      },
      "/v1/partner-types/{id}": {
        "patch": {
          "operationId": "PartnerTypeController_updateOne_v1",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdatePartnerTypeRequestDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UpdatePartnerTypeResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "partner-types"
          ]
        }
      },
      "/v1/partner-activation-intentions": {
        "get": {
          "operationId": "PartnerActivationIntentionController_listAll_v1",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ListPartnerActivationIntentionsResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "partner-activation-intentions"
          ]
        },
        "post": {
          "operationId": "PartnerActivationIntentionController_createOne_v1",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreatePartnerActivationIntentionRequestDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CreatePartnerActivationIntentionResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "partner-activation-intentions"
          ]
        }
      },
      "/v1/partner-activation-intentions/{id}": {
        "patch": {
          "operationId": "PartnerActivationIntentionController_updateOne_v1",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdatePartnerActivationIntentionRequestDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UpdatePartnerActivationIntentionResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "partner-activation-intentions"
          ]
        }
      },
      "/v1/partners/search": {
        "get": {
          "operationId": "PartnerSearchController_search_v1",
          "parameters": [
            {
              "name": "search",
              "required": true,
              "in": "query",
              "description": "Partial match on partner name.",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "page",
              "required": false,
              "in": "query",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "default": 20,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SearchPartnersResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "partners"
          ]
        }
      },
      "/v1/role-titles": {
        "get": {
          "operationId": "RoleTitleController_list_v1",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ListRoleTitlesResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "role-titles"
          ]
        },
        "post": {
          "operationId": "RoleTitleController_create_v1",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateRoleTitleRequestDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CreateRoleTitleResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "role-titles"
          ]
        }
      },
      "/v1/role-titles/{id}": {
        "patch": {
          "operationId": "RoleTitleController_update_v1",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateRoleTitleRequestDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UpdateRoleTitleResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "role-titles"
          ]
        }
      },
      "/v1/zones": {
        "get": {
          "operationId": "ZoneController_list_v1",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ListZonesResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "zones"
          ]
        },
        "post": {
          "operationId": "ZoneController_create_v1",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateZoneRequestDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CreateZoneResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "zones"
          ]
        }
      },
      "/v1/zones/{id}": {
        "patch": {
          "operationId": "ZoneController_update_v1",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateZoneRequestDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UpdateZoneResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "zones"
          ]
        }
      },
      "/v1/users": {
        "get": {
          "operationId": "UserController_list_v1",
          "parameters": [
            {
              "name": "search",
              "required": false,
              "in": "query",
              "description": "Partial, case-insensitive match on email.",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "page",
              "required": false,
              "in": "query",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "default": 40,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ListUsersResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "users"
          ]
        },
        "post": {
          "operationId": "UserController_create_v1",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateUserRequestDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CreateUserResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "users"
          ]
        }
      },
      "/v1/users/search": {
        "get": {
          "operationId": "UserController_search_v1",
          "parameters": [
            {
              "name": "search",
              "required": true,
              "in": "query",
              "description": "Partial, case-insensitive match on platform user email.",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "page",
              "required": false,
              "in": "query",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "default": 20,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SearchPlatformUsersResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "users"
          ]
        }
      },
      "/v1/users/{id}": {
        "patch": {
          "operationId": "UserController_update_v1",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateUserRequestDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UpdateUserResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "users"
          ]
        }
      }
    },
    "info": {
      "title": "Martech Connect Influencer API",
      "description": "Martech Connect Influencer API",
      "version": "1.0",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "schemas": {
        "CreateCampaignPartnerDto": {
          "type": "object",
          "properties": {
            "partnerId": {
              "type": "string",
              "format": "uuid"
            },
            "partnerTypeId": {
              "type": "string",
              "format": "uuid"
            },
            "contractType": {
              "type": "string",
              "enum": [
                "PAID",
                "UNPAID"
              ]
            },
            "activationIntentionIds": {
              "type": "array",
              "items": {
                "type": "string",
                "format": "uuid"
              }
            }
          },
          "required": [
            "partnerId"
          ]
        },
        "CreateCampaignRequestDto": {
          "type": "object",
          "properties": {
            "status": {
              "type": "string",
              "enum": [
                "DRAFT",
                "UNDER_REVIEW"
              ]
            },
            "name": {
              "type": "string"
            },
            "brandId": {
              "type": "string",
              "format": "uuid"
            },
            "megaplatformId": {
              "type": "string",
              "format": "uuid"
            },
            "marketIds": {
              "type": "array",
              "items": {
                "type": "string",
                "format": "uuid"
              }
            },
            "platformIds": {
              "type": "array",
              "items": {
                "type": "string",
                "format": "uuid"
              }
            },
            "keywords": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "dtStart": {
              "type": "string"
            },
            "dtEnd": {
              "type": "string"
            },
            "objective": {
              "type": "string"
            },
            "promotionalPartnerCampaignRole": {
              "type": "string"
            },
            "budget": {
              "type": "string",
              "nullable": true
            },
            "partners": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/CreateCampaignPartnerDto"
              }
            }
          },
          "required": [
            "status",
            "name"
          ]
        },
        "CreateCampaignResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            }
          },
          "required": [
            "id"
          ]
        },
        "UpdateCampaignPartnerValueDto": {
          "type": "object",
          "properties": {
            "partnerId": {
              "type": "string",
              "format": "uuid"
            },
            "partnerTypeId": {
              "type": "string",
              "format": "uuid"
            },
            "contractType": {
              "type": "string",
              "enum": [
                "PAID",
                "UNPAID"
              ]
            },
            "activationIntentionIds": {
              "type": "array",
              "items": {
                "type": "string",
                "format": "uuid"
              }
            }
          },
          "required": [
            "partnerId"
          ]
        },
        "UpdateCampaignPartnerOperationDto": {
          "type": "object",
          "properties": {
            "op": {
              "type": "string",
              "enum": [
                "add",
                "replace",
                "remove"
              ]
            },
            "value": {
              "$ref": "#/components/schemas/UpdateCampaignPartnerValueDto"
            }
          },
          "required": [
            "op",
            "value"
          ]
        },
        "UpdateCampaignRequestDto": {
          "type": "object",
          "properties": {
            "status": {
              "type": "string",
              "enum": [
                "DRAFT",
                "UNDER_REVIEW"
              ]
            },
            "name": {
              "type": "string"
            },
            "brandId": {
              "type": "string",
              "format": "uuid"
            },
            "megaplatformId": {
              "type": "string",
              "format": "uuid"
            },
            "marketIds": {
              "type": "array",
              "items": {
                "type": "string",
                "format": "uuid"
              }
            },
            "platformIds": {
              "type": "array",
              "items": {
                "type": "string",
                "format": "uuid"
              }
            },
            "keywords": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "dtStart": {
              "type": "string"
            },
            "dtEnd": {
              "type": "string"
            },
            "objective": {
              "type": "string"
            },
            "promotionalPartnerCampaignRole": {
              "type": "string"
            },
            "budget": {
              "type": "string",
              "nullable": true
            },
            "partners": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/UpdateCampaignPartnerOperationDto"
              }
            }
          }
        },
        "UpdateCampaignResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            }
          },
          "required": [
            "id"
          ]
        },
        "BrandItemDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            },
            "name": {
              "type": "string"
            },
            "isGlobal": {
              "type": "boolean"
            }
          },
          "required": [
            "id",
            "name",
            "isGlobal"
          ]
        },
        "ListBrandsResponseDto": {
          "type": "object",
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/BrandItemDto"
              }
            }
          },
          "required": [
            "items"
          ]
        },
        "CreateBrandRequestDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "maxLength": 200
            },
            "isGlobal": {
              "type": "boolean",
              "default": false
            }
          },
          "required": [
            "name"
          ]
        },
        "CreateBrandResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            }
          },
          "required": [
            "id"
          ]
        },
        "UpdateBrandRequestDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "maxLength": 200
            },
            "active": {
              "type": "boolean"
            },
            "isGlobal": {
              "type": "boolean"
            }
          }
        },
        "UpdateBrandResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            }
          },
          "required": [
            "id"
          ]
        },
        "MarketItemDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            },
            "name": {
              "type": "string"
            },
            "zoneId": {
              "type": "object",
              "format": "uuid",
              "nullable": true
            }
          },
          "required": [
            "id",
            "name",
            "zoneId"
          ]
        },
        "ListMarketsResponseDto": {
          "type": "object",
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/MarketItemDto"
              }
            }
          },
          "required": [
            "items"
          ]
        },
        "CreateMarketRequestDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "maxLength": 200
            },
            "zoneId": {
              "type": "string",
              "format": "uuid",
              "nullable": true
            }
          },
          "required": [
            "name"
          ]
        },
        "CreateMarketResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            }
          },
          "required": [
            "id"
          ]
        },
        "UpdateMarketRequestDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "maxLength": 200
            },
            "active": {
              "type": "boolean"
            },
            "zoneId": {
              "type": "object",
              "format": "uuid",
              "nullable": true
            }
          }
        },
        "UpdateMarketResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            }
          },
          "required": [
            "id"
          ]
        },
        "MegaplatformItemDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            },
            "name": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "name"
          ]
        },
        "ListMegaplatformsResponseDto": {
          "type": "object",
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/MegaplatformItemDto"
              }
            }
          },
          "required": [
            "items"
          ]
        },
        "CreateMegaplatformRequestDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "maxLength": 200
            }
          },
          "required": [
            "name"
          ]
        },
        "CreateMegaplatformResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            }
          },
          "required": [
            "id"
          ]
        },
        "UpdateMegaplatformRequestDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "maxLength": 200
            },
            "active": {
              "type": "boolean"
            }
          }
        },
        "UpdateMegaplatformResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            }
          },
          "required": [
            "id"
          ]
        },
        "PlatformItemDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            },
            "name": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "name"
          ]
        },
        "ListPlatformsResponseDto": {
          "type": "object",
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/PlatformItemDto"
              }
            }
          },
          "required": [
            "items"
          ]
        },
        "CreatePlatformRequestDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "maxLength": 200
            }
          },
          "required": [
            "name"
          ]
        },
        "CreatePlatformResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            }
          },
          "required": [
            "id"
          ]
        },
        "UpdatePlatformRequestDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "maxLength": 200
            },
            "active": {
              "type": "boolean"
            }
          }
        },
        "UpdatePlatformResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            }
          },
          "required": [
            "id"
          ]
        },
        "PartnerTypeItemDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            },
            "name": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "name"
          ]
        },
        "ListPartnerTypesResponseDto": {
          "type": "object",
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/PartnerTypeItemDto"
              }
            }
          },
          "required": [
            "items"
          ]
        },
        "CreatePartnerTypeRequestDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "maxLength": 200
            }
          },
          "required": [
            "name"
          ]
        },
        "CreatePartnerTypeResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            }
          },
          "required": [
            "id"
          ]
        },
        "UpdatePartnerTypeRequestDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "maxLength": 200
            },
            "active": {
              "type": "boolean"
            }
          }
        },
        "UpdatePartnerTypeResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            }
          },
          "required": [
            "id"
          ]
        },
        "PartnerActivationIntentionItemDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            },
            "name": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "name"
          ]
        },
        "ListPartnerActivationIntentionsResponseDto": {
          "type": "object",
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/PartnerActivationIntentionItemDto"
              }
            }
          },
          "required": [
            "items"
          ]
        },
        "CreatePartnerActivationIntentionRequestDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "maxLength": 200
            }
          },
          "required": [
            "name"
          ]
        },
        "CreatePartnerActivationIntentionResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            }
          },
          "required": [
            "id"
          ]
        },
        "UpdatePartnerActivationIntentionRequestDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "maxLength": 200
            },
            "active": {
              "type": "boolean"
            }
          }
        },
        "UpdatePartnerActivationIntentionResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            }
          },
          "required": [
            "id"
          ]
        },
        "PartnerTopicDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            }
          },
          "required": [
            "name"
          ]
        },
        "PartnerLdaAgeDto": {
          "type": "object",
          "properties": {
            "minAge": {
              "type": "number"
            },
            "percent": {
              "type": "number"
            }
          },
          "required": [
            "minAge",
            "percent"
          ]
        },
        "PartnerLdaDto": {
          "type": "object",
          "properties": {
            "marketName": {
              "type": "string"
            },
            "ages": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/PartnerLdaAgeDto"
              }
            }
          },
          "required": [
            "marketName",
            "ages"
          ]
        },
        "PartnerSearchItemDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            },
            "name": {
              "type": "string"
            },
            "profileImageUrl": {
              "type": "string",
              "nullable": true
            },
            "country": {
              "type": "string"
            },
            "topics": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/PartnerTopicDto"
              }
            },
            "followersCount": {
              "type": "number"
            },
            "engagementRate": {
              "type": "number"
            },
            "lda": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/PartnerLdaDto"
              }
            }
          },
          "required": [
            "id",
            "name",
            "profileImageUrl",
            "country",
            "topics",
            "followersCount",
            "engagementRate",
            "lda"
          ]
        },
        "SearchPartnersResponseDto": {
          "type": "object",
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/PartnerSearchItemDto"
              }
            },
            "page": {
              "type": "number"
            },
            "pageSize": {
              "type": "number"
            },
            "total": {
              "type": "number"
            }
          },
          "required": [
            "items",
            "page",
            "pageSize",
            "total"
          ]
        },
        "RoleTitleItemDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            },
            "name": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "name"
          ]
        },
        "ListRoleTitlesResponseDto": {
          "type": "object",
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/RoleTitleItemDto"
              }
            }
          },
          "required": [
            "items"
          ]
        },
        "CreateRoleTitleRequestDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "maxLength": 200
            }
          },
          "required": [
            "name"
          ]
        },
        "CreateRoleTitleResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            }
          },
          "required": [
            "id"
          ]
        },
        "UpdateRoleTitleRequestDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "maxLength": 200
            },
            "active": {
              "type": "boolean"
            }
          }
        },
        "UpdateRoleTitleResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            }
          },
          "required": [
            "id"
          ]
        },
        "ZoneItemDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            },
            "name": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "name"
          ]
        },
        "ListZonesResponseDto": {
          "type": "object",
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ZoneItemDto"
              }
            }
          },
          "required": [
            "items"
          ]
        },
        "CreateZoneRequestDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "maxLength": 200
            }
          },
          "required": [
            "name"
          ]
        },
        "CreateZoneResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            }
          },
          "required": [
            "id"
          ]
        },
        "UpdateZoneRequestDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "maxLength": 200
            },
            "active": {
              "type": "boolean"
            }
          }
        },
        "UpdateZoneResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            }
          },
          "required": [
            "id"
          ]
        },
        "UserItemDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            },
            "email": {
              "type": "string"
            },
            "active": {
              "type": "boolean"
            },
            "isGlobal": {
              "type": "boolean"
            },
            "roleTitle": {
              "$ref": "#/components/schemas/RoleTitleItemDto"
            },
            "markets": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/MarketItemDto"
              }
            },
            "brands": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/BrandItemDto"
              }
            },
            "zones": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ZoneItemDto"
              }
            }
          },
          "required": [
            "id",
            "email",
            "active",
            "isGlobal",
            "roleTitle",
            "markets",
            "brands",
            "zones"
          ]
        },
        "ListUsersResponseDto": {
          "type": "object",
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/UserItemDto"
              }
            },
            "page": {
              "type": "number"
            },
            "pageSize": {
              "type": "number"
            },
            "total": {
              "type": "number"
            }
          },
          "required": [
            "items",
            "page",
            "pageSize",
            "total"
          ]
        },
        "PlatformUserItemDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            }
          },
          "required": [
            "email"
          ]
        },
        "SearchPlatformUsersResponseDto": {
          "type": "object",
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/PlatformUserItemDto"
              }
            },
            "page": {
              "type": "number"
            },
            "pageSize": {
              "type": "number"
            },
            "total": {
              "type": "number"
            }
          },
          "required": [
            "items",
            "page",
            "pageSize",
            "total"
          ]
        },
        "CreateUserRequestDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            },
            "roleTitleId": {
              "type": "string",
              "format": "uuid"
            },
            "marketIds": {
              "type": "array",
              "items": {
                "type": "string",
                "format": "uuid"
              }
            },
            "brandIds": {
              "type": "array",
              "items": {
                "type": "string",
                "format": "uuid"
              }
            },
            "zoneIds": {
              "type": "array",
              "items": {
                "type": "string",
                "format": "uuid"
              }
            }
          },
          "required": [
            "email",
            "roleTitleId",
            "marketIds",
            "brandIds",
            "zoneIds"
          ]
        },
        "CreateUserResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            }
          },
          "required": [
            "id"
          ]
        },
        "UpdateUserRequestDto": {
          "type": "object",
          "properties": {
            "roleTitleId": {
              "type": "string",
              "format": "uuid"
            },
            "active": {
              "type": "boolean"
            },
            "marketIds": {
              "type": "array",
              "items": {
                "type": "string",
                "format": "uuid"
              }
            },
            "brandIds": {
              "type": "array",
              "items": {
                "type": "string",
                "format": "uuid"
              }
            },
            "zoneIds": {
              "type": "array",
              "items": {
                "type": "string",
                "format": "uuid"
              }
            }
          }
        },
        "UpdateUserResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            }
          },
          "required": [
            "id"
          ]
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
