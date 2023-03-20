/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAllFaculties = /* GraphQL */ `
  query GetAllFaculties {
    getAllFaculties
  }
`;
export const getEdges = /* GraphQL */ `
  query GetEdges($facultiesToFilterOn: [String], $keyword: String) {
    getEdges(facultiesToFilterOn: $facultiesToFilterOn, keyword: $keyword) {
      attributes {
        color
        sharedPublications
        size
      }
      key
      source
      target
      undirected
    }
  }
`;
export const getResearcher = /* GraphQL */ `
  query GetResearcher($id: String!) {
    getResearcher(id: $id) {
      department
      email
      faculty
      firstName
      id
      keywords
      lastName
      rank
    }
  }
`;
export const getResearcherData = /* GraphQL */ `
  query GetResearcherData {
    getResearcherData {
      links {
        key
        numPublications
        source
        target
      }
      nodes {
        department
        email
        faculty
        firstName
        id
        keywords
        lastName
        rank
      }
    }
  }
`;
export const getResearchers = /* GraphQL */ `
  query GetResearchers($facultiesToFilterOn: [String], $keyword: String) {
    getResearchers(
      facultiesToFilterOn: $facultiesToFilterOn
      keyword: $keyword
    ) {
      attributes {
        color
        department
        email
        faculty
        label
        rank
      }
      key
    }
  }
`;
export const getSharedPublications = /* GraphQL */ `
  query GetSharedPublications($id1: String!, $id2: String!) {
    getSharedPublications(id1: $id1, id2: $id2) {
      authors
      journal
      link
      title
      yearPublished
    }
  }
`;
export const getSimilarResearchers = /* GraphQL */ `
  query GetSimilarResearchers($researcher_id: String!) {
    getSimilarResearchers(researcher_id: $researcher_id) {
      firstName
      lastName
      id
      faculty
      sharedKeywords
    }
  }
`;
