import React from 'react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Button } from 'react-bootstrap';

const ExportButtons = ({ filteredData }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableData = filteredData.map(({ firstName, lastName, address }) => [firstName, lastName, address]);
     
    doc.autoTable({
        head: [['First Name', 'Last Name', 'Address']],
        body: tableData,
      });
      doc.save('instructors.pdf');
    };
  
    const exportToExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Instructors');
      XLSX.writeFile(workbook, 'instructors.xlsx');
    };
  
    return (
      <div>
        <CSVLink data={filteredData} filename="instructors.csv" className="btn btn-primary">
          Export CSV
        </CSVLink>
        <Button onClick={exportToPDF} className="btn btn-danger ms-2">
          Export PDF
        </Button>
        <Button onClick={exportToExcel} className="btn btn-success ms-2">
          Export Excel
        </Button>
      </div>
    );
  };
  
  export default ExportButtons;