import React, { useState } from 'react'
import { Button, capitalize } from '@material-ui/core';
import firebase from 'firebase';
import { storage, db } from './firebase';
import './ImageUpload.css';

function ImageUpload({username}) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`image/${image.name}`).put(image);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                //Progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                //Error function ...
                console.log("ABC:::55000",error);
                alert(error.message);
            },
            () => {
                //complete function ...
                { console.log("ABC:;sucees passeing")}
                storage
                    .ref('image')
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        //post image inside db
                        db.collection('posts').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: usernamex
                        });
                        console.log("ABC::: post saved", caption, url, username)
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    })
            }
        );
    };

    return (
        <div className = 'imageupload'>
            <progress className='imageupload_progress' value={progress} max='100'/>
            <input type = 'text' placeholder = 'Enter a caption...' onChange={event => setCaption(event.target.value)} value={caption}/>
            <input type = 'file' onChange = {handleChange}/>
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
