import * as React from 'react';

async function uploadFiles(files) {
    const formData = new FormData()

    files.forEach((file, idx) => {
        formData.append(idx + '', file);
    })

    const res = await (await fetch(`http://localhost/api/file-upload`, {
      method: 'POST',
      body: formData
    })).json();
    
    return res.paths;
  }

export const AddPost = ({onPostAdded}) => {
    const [textContent, setTextContent] = React.useState('');
    const [isPrivate, setIsPrivate] = React.useState(false);
    const inputRef = React.useRef(null);
    const submitPost = async () => {
        const maybeFiles = inputRef.current?.files;
        const paths = maybeFiles ? await uploadFiles(Array.from(maybeFiles)) : [];
        onPostAdded(textContent, paths, isPrivate);        
    }

    return (
        <div className='add-post'>
            <textarea value={textContent} onChange={(e) => setTextContent(e.target.value)}/>
            <button onClick={submitPost}>Submit post</button>
            <div className='inputs'>
                <input multiple type="file" accept="image/*" ref={inputRef} />
                <label htmlFor="private">Private</label>
                <input type="radio" name='private' onChange={() => setIsPrivate(true)} checked={isPrivate} value="male"></input>
                <label htmlFor="public">Public</label>
                <input type="radio" name='public' onChange={() => setIsPrivate(false)} checked={!isPrivate} value="male"></input>
            </div>
        </div>
    )
}