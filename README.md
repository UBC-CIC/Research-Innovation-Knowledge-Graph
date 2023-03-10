# Research-Innovation-Dashboard-Knowledge-Graph

| Index                                               | Description                                             |
| :-------------------------------------------------- | :------------------------------------------------------ |
| [High Level Architecture](#High-Level-Architecture) | High level overview illustrating component interactions |
| [Deployment](#Deployment-Guide)                     | How to deploy the project                               |
| [User Guide](#User-Guide)                           | The working solution                                    |
| [Files/Directories](#Files-And-Directories)         | Important files/directories in the project              |
| [Changelog](#Changelog)                             | Any changes post publish                                |
| [Credits](#Credits)                                 | Meet the team behind the solution                       |
| [License](#License)                                 | License details                                         |

# High Level Architecture

The following architecture diagram illustrates the various AWS components utliized to deliver the solution. For an in-depth explanation of the frontend and backend stacks, refer to the [Architecture Deep Dive](docs/ArchitectureDeepDive.md).

![Alt text](./docs/images/KnowledgeGraphArchitecture.png?raw=true "Architecture")

# Deployment Guide

To deploy this solution, please follow the steps laid out in the [Deployment Guide](docs/DeploymentGuide.md)

# User Guide

For instructions on how to navigate the web app interface, refer to the [Web App User Guide](docs/UserGuide.md).

# Files And Directories

```text
.
├── amplify
├── backend/
│   ├── cdk/
|   │   ├── layers/
├── node_modules
├── public
├── src/
│   ├── components/
│   │   ├── Authentication/
│   │   │   ├── ConfirmEmail.js
│   │   │   ├── ForceChangePassowrd.js
│   │   │   ├── ForgotPasswordComponent.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── Dropdown/
│   │   │   ├── dropdown.css
│   │   │   └── dropdown.js
│   │   ├── Navbar/
│   │   │   ├── navbar.css
│   │   │   └── navbar.js
│   │   ├── ResearcherGraph/
│   │   │   ├── helpers/
│   │   │   ├── ResearcherGraph.css
│   │   │   └── ResearcherGraph.js
│   │   ├── Searchbar/
│   │   │   ├── searchbar.css
│   │   │   └── searchbar.js
│   │   ├── AuthLayer.js
│   │   ├── FacultyFiltersDialog.js
│   │   ├── LoadingButton.js
│   │   └── TheApp.js
│   ├── graphql/
│   ├── .gitignore
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── reportWebVitals.js
│   ├── setupTests.js
├── .gitignore
├── .graphqlconfig.yml
├── package-lock.json
├── package.json
└── README.md
```

# Changelog
N/A

# Credits

This application was architected and developed by Matthew Stefansson... with guidance from the UBC CIC technical and project management teams.

# License

This project is distributed under the [MIT License](LICENSE).