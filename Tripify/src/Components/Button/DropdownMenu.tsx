import { useState } from 'react';

function DropdownMenu(props: any) {
  const [selectedOption, setSelectedOption] = useState('');



  const handleChange = (event: any) => {
    setSelectedOption(event.target.value);
    filter(event.target.value);
  };

  const filter = (option: string) => {
    if (option === 'createdOn Ascending') {
      return props.setArray([...props.array].sort((a: any, b: any) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime()));
    }
    if (option === 'createdOn Descending') {
      return props.setArray([...props.array].sort((a: any, b: any) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()));
    }
    props.setArray([...props.array].sort((a: any, b: any) => b[option] - a[option]));
  };
  return (
    <select value={selectedOption} onChange={handleChange} id='drop-down'>
      <option value="">Filter</option>
      <option value="likes">Likes</option>
      <option value="dislikes">Dislikes</option>
      <option value="createdOn Descending">Date ↑</option>
      <option value="createdOn Ascending">Date ↓</option>
      {/* Add more options as needed */}
    </select>
  );
}

export default DropdownMenu;      