import { useState } from 'react';

function LinkedData(props) {
    const { items } = props;
  const [open, setOpen] = useState(false);
    return (
        <div>
           {items && items.map((data, index) => (
            <div key={index}>
              <span>{data.name}</span> : 
              <span>{data.value}</span>
            </div>
          ))}
        </div>
    );
}
export default LinkedData;
