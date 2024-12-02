import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemType = 'IMAGE';

const DraggableImage = ({ id, image, position, onUpdate }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { id, position },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      <img src={image} alt="draggable" width={100} height={100} />
    </div>
  );
};

const Map = () => {
  const [elements, setElements] = useState([
    { id: 1, image: 'https://via.placeholder.com/100', position: { x: 100, y: 100 } },
    { id: 2, image: 'https://via.placeholder.com/100', position: { x: 200, y: 150 } },
  ]);

  const moveImage = (id, newPosition) => {
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id ? { ...el, position: newPosition } : el
      )
    );
  };

  const [, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const newPosition = {
        x: Math.round(item.position.x + delta.x),
        y: Math.round(item.position.y + delta.y),
      };
      moveImage(item.id, newPosition);
    },
  }));

  return (
    <div
      ref={drop}
      style={{ position: 'relative', width: '800px', height: '600px', border: '1px solid black' }}
    >
      {elements.map((el) => (
        <DraggableImage
          key={el.id}
          id={el.id}
          image={el.image}
          position={el.position}
          onUpdate={moveImage}
        />
      ))}
    </div>
  );
};

// Обернем компонент Map в DndProvider
const MapWithDndProvider = () => (
  <DndProvider backend={HTML5Backend}>
    <Map />
  </DndProvider>
);

export default MapWithDndProvider;
