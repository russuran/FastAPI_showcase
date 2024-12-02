import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateFilter = ({ data }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState(data);

  const handleFilter = () => {
    const filtered = data.filter(item => {
      const itemDate = new Date(item.date);
      return (
        (!startDate || itemDate >= startDate) &&
        (!endDate || itemDate <= endDate)
      );
    });
    setFilteredData(filtered);
  };

  return (
    <div>
      <h2>Фильтр по датам</h2>
      <div>
        <label>Дата "от": </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <div>
        <label>Дата "до": </label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <button onClick={handleFilter}>Применить фильтр</button>

      <h3>Результаты:</h3>
      <ul>
        {filteredData.map((item, index) => (
          <li key={index}>{item.date}: {item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default DateFilter;
