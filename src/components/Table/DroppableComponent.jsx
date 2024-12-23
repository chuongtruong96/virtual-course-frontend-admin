import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

const DroppableComponent = ({ someProp = 'default', droppableId, children }) => {
  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{ padding: someProp === 'default' ? '10px' : '20px' }} // Example of using the prop
        >
          {children}
        </div>
      )}
    </Droppable>
  );
};

export default DroppableComponent;
