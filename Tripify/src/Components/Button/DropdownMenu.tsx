import { useState } from 'react';

function DropdownMenu(props: any) {
  const [selectedOption, setSelectedOption] = useState('');

  

  const handleChange = (event: any) => {
    setSelectedOption(event.target.value);
    filter(selectedOption);
  };

  const filter = (option: string) => {
    props.setArray([...props.array].sort((a: any, b: any) => a[option] - b[option]));
  };
  return (
    <select value={selectedOption} onChange={handleChange}>
      <option value="">Filter</option>
      <option value="likes">Likes</option>
      <option value="dislikes">Dislikes</option>
      {/* Add more options as needed */}
    </select>
  );
}

export default DropdownMenu;      