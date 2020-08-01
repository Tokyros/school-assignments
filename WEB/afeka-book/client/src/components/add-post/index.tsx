import * as React from 'react';
import { Post } from '../../model/posts';

export type AddPostProps = {
    onPostAdded: (textContent: string, imageData: string[]) => void;
}

async function FileUpload(files: File[]) {
    const formData = new FormData()

    files.forEach((file, idx) => {
        formData.append(idx + '', file);
    })

    const res = await (await fetch(`http://localhost/api/file-upload`, {
      method: 'POST',
      body: formData
    })).json();
    
    return res.paths as string[];
  }

export const AddPost: React.FC<AddPostProps> = ({onPostAdded}) => {
    const [textContent, setTextContent] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);
    const submitPost = async () => {
        const maybeFiles = inputRef.current?.files;
        const paths = maybeFiles ? await FileUpload(Array.from(maybeFiles)) : [];
        onPostAdded(textContent, paths);        
    }

    return (
        <div className='add-post'>
            <textarea value={textContent} onChange={(e) => setTextContent(e.target.value)}/>
            <button onClick={submitPost}>Submit post</button>
            <input multiple type="file" accept="image/*" ref={inputRef} />
            {/* {selectedFile && <img src={URL.createObjectURL(selectedFile)} alt=""/>} */}
        </div>
    )
}