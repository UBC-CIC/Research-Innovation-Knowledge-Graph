/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getResearchers = /* GraphQL */ `
  query GetResearchers($facultiesToFilterOn: [String]) {
    getResearchers(facultiesToFilterOn: $facultiesToFilterOn) {
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
  query GetEdges($facultiesToFilterOn: [String]) {
    getEdges(facultiesToFilterOn: $facultiesToFilterOn) {
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
export const getSharedPublications = /* GraphQL */ `
  query GetSharedPublications($id1: String!, $id2: String!) {
    getSharedPublications(id1: $id1, id2: $id2) {
      title
      journal
      yearPublished
      authors
      link
    }
  }
`;
