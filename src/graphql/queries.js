/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getResearchers = /* GraphQL */ `
  query GetResearchers {
    getResearchers {
      id
      firstName
      lastName
      rank
      email
      department
      faculty
    }
  }
`;
export const getEdges = /* GraphQL */ `
  query GetEdges {
    getEdges {
      key
      source
      target
      sharedPublications
      size
    }
  }
`;
export const getResearcherData = /* GraphQL */ `
  query GetResearcherData {
    getResearcherData {
      links {
        key
        source
        target
        numPublications
      }
      nodes {
        id
        firstName
        lastName
        rank
        email
        department
        faculty
      }
    }
  }
`;
export const getResearcher = /* GraphQL */ `
  query GetResearcher($id: Int) {
    getResearcher(id: $id) {
      id
      firstName
      lastName
      rank
      email
      department
      faculty
    }
  }
`;
