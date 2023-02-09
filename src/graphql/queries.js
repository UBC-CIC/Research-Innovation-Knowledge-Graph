/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getResearchers = /* GraphQL */ `
  query GetResearchers {
    getResearchers {
      key
      attributes {
        label
        rank
        email
        department
        faculty
      }
    }
  }
`;
export const getEdges = /* GraphQL */ `
  query GetEdges {
    getEdges {
      key
      source
      target
      undirected
      attributes {
        size
        color
        sharedPublications
      }
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
        keywords
      }
    }
  }
`;
export const getResearcher = /* GraphQL */ `
  query GetResearcher($id: String!) {
    getResearcher(id: $id) {
      id
      firstName
      lastName
      rank
      email
      department
      faculty
      keywords
    }
  }
`;
