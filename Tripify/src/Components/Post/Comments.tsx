import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useAppContext } from '../../Context/AppContext';
import { addComment } from '../../Service/post-service';
// import Reply from '../Reply';
import Button from '../Button';

interface Comment {
  author: string;
  content: string;
  createdOn: number;
  replyTo: string | null;
  id: string;
}

interface CommentsProps {
  postId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { userData } = useAppContext();
  const [replyTo, setReplyTo] = useState<string | null>(null);


  const handleReply = (commentId: string) => {
    setReplyTo(commentId);
  }
  
  useEffect(() => {
    const db = getDatabase();
    const commentsRef = ref(db, 'comments/' + postId);

    onValue(commentsRef, (snapshot) => {
      setComments(snapshot.val() ? Object.values(snapshot.val()) : []);
    });
  }, [postId]);


  const handleNewCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  };

  //   const handleNewCommentSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();

  //     const db = getDatabase();
  //     const commentsRef = ref(db, 'comments/' + postId);

  //     await push(commentsRef, {
  //       author: userData.handle,
  //       content: newComment,
  //       createdOn: Date.now(),

  //     });

  //     setNewComment('');
  //   };



  const handleNewCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addComment(postId, userData.handle, newComment, replyTo);

    setNewComment('');
    setReplyTo(null);
  };

  return (


    <div>


    {/* Display the comments... */}
    {comments.map((comment, index) => (
      <div key={index} style={{ marginLeft: comment.replyTo ? '50px' : '0', border:'2px solid black', }}>
        <p>{comment.content} - {comment.author}</p>
        {/* <button onClick={() => handleReply(comment.author)}>Reply</button> */}
        <Button onClick={() => handleReply(comment.author)}>Reply</Button>
      </div>
    ))}

<form onSubmit={handleNewCommentSubmit}>
      <button type="submit">Add Comment</button>
      {replyTo && <p>Replying to comment {replyTo}</p>}
      <input type="text" value={newComment} onChange={handleNewCommentChange} />
      {/* <Button >Add Comment</Button> */}
    </form>

  </div>
);
};

export default Comments;