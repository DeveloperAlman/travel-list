import { useState } from "react";

function App() {
  const [items, setItems] = useState([]);

  // Add item
  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }

  // Delete item
  function handleDeleteItems(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  // Toggle item
  function handleToggleItems(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function handleClearList() {
    setItems([]);
  }
  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItems}
        onToggleItems={handleToggleItems}
        onClearList={handleClearList}
      />
      <Stats items={items} />
    </div>
  );
}
export default App;

function Logo() {
  return (
    <header>
      <h1>Vacation Check List 🌴</h1>
    </header>
  );
}

function Form({ onAddItems }) {
  const [itemDescription, setItemDescription] = useState("");
  const [select, setSelect] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!itemDescription) return;

    const newItem = { id: Date.now(), itemDescription, select, packed: false };
    console.log(newItem);
    onAddItems(newItem);

    // Set all to default setting after submitting form
    setItemDescription("");
    setSelect(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip?</h3>
      <input
        onChange={(e) => setItemDescription(e.target.value)}
        value={itemDescription}
        type="text"
        placeholder="Luggage"
      />
      {/* Controlled element works to take value of inputs and values accrdoign to State
      1) create useState 2) put value state into html elements (input, select, textarea)
      3) onChange function that will track any changes in inputs,
      onChange(e=>setState(e.target.value))  */}
      <select value={select} onChange={(e) => setSelect(+e.target.value)}>
        {/* Create 10 elements of array with empty values but 10 indexes and loop inside map method */}
        {Array.from({ length: 10 }, (_, i) => i + 1).map((option) => {
          return (
            <option value={option} key={option}>
              {option}
            </option>
          );
        })}
      </select>
      <button className="add">Add</button>
    </form>
  );
}

function PackingList({ items, onDeleteItem, onToggleItems, onClearList }) {
  const [sort, setSort] = useState("input");

  let sortedItems;
  if (sort === "input") sortedItems = items;
  if (sort === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.itemDescription.localeCompare(b.itemDescription));

  return (
    <div className="list">
      <ul>
        {sortedItems.map((itemObj) => (
          <Item
            item={itemObj}
            onToggleItems={onToggleItems}
            onDeleteItem={onDeleteItem}
            key={itemObj.id}
          />
        ))}
      </ul>

      <div className="actions">
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
        </select>

        <button onClick={onClearList}>Clear list</button>
      </div>
    </div>
  );
}

function Item({ item, onDeleteItem, onToggleItems }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => {
          onToggleItems(item.id);
        }}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.select} {item.itemDescription}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}

function Stats({ items }) {
  const packedItem = items.filter((item) => item.packed).length;
  const packedItemPercantage = Math.round((packedItem / items.length) * 100);

  return (
    <footer className="stats">
      <p>
        {packedItemPercantage === 100
          ? "You have everything for your future journey!"
          : `You have ${items.length} items on your list and you already packed
        ${packedItemPercantage}%`}
      </p>
    </footer>
  );
}
