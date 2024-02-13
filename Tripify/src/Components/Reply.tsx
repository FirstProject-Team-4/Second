
// import React, { useState } from 'react';
// import { getDatabase, ref, onValue} from 'firebase/database';
// import { useEffect } from 'react';


// interface ReplyProps {
//   onReply: (replyContent: string) => void;
//     postId: string;
// }

// const Reply: React.FC<ReplyProps> = ({ onReply,postId }) => {
// const [replyContent, setReplyContent] = useState('');

// useEffect(() => {
//     const db = getDatabase();
//     const commentsRef = ref(db, `relies/${postId}`);

//     onValue(commentsRef, (snapshot) => {
//         const replyValues = snapshot.val() ? Object.values(snapshot.val()) : [];
//         const replyContentString = Array.isArray(replyValues) ? replyValues.join('') : '';
//         setReplyContent(replyContentString);
//     });
// }, [postId]);

// const handleReplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setReplyContent(e.target.value);
// };

//   const handleReplySubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onReply(replyContent);
//     setReplyContent('');
//   };

//   return (
//     <form onSubmit={handleReplySubmit}>
//       <input type="text" value={replyContent} onChange={handleReplyChange} />
//       <button type="submit">Add Reply</button>
//     </form>
//   );
// };

// export default Reply;