import { useReducer } from "react";
import {
  articleInitialState,
  type ArticleInitialStateInterface,
} from "./postData";

function articleReducer(
  state: ArticleInitialStateInterface,
  action: {
    type: string;
    field: string;
    payload: string | boolean | string[] | undefined;
  }
) {
  switch (action.type) {
    case "set-field":
      return { ...state, [action.field]: action.payload };
    case "add-post":
      
    default:
      return state;
  }
}

export function useArticleReducer(postType: string | null) {
  switch (postType) {
    case "article":
      return useReducer(articleReducer, articleInitialState);
    default:
      throw new Error(`Unknown post type: ${postType}`);
  }
}
