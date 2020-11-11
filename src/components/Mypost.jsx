import React, { Component } from 'react';
import "./Post.css";
import "./Profile.css";
import Post from "./Post";
import axios from 'axios';
import ProfileTop from './ProfileTop';


class Mypost extends Component {
    state = {
        posts: []
    };

    async componentDidMount() {
        // api se fetch 
        let userObj = await axios.get(" https://insta-backend-api.herokuapp.com/user/80b5f987-6e55-4264-9245-5fd75faa92e7");
        let user = userObj.data.user;
        let post = await axios.get(" https://insta-backend-api.herokuapp.com/mypost/80b5f987-6e55-4264-9245-5fd75faa92e7");
        post = post.data.user;

        let posts = [];
        for (let i = 0; i < post.length; i++) {
            let p = {
                pid: post[i].pid,
                name: user.name,
                caption: post[i].caption,
                pImage: user.pImage,
                postImage: post[i].postImage,
            }
            posts.push(p);
        }
        this.setState({
            posts: posts
        })

    }
    render() {
        let {
            posts
        } = this.state;
        return (
            <React.Fragment>

                <ProfileTop />
                <div className="posts">
                    {posts.map((post) => {
                        return <Post key={post.pid} post={post} />
                    })}
                </div>


            </React.Fragment>
        );
    }
}

export default Mypost;


