import { useState } from 'react';

/**
 * DropdownMenu component for filtering options.
 *
 * @param props - The component props.
 * @returns The rendered DropdownMenu component.
 */

function DropdownMenu(props: any) {
  const [selectedOption, setSelectedOption] = useState('');

  /**
   * Handles the change event of the dropdown menu.
   * @param {any} event - The event object.
   * @returns {void}
   */
  const handleChange = (event: any): void => {
    setSelectedOption(event.target.value);
    filter(event.target.value);
  };


  /**
   * Filters the array based on the selected option.
   * @param option - The selected option for filtering.
   */
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
    </select>
  );
}

export default DropdownMenu;      