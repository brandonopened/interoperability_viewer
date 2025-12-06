import { Specification } from '../types/specification';

export const specifications: Specification[] = [
  {
    id: 'clr-2.0',
    name: 'CLR 2.0',
    fullName: 'Comprehensive Learner Record 2.0',
    version: '2.0',
    organization: '1EdTech',
    description: 'A set of assertions that can be packaged as a credential representing an individual\'s achievements from multiple learning providers in machine-readable format.',
    specUrl: 'https://www.imsglobal.org/spec/clr/v2p0/',
    schema: {
      type: 'json-schema',
      content: {
        openapi: '3.0.0',
        info: {
          title: 'CLR 2.0 API',
          version: '2.0',
          description: 'Comprehensive Learner Record specification API'
        },
        components: {
          schemas: {
            ClrCredential: {
              type: 'object',
              description: 'A Comprehensive Learner Record credential containing achievements',
              required: ['@context', 'id', 'type', 'issuer', 'validFrom', 'credentialSubject'],
              properties: {
                '@context': {
                  type: 'array',
                  description: 'JSON-LD context',
                  items: { type: 'string' }
                },
                id: {
                  type: 'string',
                  format: 'uri',
                  description: 'Unique identifier for the credential'
                },
                type: {
                  type: 'array',
                  description: 'Type of credential',
                  items: { type: 'string' }
                },
                issuer: {
                  type: 'object',
                  description: 'Entity that issued the credential',
                  properties: {
                    id: { type: 'string', format: 'uri' },
                    name: { type: 'string' },
                    url: { type: 'string', format: 'uri' }
                  }
                },
                validFrom: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Date and time when the credential becomes valid'
                },
                credentialSubject: {
                  type: 'object',
                  description: 'The subject of the credential (learner)',
                  properties: {
                    id: { type: 'string', format: 'uri' },
                    type: { type: 'string' },
                    verifiableCredential: {
                      type: 'array',
                      description: 'Array of achievement credentials',
                      items: { $ref: '#/components/schemas/AchievementCredential' }
                    },
                    achievements: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Achievement' }
                    }
                  }
                },
                proof: {
                  type: 'object',
                  description: 'Cryptographic proof'
                }
              }
            },
            AchievementCredential: {
              type: 'object',
              description: 'A credential representing a specific achievement',
              properties: {
                '@context': { type: 'array', items: { type: 'string' } },
                id: { type: 'string', format: 'uri' },
                type: { type: 'array', items: { type: 'string' } },
                issuer: { type: 'object' },
                validFrom: { type: 'string', format: 'date-time' },
                credentialSubject: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uri' },
                    achievement: { $ref: '#/components/schemas/Achievement' },
                    result: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Result' }
                    }
                  }
                }
              }
            },
            Achievement: {
              type: 'object',
              description: 'Describes what was achieved',
              properties: {
                id: { type: 'string', format: 'uri' },
                type: { type: 'string' },
                name: { type: 'string', description: 'Name of the achievement' },
                description: { type: 'string', description: 'Description of the achievement' },
                criteria: {
                  type: 'object',
                  description: 'Criteria for earning the achievement'
                },
                alignment: {
                  type: 'array',
                  description: 'Skills or competencies aligned to the achievement',
                  items: { type: 'object' }
                }
              }
            },
            Result: {
              type: 'object',
              description: 'Results or outcomes of the achievement',
              properties: {
                type: { type: 'string' },
                achievedLevel: { type: 'string' },
                resultDescription: { type: 'string' },
                value: { type: 'string' }
              }
            },
            Profile: {
              type: 'object',
              description: 'Profile information about issuer or subject',
              properties: {
                id: { type: 'string', format: 'uri' },
                type: { type: 'string' },
                name: { type: 'string' },
                url: { type: 'string', format: 'uri' },
                email: { type: 'string', format: 'email' }
              }
            }
          }
        }
      }
    },
    example: `{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://purl.imsglobal.org/spec/clr/v2p0/context-2.0.1.json"
  ],
  "id": "https://example.edu/credentials/clr/3732",
  "type": ["VerifiableCredential", "ClrCredential"],
  "issuer": {
    "id": "https://example.edu",
    "name": "Example University",
    "url": "https://example.edu"
  },
  "validFrom": "2024-01-15T00:00:00Z",
  "credentialSubject": {
    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
    "type": "ClrSubject",
    "verifiableCredential": [
      {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://purl.imsglobal.org/spec/clr/v2p0/context-2.0.1.json"
        ],
        "id": "https://example.edu/credentials/achievement/8374",
        "type": ["VerifiableCredential", "AchievementCredential"],
        "issuer": {
          "id": "https://example.edu",
          "name": "Example University"
        },
        "validFrom": "2024-01-15T00:00:00Z",
        "credentialSubject": {
          "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
          "achievement": {
            "id": "https://example.edu/achievements/data-science-cert",
            "type": "Achievement",
            "name": "Data Science Certificate",
            "description": "Completed advanced data science program",
            "criteria": {
              "narrative": "Completed 12 courses in data science"
            },
            "alignment": [
              {
                "type": "Alignment",
                "targetName": "Data Analysis",
                "targetUrl": "https://skills.example.org/data-analysis"
              }
            ]
          },
          "result": [
            {
              "type": "Result",
              "achievedLevel": "Excellent",
              "resultDescription": "Final GPA",
              "value": "3.9"
            }
          ]
        }
      }
    ]
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2024-01-15T12:00:00Z",
    "verificationMethod": "https://example.edu/keys/1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z58DAdFfa9SkqZMVPxAQpic7ndSayn1PzZs6ZjWp1CktyGesjuTSwRdoWhAfGFCF5bppETSTojQCrfFPP2oumHKtz"
  }
}`,
    diagram: `graph TB
    CLR[CLR Credential]
    Issuer[Issuer Profile]
    Subject[Credential Subject]
    AC[Achievement Credential]
    Achievement[Achievement]
    Result[Result]
    Evidence[Evidence]
    Alignment[Skill Alignment]

    CLR -->|issued by| Issuer
    CLR -->|about| Subject
    Subject -->|contains| AC
    AC -->|describes| Achievement
    AC -->|has| Result
    AC -->|supported by| Evidence
    Achievement -->|aligned to| Alignment

    style CLR fill:#3b82f6,stroke:#1e40af,color:#fff
    style AC fill:#10b981,stroke:#059669,color:#fff
    style Achievement fill:#f59e0b,stroke:#d97706,color:#fff
    style Subject fill:#8b5cf6,stroke:#6d28d9,color:#fff`,
    terms: [
      {
        name: 'ClrCredential',
        description: 'The top-level credential containing a comprehensive learner record',
        type: 'VerifiableCredential',
        relationships: ['issuer', 'credentialSubject', 'proof']
      },
      {
        name: 'VerifiableCredential',
        description: 'A tamper-evident credential whose issuer can be cryptographically verified',
        type: 'Credential'
      },
      {
        name: 'Credential Subject',
        description: 'The entity (typically a learner) about whom claims are made',
        type: 'ClrSubject',
        relationships: ['verifiableCredential', 'achievements']
      },
      {
        name: 'Issuer',
        description: 'Entity asserting claims and creating verifiable credentials',
        type: 'Profile',
        relationships: ['ClrCredential', 'AchievementCredential']
      },
      {
        name: 'Achievement',
        description: 'Content description of what was achieved with metadata like name, description, and skill alignments',
        type: 'Achievement',
        relationships: ['criteria', 'alignment', 'result']
      },
      {
        name: 'AchievementCredential',
        description: 'A verifiable credential representing a specific achievement',
        type: 'VerifiableCredential',
        relationships: ['achievement', 'result', 'evidence']
      },
      {
        name: 'Evidence',
        description: 'Information supporting claims, such as artifacts produced by learners',
        type: 'Evidence'
      },
      {
        name: 'Result',
        description: 'Outcomes or measurements associated with an achievement',
        type: 'Result',
        relationships: ['achievement']
      },
      {
        name: 'Alignment',
        description: 'Link between an achievement and external frameworks, skills, or competencies',
        type: 'Alignment',
        relationships: ['achievement']
      },
      {
        name: 'Profile',
        description: 'Information about an organization or person',
        type: 'Profile'
      }
    ]
  },
  {
    id: 'case-1.0',
    name: 'CASE 1.0',
    fullName: 'Competencies and Academic Standards Exchange 1.0',
    version: '1.0',
    organization: '1EdTech',
    description: 'A machine-readable specification for documenting learning standards and competencies, enabling electronic exchange of competency and standards data across educational systems with referenceable unique identifiers.',
    specUrl: 'https://www.imsglobal.org/spec/case/v1p0/',
    schema: {
      type: 'json-schema',
      content: {
        openapi: '3.0.0',
        info: {
          title: 'CASE 1.0 API',
          version: '1.0',
          description: 'Competencies and Academic Standards Exchange API'
        },
        components: {
          schemas: {
            CFDocument: {
              type: 'object',
              description: 'A competency framework document that serves as the container for learning standards',
              properties: {
                identifier: { type: 'string', format: 'uri', description: 'Unique identifier for the document' },
                uri: { type: 'string', format: 'uri', description: 'Canonical URI for the document' },
                creator: { type: 'string', description: 'Entity that created the framework' },
                title: { type: 'string', description: 'Name of the framework document' },
                description: { type: 'string', description: 'Description of the framework' },
                subject: { type: 'array', items: { type: 'string' }, description: 'Subject areas covered' },
                language: { type: 'string', description: 'Language of the framework' },
                version: { type: 'string', description: 'Version of the framework' },
                adoptionStatus: { type: 'string', description: 'Status of framework adoption' }
              }
            },
            CFItem: {
              type: 'object',
              description: 'An individual competency or learning standard within a framework',
              properties: {
                identifier: { type: 'string', format: 'uri', description: 'Unique identifier for the item' },
                uri: { type: 'string', format: 'uri', description: 'Canonical URI for the item' },
                fullStatement: { type: 'string', description: 'Complete text of the competency or standard' },
                humanCodingScheme: { type: 'string', description: 'Human-readable code for the item' },
                listEnumeration: { type: 'string', description: 'Enumeration for ordering items' },
                abbreviatedStatement: { type: 'string', description: 'Short version of the statement' },
                conceptKeywords: { type: 'array', items: { type: 'string' } },
                language: { type: 'string' },
                educationLevel: { type: 'array', items: { type: 'string' } },
                CFItemType: { type: 'string', description: 'Type of item (Standard, Benchmark, etc.)' }
              }
            },
            CFAssociation: {
              type: 'object',
              description: 'Relationship between two CFItems or between a CFItem and external resources',
              properties: {
                identifier: { type: 'string', format: 'uri', description: 'Unique identifier' },
                uri: { type: 'string', format: 'uri', description: 'Canonical URI' },
                associationType: {
                  type: 'string',
                  description: 'Type of relationship',
                  enum: ['isChildOf', 'isPartOf', 'exactMatchOf', 'isRelatedTo', 'precedes', 'replacedBy']
                },
                originNodeURI: { type: 'object', description: 'Source of the association' },
                destinationNodeURI: { type: 'object', description: 'Target of the association' },
                sequenceNumber: { type: 'integer', description: 'Order in sequence' }
              }
            },
            CFPackage: {
              type: 'object',
              description: 'Complete package containing a framework document with all items and associations',
              properties: {
                CFDocument: { $ref: '#/components/schemas/CFDocument' },
                CFItems: { type: 'array', items: { $ref: '#/components/schemas/CFItem' } },
                CFAssociations: { type: 'array', items: { $ref: '#/components/schemas/CFAssociation' } }
              }
            }
          }
        }
      }
    },
    example: `{
  "CFDocument": {
    "identifier": "ce-a8a0c5c0-6a5e-11e7-b9f6-f33a5f6d0c8e",
    "uri": "https://example.org/frameworks/math-standards",
    "creator": "State Department of Education",
    "title": "Mathematics Standards K-12",
    "description": "Comprehensive mathematics learning standards for grades K-12",
    "subject": ["Mathematics"],
    "language": "en",
    "version": "2024",
    "adoptionStatus": "Adopted"
  },
  "CFItems": [
    {
      "identifier": "ci-a8a0c5c0-6a5e-11e7-b9f6-f33a5f6d0c9f",
      "uri": "https://example.org/items/math-k-1",
      "fullStatement": "Count to 100 by ones and by tens",
      "humanCodingScheme": "K.CC.1",
      "listEnumeration": "1",
      "educationLevel": ["K"],
      "CFItemType": "Standard"
    },
    {
      "identifier": "ci-b8b1d6d1-7b6f-22f8-c0g7-g44b6g7e1d0g",
      "uri": "https://example.org/items/math-k-2",
      "fullStatement": "Count forward beginning from a given number",
      "humanCodingScheme": "K.CC.2",
      "listEnumeration": "2",
      "educationLevel": ["K"],
      "CFItemType": "Standard"
    }
  ],
  "CFAssociations": [
    {
      "identifier": "ca-c9c2e7e2-8c7g-33g9-d1h8-h55c7h8f2e1h",
      "associationType": "precedes",
      "originNodeURI": {
        "identifier": "ci-a8a0c5c0-6a5e-11e7-b9f6-f33a5f6d0c9f"
      },
      "destinationNodeURI": {
        "identifier": "ci-b8b1d6d1-7b6f-22f8-c0g7-g44b6g7e1d0g"
      },
      "sequenceNumber": 1
    }
  ]
}`,
    diagram: `graph TB
    CFDoc[CFDocument<br/>Framework Container]
    CFItem1[CFItem<br/>Learning Standard]
    CFItem2[CFItem<br/>Competency]
    CFItem3[CFItem<br/>Sub-Standard]
    CFAssoc1[CFAssociation<br/>isChildOf]
    CFAssoc2[CFAssociation<br/>precedes]
    CFAssoc3[CFAssociation<br/>isRelatedTo]
    CFPackage[CFPackage<br/>Complete Export]

    CFDoc -->|contains| CFItem1
    CFDoc -->|contains| CFItem2
    CFItem1 -->|related via| CFAssoc1
    CFAssoc1 -->|defines| CFItem3
    CFItem1 -->|related via| CFAssoc2
    CFAssoc2 -->|links to| CFItem2
    CFItem2 -->|related via| CFAssoc3
    CFPackage -->|bundles| CFDoc
    CFPackage -->|includes| CFItem1
    CFPackage -->|includes| CFAssoc1

    style CFDoc fill:#3b82f6,stroke:#1e40af,color:#fff
    style CFItem1 fill:#10b981,stroke:#059669,color:#fff
    style CFItem2 fill:#10b981,stroke:#059669,color:#fff
    style CFAssoc1 fill:#f59e0b,stroke:#d97706,color:#fff
    style CFPackage fill:#8b5cf6,stroke:#6d28d9,color:#fff`,
    terms: [
      {
        name: 'CFDocument',
        description: 'A competency framework document that serves as the container for all learning standards and competencies',
        type: 'Document',
        relationships: ['CFItem', 'CFAssociation', 'CFPackage']
      },
      {
        name: 'CFItem',
        description: 'An individual competency, learning standard, or benchmark statement within a framework',
        type: 'Item',
        relationships: ['CFDocument', 'CFAssociation']
      },
      {
        name: 'CFAssociation',
        description: 'A relationship between two CFItems defining hierarchical, sequential, or equivalence connections',
        type: 'Association',
        relationships: ['originNodeURI', 'destinationNodeURI']
      },
      {
        name: 'CFPackage',
        description: 'A complete package containing a framework document with all items and associations for exchange',
        type: 'Package',
        relationships: ['CFDocument', 'CFItems', 'CFAssociations']
      },
      {
        name: 'Association Types',
        description: 'Defines relationship types: isChildOf (hierarchy), precedes (sequence), exactMatchOf (equivalence), isRelatedTo (general connection)',
        type: 'Enumeration'
      },
      {
        name: 'Human Coding Scheme',
        description: 'A human-readable code or notation system for organizing and referencing standards (e.g., "K.CC.1")',
        type: 'Property'
      }
    ]
  },
  {
    id: 'case-1.1',
    name: 'CASE 1.1',
    fullName: 'Competencies and Academic Standards Exchange 1.1',
    version: '1.1',
    organization: '1EdTech',
    description: 'Enhanced version of CASE adding support for rubrics, rich text (Markdown/LaTeX), framework types, translations, and extensions. Enables standardized exchange of academic standards, competencies, and assessment criteria with globally unique identifiers.',
    specUrl: 'https://www.imsglobal.org/spec/case/v1p1',
    schema: {
      type: 'json-schema',
      content: {
        openapi: '3.0.0',
        info: {
          title: 'CASE 1.1 API',
          version: '1.1',
          description: 'Competencies and Academic Standards Exchange API v1.1'
        },
        components: {
          schemas: {
            CFDocument: {
              type: 'object',
              description: 'A competency framework document with enhanced metadata',
              properties: {
                identifier: { type: 'string', format: 'uri', description: 'Unique identifier' },
                uri: { type: 'string', format: 'uri', description: 'Canonical URI' },
                creator: { type: 'string', description: 'Entity that created the framework' },
                title: { type: 'string', description: 'Name of the framework' },
                description: { type: 'string', description: 'Description of the framework' },
                subject: { type: 'array', items: { type: 'string' }, description: 'Subject areas' },
                language: { type: 'string', description: 'Language code' },
                version: { type: 'string', description: 'Framework version' },
                adoptionStatus: { type: 'string', description: 'Adoption status' },
                frameworkType: { type: 'string', description: 'Type of framework (new in 1.1)' },
                caseVersion: { type: 'string', description: 'CASE specification version (new in 1.1)', default: '1.1' },
                extensions: { type: 'object', description: 'Custom metadata extensions (new in 1.1)' }
              }
            },
            CFItem: {
              type: 'object',
              description: 'An individual competency or standard with rich text support',
              properties: {
                identifier: { type: 'string', format: 'uri' },
                uri: { type: 'string', format: 'uri' },
                fullStatement: { type: 'string', description: 'Complete text (supports Markdown/LaTeX in 1.1)' },
                humanCodingScheme: { type: 'string', description: 'Human-readable code' },
                listEnumeration: { type: 'string', description: 'Ordering enumeration' },
                abbreviatedStatement: { type: 'string', description: 'Short version' },
                conceptKeywords: { type: 'array', items: { type: 'string' } },
                notes: { type: 'string', description: 'Additional notes (supports Markdown/LaTeX in 1.1)' },
                language: { type: 'string' },
                educationLevel: { type: 'array', items: { type: 'string' } },
                CFItemType: { type: 'string', description: 'Type of item' },
                subject: { type: 'string', description: 'Item-specific subject (new in 1.1)' },
                subjectURI: { type: 'string', format: 'uri', description: 'Subject URI (new in 1.1)' },
                extensions: { type: 'object', description: 'Custom extensions (new in 1.1)' }
              }
            },
            CFAssociation: {
              type: 'object',
              description: 'Enhanced relationship between items or external resources',
              properties: {
                identifier: { type: 'string', format: 'uri' },
                uri: { type: 'string', format: 'uri' },
                associationType: {
                  type: 'string',
                  description: 'Type of relationship',
                  enum: ['isChildOf', 'isPartOf', 'exactMatchOf', 'isRelatedTo', 'precedes', 'replacedBy', 'isTranslationOf']
                },
                originNodeURI: {
                  type: 'object',
                  description: 'Source with type specification (enhanced in 1.1)',
                  properties: {
                    identifier: { type: 'string', format: 'uri' },
                    targetType: { type: 'string', description: 'Type of referenced object (new in 1.1)' }
                  }
                },
                destinationNodeURI: {
                  type: 'object',
                  description: 'Target with type specification (enhanced in 1.1)',
                  properties: {
                    identifier: { type: 'string', format: 'uri' },
                    targetType: { type: 'string', description: 'Type of referenced object (new in 1.1)' }
                  }
                },
                sequenceNumber: { type: 'integer', description: 'Order in sequence' },
                notes: { type: 'string', description: 'Association notes (new in 1.1)' },
                extensions: { type: 'object', description: 'Custom extensions (new in 1.1)' }
              }
            },
            CFRubric: {
              type: 'object',
              description: 'Assessment rubric for evaluating competencies (new in 1.1)',
              properties: {
                identifier: { type: 'string', format: 'uri' },
                uri: { type: 'string', format: 'uri' },
                title: { type: 'string', description: 'Rubric title' },
                description: { type: 'string', description: 'Rubric description' },
                CFRubricCriteria: {
                  type: 'array',
                  description: 'Criteria for the rubric',
                  items: { $ref: '#/components/schemas/CFRubricCriterion' }
                }
              }
            },
            CFRubricCriterion: {
              type: 'object',
              description: 'Individual criterion within a rubric',
              properties: {
                identifier: { type: 'string', format: 'uri' },
                uri: { type: 'string', format: 'uri' },
                category: { type: 'string', description: 'Criterion category' },
                description: { type: 'string', description: 'What is being evaluated' },
                weight: { type: 'number', description: 'Relative importance' },
                CFRubricCriterionLevels: {
                  type: 'array',
                  description: 'Performance levels',
                  items: { $ref: '#/components/schemas/CFRubricCriterionLevel' }
                }
              }
            },
            CFRubricCriterionLevel: {
              type: 'object',
              description: 'Performance level for a criterion',
              properties: {
                identifier: { type: 'string', format: 'uri' },
                uri: { type: 'string', format: 'uri' },
                description: { type: 'string', description: 'Level description' },
                quality: { type: 'string', description: 'Quality label (e.g., Excellent, Good)' },
                score: { type: 'number', description: 'Numeric score' },
                feedback: { type: 'string', description: 'Feedback for this level' }
              }
            }
          }
        }
      }
    },
    example: `{
  "CFDocument": {
    "identifier": "ce-b9b1d7e2-7b6f-22f8-c1h9-i55d7i8g3f2i",
    "uri": "https://example.org/frameworks/science-standards-v2",
    "creator": "National Science Education Board",
    "title": "Next Generation Science Standards",
    "description": "Comprehensive science standards for K-12 with performance expectations",
    "subject": ["Science"],
    "language": "en",
    "version": "2024",
    "adoptionStatus": "Adopted",
    "frameworkType": "Academic Standards",
    "caseVersion": "1.1",
    "extensions": {
      "publisher": "State Education Department",
      "revisionCycle": "Annual"
    }
  },
  "CFItems": [
    {
      "identifier": "ci-c1c2e8f3-8c7h-33h9-d2i0-j66e8j9h4g3j",
      "uri": "https://example.org/items/science-5-ps1-1",
      "fullStatement": "Develop a model to describe that matter is made of particles **too small to be seen**. Use *mathematical representations* to support the explanation.",
      "humanCodingScheme": "5-PS1-1",
      "listEnumeration": "1",
      "educationLevel": ["05"],
      "CFItemType": "Performance Expectation",
      "subject": "Physical Science",
      "subjectURI": "https://example.org/subjects/physical-science",
      "notes": "This standard integrates with Math Practice 2: $E=mc^2$ demonstrates matter-energy equivalence."
    }
  ],
  "CFAssociations": [
    {
      "identifier": "ca-d2d3f9g4-9d8i-44i0-e3j1-k77f9k0i5h4k",
      "associationType": "isTranslationOf",
      "originNodeURI": {
        "identifier": "ci-spanish-version",
        "targetType": "CFItem"
      },
      "destinationNodeURI": {
        "identifier": "ci-c1c2e8f3-8c7h-33h9-d2i0-j66e8j9h4g3j",
        "targetType": "CFItem"
      },
      "notes": "Spanish translation for ELL learners"
    }
  ],
  "CFRubrics": [
    {
      "identifier": "cr-e3e4g0h5-0e9j-55j1-f4k2-l88g0l1j6i5l",
      "uri": "https://example.org/rubrics/science-inquiry",
      "title": "Science Inquiry Rubric",
      "description": "Evaluates student ability to conduct scientific investigations",
      "CFRubricCriteria": [
        {
          "identifier": "crc-f4f5h1i6-1f0k-66k2-g5l3-m99h1m2k7j6m",
          "category": "Hypothesis Formation",
          "description": "Student develops testable hypotheses",
          "weight": 0.3,
          "CFRubricCriterionLevels": [
            {
              "quality": "Exemplary",
              "score": 4,
              "description": "Hypothesis is clearly stated, testable, and based on prior knowledge"
            },
            {
              "quality": "Proficient",
              "score": 3,
              "description": "Hypothesis is testable with minor clarity issues"
            },
            {
              "quality": "Developing",
              "score": 2,
              "description": "Hypothesis present but not fully testable"
            }
          ]
        }
      ]
    }
  ]
}`,
    diagram: `graph TB
    CFDoc[CFDocument<br/>Framework v1.1]
    CFItem1[CFItem<br/>with Markdown/LaTeX]
    CFItem2[CFItem<br/>Translated Version]
    CFAssoc1[CFAssociation<br/>isTranslationOf]
    CFAssoc2[CFAssociation<br/>crosswalk to external]
    CFRubric[CFRubric<br/>Assessment Tool]
    CFCriterion[CFRubricCriterion<br/>Evaluation Criteria]
    CFLevel[CFRubricCriterionLevel<br/>Performance Level]
    Extensions[Extensions<br/>Custom Metadata]

    CFDoc -->|contains| CFItem1
    CFDoc -->|contains| CFItem2
    CFDoc -->|has custom| Extensions
    CFItem1 -->|linked by| CFAssoc1
    CFAssoc1 -->|connects to| CFItem2
    CFItem1 -->|external link| CFAssoc2
    CFDoc -->|assessed by| CFRubric
    CFRubric -->|defines| CFCriterion
    CFCriterion -->|has levels| CFLevel
    CFItem1 -->|evaluated by| CFRubric

    style CFDoc fill:#3b82f6,stroke:#1e40af,color:#fff
    style CFItem1 fill:#10b981,stroke:#059669,color:#fff
    style CFRubric fill:#ef4444,stroke:#b91c1c,color:#fff
    style CFAssoc1 fill:#f59e0b,stroke:#d97706,color:#fff
    style Extensions fill:#8b5cf6,stroke:#6d28d9,color:#fff`,
    terms: [
      {
        name: 'CFDocument',
        description: 'Framework container with enhanced metadata including frameworkType and caseVersion',
        type: 'Document',
        relationships: ['CFItem', 'CFAssociation', 'CFRubric', 'extensions']
      },
      {
        name: 'CFItem',
        description: 'Individual competency or standard with rich text support (Markdown, LaTeX) and item-specific subjects',
        type: 'Item',
        relationships: ['CFDocument', 'CFAssociation', 'subject', 'extensions']
      },
      {
        name: 'CFAssociation',
        description: 'Enhanced relationship with notes, targetType specification, and support for translations',
        type: 'Association',
        relationships: ['originNodeURI', 'destinationNodeURI', 'notes', 'extensions']
      },
      {
        name: 'CFRubric',
        description: 'Assessment rubric for evaluating student performance against competencies (new in 1.1)',
        type: 'Rubric',
        relationships: ['CFDocument', 'CFRubricCriteria']
      },
      {
        name: 'CFRubricCriterion',
        description: 'Individual evaluation criterion within a rubric with weighting support',
        type: 'Criterion',
        relationships: ['CFRubric', 'CFRubricCriterionLevels']
      },
      {
        name: 'CFRubricCriterionLevel',
        description: 'Performance level defining quality expectations and scoring',
        type: 'Level',
        relationships: ['CFRubricCriterion', 'score', 'feedback']
      },
      {
        name: 'Rich Text Support',
        description: 'Markdown and LaTeX formatting in fullStatement and notes fields for mathematical expressions and formatted text',
        type: 'Feature'
      },
      {
        name: 'isTranslationOf',
        description: 'New association type linking translated versions of competencies and standards',
        type: 'AssociationType'
      },
      {
        name: 'Extensions',
        description: 'Custom metadata field allowing organizations to add domain-specific properties beyond the standard model',
        type: 'Feature',
        relationships: ['CFDocument', 'CFItem', 'CFAssociation']
      },
      {
        name: 'Framework Type',
        description: 'Categorization of framework purpose (e.g., Academic Standards, Course Codes, Competency Framework)',
        type: 'Property'
      }
    ]
  },
  {
    id: 'openbadges-3.0',
    name: 'Open Badges 3.0',
    fullName: 'Open Badges Specification 3.0',
    version: '3.0',
    organization: '1EdTech',
    description: 'Enables issuance and verification of digital credentials aligned with the W3C Verifiable Credentials Data Model, supporting educational and occupational achievement claims with cryptographic verification.',
    specUrl: 'https://www.imsglobal.org/spec/ob/v3p0/',
    schema: {
      type: 'json-schema',
      content: {
        openapi: '3.0.0',
        info: {
          title: 'Open Badges 3.0 API',
          version: '3.0',
          description: 'Open Badges specification for digital credentials'
        },
        components: {
          schemas: {
            OpenBadgeCredential: {
              type: 'object',
              description: 'A verifiable digital badge credential',
              required: ['@context', 'id', 'type', 'issuer', 'validFrom', 'credentialSubject'],
              properties: {
                '@context': { type: 'array', items: { type: 'string' }, description: 'JSON-LD context' },
                id: { type: 'string', format: 'uri', description: 'Unique identifier' },
                type: { type: 'array', items: { type: 'string' }, description: 'Credential types' },
                issuer: { type: 'object', description: 'Organization that issued the badge' },
                validFrom: { type: 'string', format: 'date-time', description: 'Issuance date' },
                validUntil: { type: 'string', format: 'date-time', description: 'Expiration date' },
                credentialSubject: {
                  type: 'object',
                  description: 'The recipient and their achievement',
                  properties: {
                    id: { type: 'string', format: 'uri', description: 'Identifier of the recipient' },
                    type: { type: 'string', default: 'AchievementSubject' },
                    achievement: { $ref: '#/components/schemas/Achievement' }
                  }
                },
                credentialSchema: { type: 'object', description: 'Schema for validation' },
                proof: { type: 'object', description: 'Cryptographic proof' }
              }
            },
            Achievement: {
              type: 'object',
              description: 'Describes the accomplishment being recognized',
              properties: {
                id: { type: 'string', format: 'uri' },
                type: { type: 'string', default: 'Achievement' },
                name: { type: 'string', description: 'Title of the achievement' },
                description: { type: 'string', description: 'Description of the achievement' },
                criteria: {
                  type: 'object',
                  description: 'How the achievement can be earned',
                  properties: {
                    narrative: { type: 'string' }
                  }
                },
                image: { type: 'object', description: 'Visual representation of the badge' },
                achievementType: { type: 'string', description: 'Type of achievement' },
                alignment: { type: 'array', items: { type: 'object' }, description: 'Skills and competencies' },
                tag: { type: 'array', items: { type: 'string' }, description: 'Keywords' }
              }
            },
            BadgeClass: {
              type: 'object',
              description: 'Legacy term for Achievement definition',
              properties: {
                id: { type: 'string', format: 'uri' },
                name: { type: 'string' },
                description: { type: 'string' },
                image: { type: 'string', format: 'uri' },
                criteria: { type: 'string', format: 'uri' },
                issuer: { type: 'string', format: 'uri' }
              }
            },
            Issuer: {
              type: 'object',
              description: 'Profile of the organization or person issuing badges',
              properties: {
                id: { type: 'string', format: 'uri' },
                type: { type: 'string', default: 'Profile' },
                name: { type: 'string' },
                url: { type: 'string', format: 'uri' },
                email: { type: 'string', format: 'email' },
                image: { type: 'object', description: 'Issuer logo' }
              }
            }
          }
        }
      }
    },
    example: `{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.2.json"
  ],
  "id": "https://example.org/badges/12345",
  "type": ["VerifiableCredential", "OpenBadgeCredential"],
  "issuer": {
    "id": "https://example.org",
    "type": "Profile",
    "name": "Example Badge Issuer",
    "url": "https://example.org",
    "email": "badges@example.org"
  },
  "validFrom": "2024-06-15T00:00:00Z",
  "credentialSubject": {
    "id": "did:example:learner123",
    "type": "AchievementSubject",
    "achievement": {
      "id": "https://example.org/achievements/digital-literacy",
      "type": "Achievement",
      "name": "Digital Literacy Badge",
      "description": "Demonstrates proficiency in essential digital skills",
      "criteria": {
        "narrative": "Complete 5 modules on digital literacy including online safety, information literacy, and digital communication"
      },
      "image": {
        "id": "https://example.org/images/digital-literacy-badge.png",
        "type": "Image"
      },
      "achievementType": "Certificate",
      "alignment": [
        {
          "type": "Alignment",
          "targetName": "Digital Literacy",
          "targetUrl": "https://skills.example.org/digital-literacy",
          "targetFramework": "Digital Skills Framework"
        }
      ],
      "tag": ["digital skills", "literacy", "technology"]
    }
  },
  "proof": {
    "type": "DataIntegrityProof",
    "created": "2024-06-15T10:30:00Z",
    "verificationMethod": "https://example.org/keys/1",
    "cryptosuite": "eddsa-2022",
    "proofPurpose": "assertionMethod",
    "proofValue": "z3FXQjecWRV...5cYq9h8"
  }
}`,
    diagram: `graph TB
    Badge[Open Badge Credential]
    Issuer[Issuer Profile]
    Subject[Achievement Subject]
    Achievement[Achievement Definition]
    Criteria[Criteria]
    Image[Badge Image]
    Alignment[Skill Alignment]
    Proof[Cryptographic Proof]

    Badge -->|issued by| Issuer
    Badge -->|awarded to| Subject
    Badge -->|verified by| Proof
    Subject -->|earned| Achievement
    Achievement -->|requires| Criteria
    Achievement -->|represented by| Image
    Achievement -->|aligned to| Alignment

    style Badge fill:#3b82f6,stroke:#1e40af,color:#fff
    style Achievement fill:#10b981,stroke:#059669,color:#fff
    style Issuer fill:#f59e0b,stroke:#d97706,color:#fff
    style Proof fill:#ef4444,stroke:#b91c1c,color:#fff`,
    terms: [
      {
        name: 'OpenBadgeCredential',
        description: 'A verifiable digital badge that represents an achievement, conforming to W3C Verifiable Credentials standard',
        type: 'VerifiableCredential',
        relationships: ['issuer', 'credentialSubject', 'achievement', 'proof']
      },
      {
        name: 'Achievement',
        description: 'The accomplishment, skill, or quality being recognized by the badge',
        type: 'Achievement',
        relationships: ['criteria', 'alignment', 'image']
      },
      {
        name: 'AchievementSubject',
        description: 'The recipient of the badge, typically identified by a DID or email',
        type: 'Subject',
        relationships: ['achievement']
      },
      {
        name: 'Issuer',
        description: 'The organization or individual who created and issued the badge',
        type: 'Profile',
        relationships: ['OpenBadgeCredential']
      },
      {
        name: 'Criteria',
        description: 'Description of what is required to earn the badge',
        type: 'Criteria',
        relationships: ['achievement']
      },
      {
        name: 'Alignment',
        description: 'Connection to external skills frameworks, competencies, or educational standards',
        type: 'Alignment',
        relationships: ['achievement']
      },
      {
        name: 'Proof',
        description: 'Cryptographic signature ensuring the badge is tamper-evident and verifiable',
        type: 'DataIntegrityProof'
      },
      {
        name: 'Badge Image',
        description: 'Visual representation of the badge for display purposes',
        type: 'Image',
        relationships: ['achievement']
      }
    ]
  },
  {
    id: 'ctdl-2025',
    name: 'CTDL',
    fullName: 'Credential Transparency Description Language',
    version: '2025.11',
    organization: 'Credential Engine',
    description: 'A vocabulary and schema for describing credentials and related resources in machine-readable format, enabling search, discovery, and cross-system interoperability for credentials, learning opportunities, assessments, and competencies.',
    specUrl: 'https://credreg.net/ctdl/handbook',
    schema: {
      type: 'json-schema',
      content: {
        openapi: '3.0.0',
        info: {
          title: 'CTDL Schema',
          version: '2025.11',
          description: 'Credential Transparency Description Language'
        },
        components: {
          schemas: {
            Credential: {
              type: 'object',
              description: 'A qualification, achievement, or aspect of identity used to indicate suitability',
              properties: {
                '@type': { type: 'string', description: 'Type of credential (Degree, Certificate, Badge, etc.)' },
                name: { type: 'string', description: 'Name of the credential' },
                description: { type: 'string', description: 'Description of the credential' },
                credentialId: { type: 'string', description: 'Unique identifier' },
                ownedBy: { type: 'array', items: { type: 'string' }, description: 'Organizations that own this credential' },
                offeredBy: { type: 'array', items: { type: 'string' }, description: 'Organizations that offer this credential' },
                requires: { type: 'array', description: 'Prerequisites for earning the credential' },
                isPartOf: { type: 'array', description: 'Larger credentials this is part of' },
                hasPart: { type: 'array', description: 'Component credentials' }
              }
            },
            Organization: {
              type: 'object',
              description: 'An entity that creates, offers, or recognizes credentials',
              properties: {
                '@type': { type: 'string', enum: ['CredentialOrganization', 'QACredentialOrganization'] },
                name: { type: 'string', description: 'Name of the organization' },
                description: { type: 'string', description: 'About the organization' },
                subjectWebpage: { type: 'string', format: 'uri', description: 'Primary webpage' },
                email: { type: 'string', format: 'email' },
                offers: { type: 'array', description: 'Credentials offered by this organization' },
                accredits: { type: 'array', description: 'Credentials this organization accredits' }
              }
            },
            LearningOpportunity: {
              type: 'object',
              description: 'An educational or training opportunity including courses, programs, and apprenticeships',
              properties: {
                '@type': { type: 'string', enum: ['LearningOpportunityProfile', 'LearningProgram', 'Course'] },
                name: { type: 'string' },
                description: { type: 'string' },
                teaches: { type: 'array', description: 'Competencies taught' },
                assesses: { type: 'array', description: 'Competencies assessed' },
                estimatedDuration: { type: 'array', description: 'Time required to complete' },
                deliveryType: { type: 'array', description: 'How it is delivered (online, in-person, hybrid)' }
              }
            },
            AssessmentProfile: {
              type: 'object',
              description: 'Key characteristics of an assessment for a credential',
              properties: {
                '@type': { type: 'string', default: 'AssessmentProfile' },
                name: { type: 'string' },
                description: { type: 'string' },
                assessmentMethodType: { type: 'array', description: 'Type of assessment (performance, written, etc.)' },
                assessmentUseType: { type: 'array', description: 'How used (summative, formative, etc.)' },
                assesses: { type: 'array', description: 'Competencies being assessed' },
                scoringMethodType: { type: 'array', description: 'How scored' }
              }
            },
            Competency: {
              type: 'object',
              description: 'Knowledge, skills, and abilities required or developed',
              properties: {
                '@type': { type: 'string', default: 'Competency' },
                competencyLabel: { type: 'string', description: 'Name of the competency' },
                competencyText: { type: 'string', description: 'Full description' },
                competencyCategory: { type: 'string', description: 'Category or domain' },
                isPartOf: { type: 'array', description: 'Parent competency framework' }
              }
            }
          }
        }
      }
    },
    example: `{
  "@context": "https://credreg.net/ctdl/schema/context/json",
  "@type": "BachelorDegree",
  "ctid": "ce-a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p",
  "name": "Bachelor of Science in Computer Science",
  "description": "A four-year undergraduate degree in computer science covering programming, algorithms, data structures, and software engineering.",
  "ownedBy": ["https://credentialengine.org/resources/ce-org-12345"],
  "offeredBy": ["https://credentialengine.org/resources/ce-org-12345"],
  "credentialStatusType": [
    {
      "@type": "CredentialStatus",
      "name": "Active"
    }
  ],
  "requires": [
    {
      "@type": "ConditionProfile",
      "description": "High school diploma or equivalent",
      "targetCredential": []
    }
  ],
  "estimatedDuration": [
    {
      "@type": "DurationProfile",
      "exactDuration": "P4Y",
      "description": "4 years full-time"
    }
  ],
  "occupationType": [
    {
      "@type": "CredentialAlignmentObject",
      "targetNodeName": "Software Developers",
      "codedNotation": "15-1252.00"
    }
  ],
  "hasPart": [
    {
      "@type": "Course",
      "name": "Data Structures and Algorithms"
    }
  ]
}`,
    diagram: `graph TB
    Cred[Credential]
    Org[Credential Organization]
    QAOrg[QA Organization]
    Learn[Learning Opportunity]
    Assess[Assessment]
    Comp[Competency Framework]
    Occ[Occupation]
    Pathway[Pathway]

    Org -->|offers| Cred
    Org -->|offers| Learn
    QAOrg -->|accredits| Org
    QAOrg -->|recognizes| Cred
    Cred -->|requires| Learn
    Cred -->|requires| Assess
    Learn -->|teaches| Comp
    Assess -->|assesses| Comp
    Cred -->|prepares for| Occ
    Cred -->|part of| Pathway

    style Cred fill:#3b82f6,stroke:#1e40af,color:#fff
    style Org fill:#10b981,stroke:#059669,color:#fff
    style Comp fill:#f59e0b,stroke:#d97706,color:#fff
    style QAOrg fill:#8b5cf6,stroke:#6d28d9,color:#fff`,
    terms: [
      {
        name: 'Credential',
        description: 'A qualification, achievement, personal or organizational quality used to indicate suitability (includes degrees, certificates, certifications, badges)',
        type: 'Class',
        relationships: ['ownedBy', 'offeredBy', 'requires', 'hasPart', 'isPartOf']
      },
      {
        name: 'CredentialOrganization',
        description: 'An organization that develops, offers, or awards credentials',
        type: 'Class',
        relationships: ['offers', 'owns', 'accredits']
      },
      {
        name: 'QACredentialOrganization',
        description: 'A quality assurance body responsible for accreditation and recognition',
        type: 'Class',
        relationships: ['accredits', 'recognizes', 'regulates']
      },
      {
        name: 'LearningOpportunity',
        description: 'An educational or training opportunity including courses, programs, and apprenticeships',
        type: 'Class',
        relationships: ['teaches', 'assesses', 'isPartOf', 'hasPart']
      },
      {
        name: 'AssessmentProfile',
        description: 'Key characteristics of an assessment including methods, use type, and competencies assessed',
        type: 'Class',
        relationships: ['assesses', 'requires']
      },
      {
        name: 'Competency',
        description: 'Knowledge, skills, and abilities that can be learned, taught, and assessed',
        type: 'Class',
        relationships: ['isPartOf', 'competencyCategory']
      },
      {
        name: 'ConditionProfile',
        description: 'Requirements, recommendations, or other conditions for earning a credential',
        type: 'Class',
        relationships: ['targetCredential', 'targetAssessment', 'targetCompetency']
      },
      {
        name: 'Pathway',
        description: 'A sequence of credentials and learning opportunities leading to a goal',
        type: 'Class',
        relationships: ['hasDestinationComponent', 'hasChild']
      }
    ]
  },
  {
    id: 'ler-rs-2.0',
    name: 'LER-RS 2.0',
    fullName: 'Learning and Employment Record Resume Standard 2.0',
    version: '2.0',
    organization: 'HR Open',
    description: 'An open standard combining digital credentials (Open Badges 3.0, CLR 2.0) with HR resume/CV standards to create machine-readable, verifiable records of skills, education, work experience, and competencies for recruiting and talent management.',
    specUrl: 'https://www.hropenstandards.org/ler-rs',
    schema: {
      type: 'json-schema',
      content: {
        openapi: '3.0.0',
        info: {
          title: 'LER-RS 2.0 API',
          version: '2.0',
          description: 'Learning and Employment Record Resume Standard'
        },
        components: {
          schemas: {
            LERProfile: {
              type: 'object',
              description: 'A comprehensive learning and employment record for an individual',
              properties: {
                personLegalId: { type: 'string', description: 'Unique identifier for the person' },
                personName: { type: 'object', description: 'Name of the person' },
                personContact: { type: 'array', description: 'Contact information' },
                educationHistory: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/EducationHistory' },
                  description: 'Educational background'
                },
                employmentHistory: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/EmploymentHistory' },
                  description: 'Work experience'
                },
                verifiableCredentials: {
                  type: 'array',
                  description: 'Digital credentials (badges, certificates)',
                  items: { type: 'object' }
                },
                skills: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Skill' },
                  description: 'Skills and competencies'
                },
                licenses: { type: 'array', description: 'Professional licenses and certifications' }
              }
            },
            EducationHistory: {
              type: 'object',
              description: 'Educational background entry',
              properties: {
                schoolName: { type: 'string', description: 'Name of educational institution' },
                degree: { type: 'object', description: 'Degree or credential earned' },
                major: { type: 'array', items: { type: 'string' }, description: 'Field(s) of study' },
                gpa: { type: 'number', description: 'Grade point average' },
                startDate: { type: 'string', format: 'date' },
                endDate: { type: 'string', format: 'date' },
                currentlyAttending: { type: 'boolean' }
              }
            },
            EmploymentHistory: {
              type: 'object',
              description: 'Work experience entry',
              properties: {
                employerName: { type: 'string', description: 'Name of employer' },
                positionTitle: { type: 'string', description: 'Job title' },
                positionDescription: { type: 'string', description: 'Job responsibilities' },
                startDate: { type: 'string', format: 'date' },
                endDate: { type: 'string', format: 'date' },
                currentEmployer: { type: 'boolean' },
                skills: { type: 'array', items: { type: 'string' }, description: 'Skills used in this role' }
              }
            },
            Skill: {
              type: 'object',
              description: 'A skill or competency',
              properties: {
                name: { type: 'string', description: 'Name of the skill' },
                description: { type: 'string' },
                proficiencyLevel: {
                  type: 'string',
                  enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
                  description: 'Level of proficiency'
                },
                skillAlignment: { type: 'array', description: 'Alignment to skill frameworks' },
                evidenceLinks: { type: 'array', description: 'Links to credentials or evidence' }
              }
            },
            License: {
              type: 'object',
              description: 'Professional license or certification',
              properties: {
                name: { type: 'string', description: 'Name of license/certification' },
                issuingAuthority: { type: 'string', description: 'Issuing organization' },
                licenseNumber: { type: 'string' },
                issueDate: { type: 'string', format: 'date' },
                expirationDate: { type: 'string', format: 'date' },
                verificationUrl: { type: 'string', format: 'uri' }
              }
            }
          }
        }
      }
    },
    example: `{
  "personLegalId": "did:example:person123",
  "personName": {
    "formattedName": "Jane Smith",
    "givenName": "Jane",
    "familyName": "Smith"
  },
  "personContact": [
    {
      "email": "jane.smith@example.com",
      "phone": "+1-555-0123"
    }
  ],
  "educationHistory": [
    {
      "schoolName": "State University",
      "degree": {
        "name": "Bachelor of Science",
        "type": "Bachelor"
      },
      "major": ["Computer Science"],
      "gpa": 3.8,
      "startDate": "2018-09-01",
      "endDate": "2022-05-15",
      "currentlyAttending": false
    }
  ],
  "employmentHistory": [
    {
      "employerName": "Tech Solutions Inc.",
      "positionTitle": "Software Engineer",
      "positionDescription": "Developed web applications using React and Node.js",
      "startDate": "2022-06-01",
      "currentEmployer": true,
      "skills": ["JavaScript", "React", "Node.js", "API Development"]
    }
  ],
  "verifiableCredentials": [
    {
      "@context": "https://www.w3.org/2018/credentials/v1",
      "type": ["VerifiableCredential", "OpenBadgeCredential"],
      "issuer": "https://example.edu",
      "credentialSubject": {
        "achievement": {
          "name": "Full Stack Web Development Certificate"
        }
      }
    }
  ],
  "skills": [
    {
      "name": "JavaScript",
      "description": "Programming language for web development",
      "proficiencyLevel": "Advanced",
      "evidenceLinks": ["credential-12345"]
    },
    {
      "name": "React",
      "description": "Frontend JavaScript library",
      "proficiencyLevel": "Advanced",
      "evidenceLinks": ["credential-12345", "project-portfolio"]
    }
  ],
  "licenses": [
    {
      "name": "AWS Certified Solutions Architect",
      "issuingAuthority": "Amazon Web Services",
      "licenseNumber": "AWS-SA-2024-12345",
      "issueDate": "2024-03-15",
      "expirationDate": "2027-03-15",
      "verificationUrl": "https://aws.amazon.com/verification/12345"
    }
  ]
}`,
    diagram: `graph TB
    LER[LER Profile]
    Person[Person Identity]
    Education[Education History]
    Employment[Employment History]
    Skills[Skills & Competencies]
    Credentials[Verifiable Credentials]
    Licenses[Licenses & Certifications]
    Evidence[Evidence & Artifacts]

    LER -->|identifies| Person
    LER -->|contains| Education
    LER -->|contains| Employment
    LER -->|contains| Skills
    LER -->|contains| Credentials
    LER -->|contains| Licenses
    Skills -->|supported by| Credentials
    Skills -->|demonstrated in| Employment
    Skills -->|learned in| Education
    Skills -->|proven by| Evidence
    Credentials -->|verifies| Skills
    Licenses -->|validates| Skills

    style LER fill:#3b82f6,stroke:#1e40af,color:#fff
    style Skills fill:#10b981,stroke:#059669,color:#fff
    style Credentials fill:#f59e0b,stroke:#d97706,color:#fff
    style Employment fill:#8b5cf6,stroke:#6d28d9,color:#fff`,
    terms: [
      {
        name: 'LER Profile',
        description: 'Comprehensive record combining education, employment, skills, and verifiable credentials for an individual',
        type: 'Profile',
        relationships: ['educationHistory', 'employmentHistory', 'skills', 'verifiableCredentials', 'licenses']
      },
      {
        name: 'Education History',
        description: 'Record of educational background including degrees, majors, institutions, and dates',
        type: 'EducationHistory',
        relationships: ['degree', 'skills']
      },
      {
        name: 'Employment History',
        description: 'Work experience including employers, positions, responsibilities, and skills applied',
        type: 'EmploymentHistory',
        relationships: ['skills', 'positionTitle']
      },
      {
        name: 'Skill',
        description: 'A demonstrable competency with proficiency level and evidence of attainment',
        type: 'Skill',
        relationships: ['evidenceLinks', 'skillAlignment', 'proficiencyLevel']
      },
      {
        name: 'Verifiable Credentials',
        description: 'Digital credentials (Open Badges, CLR) embedded within the LER for verification',
        type: 'VerifiableCredential',
        relationships: ['skills', 'achievement']
      },
      {
        name: 'License',
        description: 'Professional license or certification with issuing authority and verification details',
        type: 'License',
        relationships: ['issuingAuthority', 'verificationUrl']
      },
      {
        name: 'Proficiency Level',
        description: 'Standardized skill proficiency rating (Beginner, Intermediate, Advanced, Expert)',
        type: 'Enumeration'
      },
      {
        name: 'Machine-Readable Resume',
        description: 'Structured data format enabling automated parsing, skills matching, and verification in HR systems',
        type: 'Concept'
      }
    ]
  },
  {
    id: 'skills-api-1.0',
    name: 'Skills API 1.0',
    fullName: 'HR Open Skills API Standard',
    version: '1.0',
    organization: 'HR Open',
    description: 'An API-based system-to-system data standard for exchanging skill proficiency data between learning and assessment platforms, talent systems, and workforce management modules. Supports skill gain tracking, proficiency levels, assessment scores, and learning recommendations using dereferenceable skill identifiers.',
    specUrl: 'https://www.hropenstandards.org/news/skills-data-workgroup',
    schema: {
      type: 'openapi',
      content: {
        openapi: '3.0.0',
        info: {
          title: 'HR Open Skills API',
          version: '1.0',
          description: 'API for exchanging skills and competency proficiency data'
        },
        components: {
          schemas: {
            SkillProficiency: {
              type: 'object',
              description: 'Represents a skill proficiency record with assessment data',
              required: ['skillId', 'proficiencyLevel', 'assessmentDate'],
              properties: {
                skillId: {
                  type: 'string',
                  format: 'uri',
                  description: 'Unique, dereferenceable identifier for the skill'
                },
                skillName: {
                  type: 'string',
                  description: 'Human-readable name of the skill'
                },
                skillTaxonomy: {
                  type: 'string',
                  format: 'uri',
                  description: 'Reference to the skill taxonomy or competency framework'
                },
                proficiencyLevel: {
                  type: 'string',
                  description: 'Proficiency level achieved',
                  enum: ['Novice', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master']
                },
                proficiencyScore: {
                  type: 'number',
                  description: 'Numeric score representing proficiency (0-100)',
                  minimum: 0,
                  maximum: 100
                },
                assessmentDate: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Date when the skill was assessed'
                },
                expirationDate: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Date when the proficiency record expires'
                },
                evidenceLinks: {
                  type: 'array',
                  items: { type: 'string', format: 'uri' },
                  description: 'Links to credentials, certificates, or proof of skill'
                }
              }
            },
            SkillGain: {
              type: 'object',
              description: 'Represents skill acquisition or improvement over time',
              properties: {
                skillId: { type: 'string', format: 'uri' },
                skillName: { type: 'string' },
                previousLevel: { type: 'string', description: 'Prior proficiency level' },
                currentLevel: { type: 'string', description: 'New proficiency level' },
                gainDate: { type: 'string', format: 'date-time' },
                learningActivityId: {
                  type: 'string',
                  format: 'uri',
                  description: 'Reference to the learning activity that led to skill gain'
                }
              }
            },
            SkillAssessment: {
              type: 'object',
              description: 'Assessment results for a specific skill',
              properties: {
                assessmentId: { type: 'string', format: 'uri' },
                assessmentName: { type: 'string', description: 'Name of the assessment' },
                assessmentType: {
                  type: 'string',
                  enum: ['Performance', 'Written', 'Practical', 'Observation', 'Self-Assessment', 'Peer-Assessment']
                },
                skillId: { type: 'string', format: 'uri' },
                skillName: { type: 'string' },
                score: { type: 'number', description: 'Assessment score' },
                maxScore: { type: 'number', description: 'Maximum possible score' },
                passingScore: { type: 'number', description: 'Minimum score required to pass' },
                passed: { type: 'boolean', description: 'Whether the assessment was passed' },
                assessmentDate: { type: 'string', format: 'date-time' },
                assessor: {
                  type: 'object',
                  description: 'Entity that conducted the assessment',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    organizationId: { type: 'string', format: 'uri' }
                  }
                }
              }
            },
            LearningRecommendation: {
              type: 'object',
              description: 'Recommended learning activities to develop or improve a skill',
              properties: {
                skillId: { type: 'string', format: 'uri' },
                skillName: { type: 'string' },
                currentProficiency: { type: 'string' },
                targetProficiency: { type: 'string' },
                recommendedActivities: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      activityId: { type: 'string', format: 'uri' },
                      activityName: { type: 'string' },
                      activityType: { type: 'string', description: 'Course, Workshop, Certification, etc.' },
                      provider: { type: 'string' },
                      estimatedDuration: { type: 'string', description: 'Duration in ISO 8601 format' },
                      difficultyLevel: { type: 'string' },
                      url: { type: 'string', format: 'uri' }
                    }
                  }
                }
              }
            },
            SkillTaxonomy: {
              type: 'object',
              description: 'A structured framework of skills and competencies',
              properties: {
                taxonomyId: { type: 'string', format: 'uri' },
                taxonomyName: { type: 'string', description: 'Name of the skill taxonomy' },
                version: { type: 'string', description: 'Version of the taxonomy' },
                publisher: { type: 'string', description: 'Organization that publishes the taxonomy' },
                skills: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      skillId: { type: 'string', format: 'uri' },
                      skillName: { type: 'string' },
                      skillCategory: { type: 'string' },
                      parentSkill: { type: 'string', format: 'uri' },
                      relatedSkills: { type: 'array', items: { type: 'string', format: 'uri' } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    example: `{
  "personId": "did:example:person456",
  "recordDate": "2024-12-01T00:00:00Z",
  "skillProficiencies": [
    {
      "skillId": "https://skills.example.org/skills/python-programming",
      "skillName": "Python Programming",
      "skillTaxonomy": "https://skills.example.org/taxonomy/software-development",
      "proficiencyLevel": "Advanced",
      "proficiencyScore": 85,
      "assessmentDate": "2024-11-15T10:00:00Z",
      "expirationDate": "2027-11-15T10:00:00Z",
      "evidenceLinks": [
        "https://example.org/certificates/python-advanced-cert-2024",
        "https://github.com/user/python-projects"
      ]
    },
    {
      "skillId": "https://skills.example.org/skills/machine-learning",
      "skillName": "Machine Learning",
      "skillTaxonomy": "https://skills.example.org/taxonomy/ai-ml",
      "proficiencyLevel": "Intermediate",
      "proficiencyScore": 72,
      "assessmentDate": "2024-11-20T14:30:00Z",
      "evidenceLinks": [
        "https://coursera.org/certificate/ml-specialization"
      ]
    }
  ],
  "skillGains": [
    {
      "skillId": "https://skills.example.org/skills/machine-learning",
      "skillName": "Machine Learning",
      "previousLevel": "Beginner",
      "currentLevel": "Intermediate",
      "gainDate": "2024-11-20T14:30:00Z",
      "learningActivityId": "https://coursera.org/courses/ml-specialization"
    }
  ],
  "assessments": [
    {
      "assessmentId": "https://example.org/assessments/python-2024-11",
      "assessmentName": "Python Advanced Certification Exam",
      "assessmentType": "Written",
      "skillId": "https://skills.example.org/skills/python-programming",
      "skillName": "Python Programming",
      "score": 85,
      "maxScore": 100,
      "passingScore": 70,
      "passed": true,
      "assessmentDate": "2024-11-15T10:00:00Z",
      "assessor": {
        "id": "assessor-123",
        "name": "Python Institute",
        "organizationId": "https://pythoninstitute.org"
      }
    }
  ],
  "learningRecommendations": [
    {
      "skillId": "https://skills.example.org/skills/machine-learning",
      "skillName": "Machine Learning",
      "currentProficiency": "Intermediate",
      "targetProficiency": "Advanced",
      "recommendedActivities": [
        {
          "activityId": "https://coursera.org/courses/deep-learning-specialization",
          "activityName": "Deep Learning Specialization",
          "activityType": "Course Series",
          "provider": "Coursera - deeplearning.ai",
          "estimatedDuration": "P3M",
          "difficultyLevel": "Advanced",
          "url": "https://www.coursera.org/specializations/deep-learning"
        }
      ]
    }
  ]
}`,
    diagram: `graph TB
    Person[Person/Learner]
    SkillProf[Skill Proficiency Record]
    SkillGain[Skill Gain Event]
    Assessment[Skill Assessment]
    LearningRec[Learning Recommendation]
    SkillTax[Skill Taxonomy]
    Activity[Learning Activity]
    Evidence[Evidence/Credentials]

    Person -->|has| SkillProf
    Person -->|achieved| SkillGain
    Person -->|completed| Assessment
    Person -->|receives| LearningRec
    SkillProf -->|references| SkillTax
    SkillProf -->|supported by| Evidence
    SkillGain -->|resulted from| Activity
    Assessment -->|validates| SkillProf
    Assessment -->|performed by| Assessor[Assessor/Organization]
    LearningRec -->|suggests| Activity
    LearningRec -->|targets| SkillProf
    SkillTax -->|defines| Skills[Skills/Competencies]

    style Person fill:#3b82f6,stroke:#1e40af,color:#fff
    style SkillProf fill:#10b981,stroke:#059669,color:#fff
    style Assessment fill:#f59e0b,stroke:#d97706,color:#fff
    style SkillTax fill:#8b5cf6,stroke:#6d28d9,color:#fff
    style LearningRec fill:#ec4899,stroke:#be185d,color:#fff`,
    terms: [
      {
        name: 'Skill Proficiency',
        description: 'A record of an individual\'s competency level in a specific skill, including proficiency level, score, and supporting evidence',
        type: 'SkillProficiency',
        relationships: ['skillId', 'proficiencyLevel', 'evidenceLinks', 'skillTaxonomy']
      },
      {
        name: 'Skill Gain',
        description: 'Documentation of skill acquisition or improvement over time, tracking progression from one proficiency level to another',
        type: 'SkillGain',
        relationships: ['skillId', 'previousLevel', 'currentLevel', 'learningActivityId']
      },
      {
        name: 'Skill Assessment',
        description: 'Formal evaluation of skill competency with scores, passing criteria, and assessor information',
        type: 'SkillAssessment',
        relationships: ['skillId', 'assessor', 'score', 'assessmentType']
      },
      {
        name: 'Learning Recommendation',
        description: 'Personalized suggestions for learning activities to develop or improve specific skills',
        type: 'LearningRecommendation',
        relationships: ['skillId', 'currentProficiency', 'targetProficiency', 'recommendedActivities']
      },
      {
        name: 'Skill Taxonomy',
        description: 'A structured framework defining skills, their categories, hierarchies, and relationships',
        type: 'SkillTaxonomy',
        relationships: ['skills', 'publisher', 'version']
      },
      {
        name: 'Dereferenceable Skill Identifiers',
        description: 'Unique URIs that identify skills and can be resolved to retrieve skill definitions and metadata',
        type: 'Identifier'
      },
      {
        name: 'Proficiency Levels',
        description: 'Standardized scale for measuring skill competency: Novice, Beginner, Intermediate, Advanced, Expert, Master',
        type: 'Enumeration'
      },
      {
        name: 'Assessment Types',
        description: 'Methods for evaluating skills: Performance, Written, Practical, Observation, Self-Assessment, Peer-Assessment',
        type: 'Enumeration'
      },
      {
        name: 'System-to-System Exchange',
        description: 'API-based data transmission enabling automated sharing of skills data between learning platforms, assessment tools, and HR systems',
        type: 'Concept'
      }
    ]
  }
];
