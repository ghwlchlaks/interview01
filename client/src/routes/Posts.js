import React from 'react';
import {Route, Link} from 'react-router-dom';

const Post = ({match}) => {
    return (
        <div>
            {match.params.title} 포스트
        </div>
    )
}
const Posts = () => {
    return (
        <div>
            <h1>포스트</h1>
            <Link to="/posts/react">react</Link>
            <Link to="/posts/redux">redux</Link>
            <Link to="/posts/relay">relay</Link>
            <Route path="/posts/:title"
            component={Post}
            />
        </div>
    );
};

export default Posts;

