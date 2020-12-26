import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { graphql } from 'gatsby';


const Post = ({ data }) => {
// console.log("🚀 ~ data", data)
const post = data.markdownRemark
  return (
    <div className=" mt-24">
      <div>
        <h1>{post.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </div>
  )
}
export default Post;

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`