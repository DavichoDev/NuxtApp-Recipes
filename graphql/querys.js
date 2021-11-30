import gql from "graphql-tag";

export const categories = gql`
  query {
    categories {
      id
      name
      icon
      slug
      img
    }
  }
`;

export const category = gql`
  query ($id: ID!) {
    category(id: $id) {
      description
    }
  }
`;
