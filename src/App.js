import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post'
import { db, auth, storage } from './firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload.js';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
   
      db.collection('posts').onSnapshot(snapshot => {
        setPosts(snapshot.docs.map(doc => ({

          id: doc.id,
          post: doc.data()
        })));
      })
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in...
        console.log(authUser);
        setUser(authUser);
      } else {
        //user has logged Out...
        setUser(null);
      }
    })

    return () => {
      //perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]); 

  // let posts = [{ id: "11222", caption:"Anandfd", imageUrl:"asdfgh"},{ id: "11222", caption:"Anandfd", imageUrl:"asdfgh"}, ]


  
 
  const signUp = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
        return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
      .segnInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  }

  return (
    <div className="App">    
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        >
          <div style={modalStyle} className={classes.paper}>
            <form className='app_signup'>
              <center>
                <img
                  className = 'app_headerImage'
                  src = 'https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                  alt = ''           
              />
              </center>
                <Input
                  type = 'text'
                  placeholder = 'username'
                  value = {username}
                  onChange = {(e) => setUsername(e.target.value)}
                />  
                <Input
                  placeholder = 'email'  
                  type = 'text'
                  value = {email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder = 'password'
                  type = 'password'
                  value = {password}
                  onChange = {(e) => setPassword(e.target.value)}
                />
              <Button type = 'submit' onClick = {signUp}>Sign Up</Button>
            </form>
          </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        >
          <div style={modalStyle} className={classes.paper}>
            <form className='app_signup'>
              <center>
                <img
                  className = 'app_headerImage'
                  src = 'https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                  alt = ''           
              />
              </center>
                <Input
                  placeholder = 'email'  
                  type = 'text'
                  value = {email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder = 'password'
                  type = 'password'
                  value = {password}
                  onChange = {(e) => setPassword(e.target.value)}
                />
              <Button type = 'submit' onClick = {signIn}>Sign In</Button>
            </form>
          </div>
      </Modal>

      <div className='app_header'>
        <img 
          className='app_headerImage'
          src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
          alt=''  
        />
        {user ? (
          
          <Button onClick = {() => auth.signOut()}>Logout</Button>  
        ): (
          <div className = 'app_loginContainer'>
            <Button onClick = {() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick = {() => setOpen(true)}>Sign Up</Button>          
          </div>
        )}
      </div>
          { console.log("ABC::Post", posts)}
      <div className='app_posts'>
        <div className='app_postsLeft'>
        {
          posts?.map(({id ,post}) => (
            <Post key={id} postId={id} user={user} username ={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))
          // <Post username="anand" caption="Wow, it did it" imageUrl="sdvf" />

        }
        </div>
        <div className='app_postsRight'>
        <InstagramEmbed
        url='https://instagr.am/p/Zw9o4/'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      />
        </div>
      </div>
      
      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ): (
        <h3>Sorry you need to login to upload</h3>
      )}
      
    </div>
  );
}

export default App;